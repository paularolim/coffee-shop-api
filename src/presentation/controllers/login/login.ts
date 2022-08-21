import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok } from '../../helpers/http-helper';
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

    const isValid = this.emailValidator.isValid(httpRequest?.body?.email);
    if (!isValid) {
      return new Promise((resolve) => resolve(badRequest(new InvalidParamError('email'))));
    }

    return new Promise((resolve) => resolve(ok({})));
  }
}
