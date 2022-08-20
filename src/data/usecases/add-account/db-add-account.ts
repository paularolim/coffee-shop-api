import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/account/add-account-repository';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  private readonly addAccount: AddAccountRepository;

  constructor(encrypter: Encrypter, addAccount: AddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccount = addAccount;
  }

  async add({ name, email, password }: AddAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(password);
    return this.addAccount.add({ name, email, password });
  }
}
