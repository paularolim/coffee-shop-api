import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper';
import {
  EmailValidator,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './login-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly authentication: Authentication;

  private readonly validation: Validation;

  constructor(
    emailValidator: EmailValidator,
    authentication: Authentication,
    validation: Validation,
  ) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    const validationError = this.validation.validate(httpRequest.body);
    if (validationError) {
      return badRequest(validationError);
    }

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

      const accessToken = await this.authentication.auth(
        httpRequest?.body?.email,
        httpRequest?.body?.password,
      );
      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
