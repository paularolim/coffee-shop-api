import { faker } from '@faker-js/faker';
import request from 'supertest';
import { app } from '../config/app';

describe('SignUp Routes', () => {
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
