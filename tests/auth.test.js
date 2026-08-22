const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {

  it('should register a new user successfully', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: '123456',
        role_id: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(uniqueEmail);
  });

  it('should not register with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'incomplete@example.com'
      });

    expect(res.statusCode).toBe(400);
  });

  it('should login successfully with correct credentials', async () => {
    const uniqueEmail = `logintest${Date.now()}@example.com`;
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login Test User',
        email: uniqueEmail,
        password: '123456',
        role_id: 1
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.message).toBe('Login successful');
  });

  it('should not login with wrong password', async () => {
    const uniqueEmail = `wrongpass${Date.now()}@example.com`;
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Wrong Pass User',
        email: uniqueEmail,
        password: '123456',
        role_id: 1
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(400);
  });

});