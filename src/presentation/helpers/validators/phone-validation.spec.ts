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
      return false;
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
});
