import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMySQLRepository } from '../../infra/database/my-sql/account-repository/account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignUpController = (): SignUpController => {
  const salt = 12;

  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(salt);
  const repository = new AccountMySQLRepository();
  const dbAddAccount = new DbAddAccount(encrypter, repository);

  return new SignUpController(emailValidator, dbAddAccount);
};
