import { v4 as uuid } from 'uuid';
import { LogErrorRepository } from '../../../../data/protocols/database/log-error-repository';
import { MySQLHelper } from '../helpers/my-sql-helper';

export class LogErrorMySQLRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const id = uuid();
    const date = new Date();
    await MySQLHelper.connection('logs').insert({ id, stack, date });
  }
}
