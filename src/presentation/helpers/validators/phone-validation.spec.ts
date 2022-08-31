import { InvalidParamError } from '../../errors';
import { PhoneValidator } from '../../protocols/phone-validator';
import { PhoneValidation } from './phone-validation';

interface SutTypes {
  phoneValidatorStub: PhoneValidator;
  sut: PhoneValidation;
}

const makePhoneValidator = (): PhoneValidator => {
  class PhoneValidatorStub implements PhoneValidator {
    isValid(phone: string): boolean {
      return true;
    }
  }

  return new PhoneValidatorStub();
};

const makeSut = (): SutTypes => {
  const phoneValidatorStub = makePhoneValidator();
  const sut = new PhoneValidation('phone', phoneValidatorStub);
  return { sut, phoneValidatorStub };
};

describe('PhoneValidation', () => {
  it('should return an error if PhoneValidator returns false', () => {
    const { sut, phoneValidatorStub } = makeSut();
    jest.spyOn(phoneValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ phone: 'any_phone' });

    expect(error).toEqual(new InvalidParamError('phone'));
  });

  it('should return null if PhoneValidator returns true', () => {
    const { sut, phoneValidatorStub } = makeSut();
    jest.spyOn(phoneValidatorStub, 'isValid');

    const validate = sut.validate({ phone: 'any_phone' });

    expect(validate).toBeNull();
  });

  it('should call PhoneValidator with correct phone', () => {
    const { sut, phoneValidatorStub } = makeSut();
    const isValid = jest.spyOn(phoneValidatorStub, 'isValid').mockReturnValueOnce(false);

    sut.validate({ phone: 'any_phone' });

    expect(isValid).toHaveBeenCalledWith('any_phone');
  });

  it('should throw if PhoneValidator throws', () => {
    const { sut, phoneValidatorStub } = makeSut();
    jest.spyOn(phoneValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
