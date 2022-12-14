import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper';
import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './login-protocols';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

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
