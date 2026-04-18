const request = require('supertest');
const app = require('../app');
const { Author, User } = require('../models');

// Test user token
let authToken;
let adminUser;

describe('Authors API', () => {
  beforeEach(async () => {
    // Clean up
    await Author.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: { email: 'admin@test.com' }, truncate: false });
    
    // Create admin user for protected routes
    adminUser = await User.create({
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    
    // Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123'
      });
    
    authToken = loginRes.body.data.token;
  });

  describe('GET /api/authors', () => {
    beforeEach(async () => {
      await Author.bulkCreate([
        { firstName: 'Мұхтар', lastName: 'Ауезов', nationality: 'Қазақстан' },
        { firstName: 'Абай', lastName: 'Құнанбаев', nationality: 'Қазақстан' },
        { firstName: 'Федор', lastName: 'Достоевский', nationality: 'Ресей' }
      ]);
    });

    it('should return all authors with pagination', async () => {
      const res = await request(app)
        .get('/api/authors?page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('authors');
      expect(res.body.data).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data.authors)).toBe(true);
      expect(res.body.data.authors.length).toBeGreaterThan(0);
    });

    it('should search authors by name', async () => {
      const res = await request(app)
        .get('/api/authors?search=' + encodeURIComponent('Мұхтар') + '&page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.authors.length).toBeGreaterThan(0);
      expect(res.body.data.authors[0].firstName).toBe('Мұхтар');
    });

    it('should sort authors by lastName', async () => {
      const res = await request(app)
        .get('/api/authors?sortBy=lastName&sortOrder=ASC&page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.authors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/authors/:id', () => {
    let author;

    beforeEach(async () => {
      author = await Author.create({
        firstName: 'Тест',
        lastName: 'Автор',
        nationality: 'Қазақстан',
        biography: 'Тест биография'
      });
    });

    it('should return author by id', async () => {
      const res = await request(app)
        .get(`/api/authors/${author.id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', author.id);
      expect(res.body.data).toHaveProperty('firstName', 'Тест');
    });

    it('should return 404 for non-existent author', async () => {
      const res = await request(app)
        .get('/api/authors/99999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/authors (Admin only)', () => {
    it('should create new author with valid data', async () => {
      const authorData = {
        firstName: 'Жаңа',
        lastName: 'Автор',
        nationality: 'Қазақстан',
        biography: 'Жаңа автордың биографиясы'
      };

      const res = await request(app)
        .post('/api/authors')
        .set('Authorization', `Bearer ${authToken}`)
        .send(authorData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('author');
      expect(res.body.data.author).toHaveProperty('id');
      expect(res.body.data.author.firstName).toBe(authorData.firstName);
    });

    it('should not create author without authentication', async () => {
      const res = await request(app)
        .post('/api/authors')
        .send({
          firstName: 'Тест',
          lastName: 'Автор'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/authors/:id (Admin only)', () => {
    let author;

    beforeEach(async () => {
      author = await Author.create({
        firstName: 'Ескі',
        lastName: 'Аты',
        nationality: 'Қазақстан'
      });
    });

    it('should update author with valid data', async () => {
      const updateData = {
        firstName: 'Жаңа',
        lastName: 'Аты'
      };

      const res = await request(app)
        .put(`/api/authors/${author.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('author');
      expect(res.body.data.author.firstName).toBe(updateData.firstName);
    });
  });

  describe('DELETE /api/authors/:id (Admin only)', () => {
    let author;

    beforeEach(async () => {
      author = await Author.create({
        firstName: 'Өшірілетін',
        lastName: 'Автор',
        nationality: 'Қазақстан'
      });
    });

    it('should delete author', async () => {
      const res = await request(app)
        .delete(`/api/authors/${author.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify deletion
      const checkRes = await request(app)
        .get(`/api/authors/${author.id}`)
        .expect(404);

      expect(checkRes.body.success).toBe(false);
    });
  });
});
