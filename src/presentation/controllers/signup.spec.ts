import { MissingParamError } from '../errors';
import { SignUpController } from './signup';

const makeSut = (): SignUpController => new SignUpController();

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password is provided', () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('password'));
  });
});
