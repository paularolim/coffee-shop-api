import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMySQLRepository } from '../../../infra/database/my-sql/account-repository/account';
import { LogErrorMySQLRepository } from '../../../infra/database/my-sql/log-error-repository/log-error';
import { LoginController } from '../../../presentation/controllers/login/login';
import { LogControllerDecorator } from '../../decorators/log';
import { makeLoginValidation } from './login-factory-validation';

export const makeLoginController = () => {
  const salt = 12;

  const repository = new AccountMySQLRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter('');

  const dbAuthentication = new DbAuthentication(repository, bcryptAdapter, jwtAdapter);
  const loginController = new LoginController(dbAuthentication, makeLoginValidation());

  const logErrorRepository = new LogErrorMySQLRepository();
  return new LogControllerDecorator(loginController, logErrorRepository);
};
