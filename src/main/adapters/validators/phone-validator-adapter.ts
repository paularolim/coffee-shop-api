import validator from 'validator';
import { PhoneValidator } from '../../../presentation/protocols/phone-validator';

export class PhoneValidatorAdapter implements PhoneValidator {
  constructor(private readonly locale: validator.PhoneLocale) {}

  isValid(phone: string): boolean {
    return validator.isMobilePhone(phone, this.locale);
  }
}
