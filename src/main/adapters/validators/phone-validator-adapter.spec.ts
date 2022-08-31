import validator from 'validator';
import { PhoneValidatorAdapter } from './phone-validator-adapter';

jest.mock('validator', () => ({
  isMobilePhone(): boolean {
    return true;
  },
}));

describe('PhoneValidatorAdapter', () => {
  it('should return false if validator returns false', () => {
    const sut = new PhoneValidatorAdapter('pt-BR');
    jest.spyOn(validator, 'isMobilePhone').mockReturnValueOnce(false);
    const isValid = sut.isValid('any_phone');
    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = new PhoneValidatorAdapter('pt-BR');
    const isValid = sut.isValid('any_phone');
    expect(isValid).toBe(true);
  });

  it('should call validator with correct phone', () => {
    const sut = new PhoneValidatorAdapter('pt-BR');
    const isPhoneSpy = jest.spyOn(validator, 'isMobilePhone');
    sut.isValid('any_phone');

    expect(isPhoneSpy).toHaveBeenCalledWith('any_phone', 'pt-BR');
  });
});
