import { faker } from '@faker-js/faker';
import request from 'supertest';
import { MySQLHelper } from '../../infra/database/my-sql/helpers/my-sql-helper';
import { app } from '../config/app';

describe('Login Routes', () => {
  beforeAll(async () => {
    await MySQLHelper.connect();
  });

  afterAll(async () => {
    await MySQLHelper.disconnect();
  });

  afterEach(async () => {
    await MySQLHelper.connection('users').delete();
  });

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const fakeAccount = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(8),
      };

      await request(app).post('/api/signup').send(fakeAccount);

      await request(app)
        .post('/api/login')
        .send({
          email: fakeAccount.email,
          password: fakeAccount.password,
        })
        .expect(200);
    });

    it('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(8),
        })
        .expect(401);
    });
  });
});
