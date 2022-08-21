import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
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

      this.authentication.auth(httpRequest?.body?.email, httpRequest?.body?.password);

      return new Promise((resolve) => resolve(ok({})));
    } catch (error) {
      return new Promise((resolve) => resolve(serverError(error as Error)));
    }
  }
}
