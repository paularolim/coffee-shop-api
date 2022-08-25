import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/account/add-account-repository';
import { Encrypter } from '../../protocols/criptography/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  private readonly addAccount: AddAccountRepository;

  constructor(encrypter: Encrypter, addAccount: AddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccount = addAccount;
  }

  async add({ name, email, password }: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter.encrypt(password);
    return this.addAccount.add({ name, email, password: hashedPassword });
  }
}
