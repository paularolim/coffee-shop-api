import request from 'supertest';
import { app } from '../config/app';

describe('Body parser middleware', () => {
  it('should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });

    await request(app).post('/test_body_parser').send({ test: '123' }).expect({ test: '123' });
  });
});
