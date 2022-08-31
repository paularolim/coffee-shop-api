/* eslint-disable max-classes-per-file */
import {
  ValidationComposite,
  EmailValidation,
  PhoneValidation,
  RequiredFieldsValidation,
} from '../../../presentation/helpers/validators';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { makeSignUpValidation } from './signup-validation';
import { PhoneValidator } from '../../../presentation/protocols/phone-validator';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makePhoneValidator = (): PhoneValidator => {
  class PhoneValidatorStub implements PhoneValidator {
    constructor(private readonly locale: string) {}

    isValid(): boolean {
      return true;
    }
  }

  return new PhoneValidatorStub('pt-BR');
};

describe('SignUp Validation', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'phone']) {
      validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    validations.push(new PhoneValidation('phone', makePhoneValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
