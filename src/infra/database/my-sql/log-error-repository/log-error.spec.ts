import { MySQLHelper } from '../helpers/my-sql-helper';
import { LogErrorMySQLRepository } from './log-error';

describe('LogErrorMySQLRepository', () => {
  beforeAll(async () => {
    await MySQLHelper.connect();
  });

  afterAll(async () => {
    await MySQLHelper.disconnect();
  });

  beforeEach(async () => {
    await MySQLHelper.connection('logs').delete();
  });

  it('should insert log on database', async () => {
    const sut = new LogErrorMySQLRepository();

    await sut.logError('any_error_stack');
    const count = (await MySQLHelper.connection('logs').select()).length;
    expect(count).toBe(1);
  });
});
