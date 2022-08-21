import { MissingParamError } from '../../errors';
import { badRequest, ok } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class LoginController implements Controller {
  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest?.body?.[field]) {
        return new Promise((resolve) => resolve(badRequest(new MissingParamError(field))));
      }
    }

    return new Promise((resolve) => resolve(ok({})));
  }
}
