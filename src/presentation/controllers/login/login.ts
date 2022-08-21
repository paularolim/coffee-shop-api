import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper';
import {
  EmailValidator,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
} from './login-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest?.body?.[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    try {
      const isValid = this.emailValidator.isValid(httpRequest?.body?.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const isAuth = await this.authentication.auth(
        httpRequest?.body?.email,
        httpRequest?.body?.password,
      );
      if (!isAuth) {
        return unauthorized();
      }

      return ok({});
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
