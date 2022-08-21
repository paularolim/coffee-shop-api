import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest?.body?.[field]) {
        return new Promise((resolve) => resolve(badRequest(new MissingParamError(field))));
      }
    }

    try {
      const isValid = this.emailValidator.isValid(httpRequest?.body?.email);
      if (!isValid) {
        return new Promise((resolve) => resolve(badRequest(new InvalidParamError('email'))));
      }

      return new Promise((resolve) => resolve(ok({})));
    } catch (error) {
      return new Promise((resolve) => resolve(serverError(error as Error)));
    }
  }
}
