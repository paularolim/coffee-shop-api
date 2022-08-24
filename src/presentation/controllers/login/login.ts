import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper';
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  AuthenticationModel,
} from './login-protocols';

export class LoginController implements Controller {
  private readonly authentication: Authentication;

  private readonly validation: Validation;

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return badRequest(validationError);
      }

      const accessToken = await this.authentication.auth({
        email: httpRequest?.body?.email,
        password: httpRequest?.body?.password,
      });
      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
