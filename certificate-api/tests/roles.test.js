const request = require('supertest');
const app = require('../server');

describe('Roles Endpoints', () => {

  it('should get list of all roles', async () => {
    const res = await request(app).get('/api/roles');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get users with their roles', async () => {
    const res = await request(app).get('/api/users-with-roles');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should assign a role to a user', async () => {
    // Pehle ek user register karte hain
    const uniqueEmail = `roletest${Date.now()}@example.com`;
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Role Test User',
        email: uniqueEmail,
        password: '123456',
        role_id: 1
      });

    const userId = registerRes.body.user.id;

    // Ab uska role change karte hain
    const res = await request(app)
      .put('/api/assign-role')
      .send({
        user_id: userId,
        role_id: 2
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role_id).toBe(2);
  });

});