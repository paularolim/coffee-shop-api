import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';

export interface AddAccountRepository {
  add: (data: AddAccountModel) => Promise<AccountModel | null>;
}
