import { PhoneValidatorAdapter } from './phone-validator-adapter';

describe('PhoneValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new PhoneValidatorAdapter();
    const isValid = sut.isValid('any_phone');
    expect(isValid).toBe(false);
  });
});
