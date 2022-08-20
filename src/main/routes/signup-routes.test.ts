import { faker } from '@faker-js/faker';
import request from 'supertest';
import { MySQLHelper } from '../../infra/database/my-sql/helpers/my-sql-helper';
import { app } from '../config/app';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MySQLHelper.connect();
  });

  afterAll(async () => {
    await MySQLHelper.disconnect();
  });

  afterEach(async () => {
    await MySQLHelper.connection('users').delete();
  });

  it('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
      })
      .expect(200);
  });
});
