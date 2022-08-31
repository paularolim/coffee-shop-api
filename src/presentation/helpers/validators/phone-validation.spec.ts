import { InvalidParamError } from '../../errors';
import { PhoneValidator } from '../../protocols/phone-validator';
import { PhoneValidation } from './phone-validation';

describe('PhoneValidation', () => {
  it('should return an error if PhoneValidator returns false', () => {
    class PhoneValidationStub implements PhoneValidator {
      isValid(phone: string): boolean {
        return false;
      }
    }

    const phoneValidationStub = new PhoneValidationStub();
    const sut = new PhoneValidation('phone', phoneValidationStub);
    jest.spyOn(phoneValidationStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({ phone: 'any_phone' });

    expect(error).toEqual(new InvalidParamError('phone'));
  });
});
