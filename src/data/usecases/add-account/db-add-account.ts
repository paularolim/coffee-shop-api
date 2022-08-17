import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add({ password }: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(password);
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => resolve({ id: '', email: '', name: '', password: '' }));
  }
}
