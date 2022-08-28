import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMySQLRepository } from '../../../infra/database/my-sql/account-repository/account';
import { LogErrorMySQLRepository } from '../../../infra/database/my-sql/log-error-repository/log-error';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const salt = 12;

  const hasher = new BcryptAdapter(salt);
  const repository = new AccountMySQLRepository();
  const dbAddAccount = new DbAddAccount(hasher, repository);

  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation());
  const logErrorRepository = new LogErrorMySQLRepository();
  return new LogControllerDecorator(signUpController, logErrorRepository);
};
