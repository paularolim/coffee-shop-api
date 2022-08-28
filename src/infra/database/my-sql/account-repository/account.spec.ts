import { faker } from '@faker-js/faker';
import { v4 as uuid } from 'uuid';
import { MySQLHelper } from '../helpers/my-sql-helper';
import { AccountMySQLRepository } from './account';

describe('Account MySQL repository', () => {
  beforeAll(async () => {
    await MySQLHelper.connect();
  });

  afterAll(async () => {
    await MySQLHelper.disconnect();
  });

  afterEach(async () => {
    await MySQLHelper.connection('users').delete();
  });

  it('should return an account on add success', async () => {
    const sut = new AccountMySQLRepository();

    const accountMock = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(8),
    };
    const account = await sut.add(accountMock);

    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe(accountMock.name);
    expect(account?.email).toBe(accountMock.email);
    expect(account?.password).toBe(accountMock.password);
  });

  it('should return an account on load success', async () => {
    const sut = new AccountMySQLRepository();
    const id = uuid();

    await MySQLHelper.connection
      .insert({ id, name: 'any_name', email: 'any_email', password: 'any_password' })
      .into('users');

    const account = await sut.loadByEmail('any_email');

    expect(account).toBeTruthy();
    expect(account?.id).toBe(id);
    expect(account?.name).toBe('any_name');
    expect(account?.email).toBe('any_email');
    expect(account?.password).toBe('any_password');
  });
});
