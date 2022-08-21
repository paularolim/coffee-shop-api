import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import {
  EmailValidator,
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
} from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({
        name: httpRequest?.body?.name,
        email: httpRequest?.body?.email,
        password: httpRequest?.body?.password,
      });

      return ok(account);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
