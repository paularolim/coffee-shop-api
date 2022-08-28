import { PhoneValidator } from '../../../presentation/protocols/phone-validator';

export class PhoneValidatorAdapter implements PhoneValidator {
  isValid(phone: string): boolean {
    return false;
  }
}
