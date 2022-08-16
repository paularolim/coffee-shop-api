import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import { EmailValidator, HttpRequest, HttpResponse } from '../protocols';

export class SignUpController {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse | null {
    const requiredFields = ['name', 'email', 'password'];
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
    } catch {
      return serverError();
    }

    return null;
  }
}
