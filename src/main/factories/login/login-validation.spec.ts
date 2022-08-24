import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { Validation } from '../../../presentation/protocols/validation';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { makeLoginValidation } from './login-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('Login Validation', () => {
  it('should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
