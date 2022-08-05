import { MissingParamError } from '../errors';
import { badRequest } from '../helpers/http-helper';
import { HttpResponse } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: any): HttpResponse | null {
    const requiredFields = ['name'];
    for (const field of requiredFields) {
      if (!httpRequest?.body?.[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return null;
  }
}
