import { MissingParamError } from '../errors';
import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new SignUpController();

    const httpRequest = {
      email: 'any_email',
      password: 'any_password',
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse?.statusCode).toBe(400);
    expect(httpResponse?.body).toEqual(new MissingParamError('name'));
  });
});
