import {
  ValidationComposite,
  EmailValidation,
  RequiredFieldsValidation,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password']) {
    validations.push(new RequiredFieldsValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
