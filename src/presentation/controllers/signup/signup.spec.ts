/* eslint-disable max-classes-per-file */
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Validation } from '../login/login-protocols';
import { SignUpController } from './signup';
import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
} from './signup-protocols';

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeValidaton = (): Validation => {
  class ValidatonStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidatonStub();
};

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccountStub();
  const validationStub = makeValidaton();
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    const fakeHttpRequest = makeFakeHttpRequest();
    await sut.handle(fakeHttpRequest);

    expect(addSpy).toHaveBeenCalledWith(fakeHttpRequest.body);
  });

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(() => new Promise((_, reject) => reject(new Error())));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  it('should call Validaton with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
