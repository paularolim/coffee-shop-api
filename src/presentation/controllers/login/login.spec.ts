/* eslint-disable max-classes-per-file */
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper';
import { LoginController } from './login';
import { Authentication, EmailValidator, HttpRequest, Validation } from './login-protocols';

interface SutTypes {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new AuthenticationStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidaton();
  return {
    sut: new LoginController(emailValidatorStub, authenticationStub, validationStub),
    emailValidatorStub,
    authenticationStub,
    validationStub,
  };
};

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password',
  },
});

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeHttpRequest());

    expect(isValidSpy).toHaveBeenCalledWith('any_email');
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce((email: string) => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();

    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeHttpRequest());

    expect(authSpy).toHaveBeenCalledWith('any_email', 'any_password');
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(() => new Promise((_, reject) => reject(new Error())));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  it('should call Validaton with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation returns and error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockImplementationOnce(() => new MissingParamError('any_field'));

    const httpResponse = await sut.handle(makeFakeHttpRequest());

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
