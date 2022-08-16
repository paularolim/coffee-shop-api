import { AddAccount } from '../../domain/usecases/add-account';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import { EmailValidator, HttpRequest, HttpResponse } from '../protocols';

export class SignUpController {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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

      this.addAccount.add({
        name: httpRequest?.body?.name,
        email: httpRequest?.body?.email,
        password: httpRequest?.body?.password,
      });
    } catch {
      return serverError();
    }

    return null;
  }
}
