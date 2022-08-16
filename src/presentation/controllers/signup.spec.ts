import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';
import { SignUpController } from './signup';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
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

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  return { sut: new SignUpController(emailValidatorStub), emailValidatorStub };
};

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
      },
    };

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_invalid_email');
  });

  it('should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_invalid_email',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(500);
    expect(httpResponse?.body).toEqual(new ServerError());
  });
});
