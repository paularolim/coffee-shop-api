import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMySQLRepository } from '../../infra/database/my-sql/account-repository/account';
import { LogErrorMySQLRepository } from '../../infra/database/my-sql/log-error-repository/log-error';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/log';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const salt = 12;

  const encrypter = new BcryptAdapter(salt);
  const repository = new AccountMySQLRepository();
  const dbAddAccount = new DbAddAccount(encrypter, repository);

  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation());
  const logErrorRepository = new LogErrorMySQLRepository();
  return new LogControllerDecorator(signUpController, logErrorRepository);
};
