/* eslint-disable max-classes-per-file */
import { MissingParamError } from '../../errors';
import { ValidationComposite } from './validation-composite';
import { Validation } from './validaton';

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationComposite([new ValidationStub()]);
};

const makeSut = () => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return { validationStubs, sut };
};

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toEqual(new MissingParamError('any_field'));
  });

  it('should return the first error if more the one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toEqual(new Error());
  });

  it('should return not if all validations succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validate({ any_field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
