import { badRequest, ok, serverError } from '../../helpers/http/http-helper';
import { Validation } from '../login/login-protocols';
import { AddAccount, Controller, HttpRequest, HttpResponse } from './signup-protocols';

export class SignUpController implements Controller {
  constructor(private readonly addAccount: AddAccount, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest?.body);
      if (validationError) {
        return badRequest(validationError);
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
