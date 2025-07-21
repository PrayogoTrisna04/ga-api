import request from 'supertest';
import { createServer } from 'http';
import app from '../src/app/api'


describe('POST /api/auth/login', () => {
  it('should return token if login is successful', async () => {
    const response = await request(createServer(app))
      .post('/api/auth/login')
      .send({ email: 'yogo@mail.com', password: 'yourPassword123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 401 if password is wrong', async () => {
    const response = await request(createServer(app))
      .post('/api/auth/login')
      .send({ email: 'yogo@mail.com', password: 'wrongPassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 if user not found', async () => {
    const response = await request(createServer(app))
      .post('/api/auth/login')
      .send({ email: 'unknown@mail.com', password: 'anything' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});
