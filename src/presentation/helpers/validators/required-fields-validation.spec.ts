import { MissingParamError } from '../../errors';
import { RequiredFieldsValidation } from './required-fields-validation';

const makeSut = (): { sut: RequiredFieldsValidation } => {
  const sut = new RequiredFieldsValidation('any_field');
  return { sut };
};

describe('Required fields Validator', () => {
  it('should return MissingParamError if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({ other_field: 'any_value' });
    expect(error).toEqual(new MissingParamError('any_field'));
  });

  it('should return not if validation succeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
