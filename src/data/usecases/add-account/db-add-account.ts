import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/account/add-account-repository';
import { Hasher } from '../../protocols/criptography/hasher';

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher;

  private readonly addAccount: AddAccountRepository;

  constructor(hasher: Hasher, addAccount: AddAccountRepository) {
    this.hasher = hasher;
    this.addAccount = addAccount;
  }

  async add({ name, email, password }: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.hasher.hash(password);
    return this.addAccount.add({ name, email, password: hashedPassword });
  }
}
