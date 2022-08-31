import {
  ValidationComposite,
  EmailValidation,
  RequiredFieldsValidation,
  PhoneValidation,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';
import { PhoneValidatorAdapter } from '../../adapters/validators/phone-validator-adapter';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'phone']) {
    validations.push(new RequiredFieldsValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  validations.push(new PhoneValidation('phone', new PhoneValidatorAdapter('pt-BR')));
  return new ValidationComposite(validations);
};
