import { InvalidParamError } from '../../errors';
import { EmailValidator } from '../../protocols/email-validator';
import { EmailValidation } from './email-validation';

export interface SutTypes {
  sut: EmailValidation;
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
  const sut = new EmailValidation('email', emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe('Email Validator', () => {
  it('should return an error if EmailValidator returns false', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ email: 'any_email' });

    expect(error).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate({ email: 'any_email' });

    expect(isValidSpy).toHaveBeenCalledWith('any_email');
  });

  it('should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
