import { v4 as uuid } from 'uuid';
import { AddAccountRepository } from '../../../../data/protocols/database/account/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MySQLHelper } from '../helpers/my-sql-helper';

export class AccountMySQLRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel | null> {
    const id = uuid();

    await MySQLHelper.connection.insert({ id, ...account }).into('users');
    const inserted = await MySQLHelper.connection
      .select()
      .from<AccountModel>('users')
      .where('id', id)
      .first()
      .then((result) => result);
    return inserted || null;
  }
}
