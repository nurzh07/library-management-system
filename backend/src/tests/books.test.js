const request = require('supertest');
const app = require('../app');

describe('Books API (public)', () => {
  it('GET /api/books returns paginated list', async () => {
    const res = await request(app)
      .get('/api/books')
      .query({ page: 1, limit: 5 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('books');
    expect(res.body.data).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data.books)).toBe(true);
  });
});

describe('Metrics', () => {
  it('GET /metrics returns Prometheus format', async () => {
    const res = await request(app).get('/metrics').expect(200);
    expect(res.text.length).toBeGreaterThan(50);
    expect(res.text).toMatch(/process_|nodejs_|# HELP|# TYPE/);
  });
});
