import { InvalidParamError } from '../../errors';
import { PhoneValidator } from '../../protocols/phone-validator';
import { Validation } from '../../protocols/validation';

export class PhoneValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly phoneValidator: PhoneValidator,
  ) {}

  validate(input: any): Error | null {
    const isValid = this.phoneValidator.isValid(input?.[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  }
}
