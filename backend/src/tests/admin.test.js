const request = require('supertest');
const app = require('../app');
const { User, Book, Author, Category, Borrowing } = require('../models');

// Test data
let adminToken;
let userToken;
let adminUser;
let regularUser;

describe('Admin API', () => {
  beforeAll(async () => {
    // Clean up
    await Borrowing.destroy({ where: {}, truncate: true, cascade: true });
    await Book.destroy({ where: {}, truncate: true, cascade: true });
    await Author.destroy({ where: {}, truncate: true, cascade: true });
    await Category.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: { email: ['admin@test.com', 'user@test.com'] }, truncate: false });
    
    // Create admin user
    adminUser = await User.create({
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Әкімші',
      lastName: 'Қолданушы',
      role: 'admin'
    });
    
    // Create regular user
    regularUser = await User.create({
      email: 'user@test.com',
      password: 'user123',
      firstName: 'Қарапайым',
      lastName: 'Қолданушы',
      role: 'user'
    });
    
    // Create test data
    const category = await Category.create({ name: 'Тест', description: 'Тест' });
    const author = await Author.create({ firstName: 'Тест', lastName: 'Автор', nationality: 'Қазақстан' });
    const book = await Book.create({
      title: 'Тест кітап',
      isbn: '1234567890',
      totalCopies: 5,
      availableCopies: 5,
      categoryId: category.id
    });
    await book.addAuthor(author.id);
  });

  beforeEach(async () => {
    // Login as admin
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    adminToken = adminLogin.body.data.token;
    
    // Login as regular user
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'user123' });
    userToken = userLogin.body.data.token;
  });

  describe('GET /api/admin/stats', () => {
    it('should return stats for admin user', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('books');
      expect(res.body.data).toHaveProperty('authors');
      expect(res.body.data).toHaveProperty('borrowings');
      expect(res.body.data).toHaveProperty('activeBorrowings');
      expect(typeof res.body.data.users).toBe('number');
    });

    it('should not return stats for non-admin user', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('should not return stats without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/users (Admin only)', () => {
    it('should return all users for admin', async () => {
      const res = await request(app)
        .get('/api/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(Array.isArray(res.body.data.users)).toBe(true);
    });

    it('should not return users for non-admin', async () => {
      const res = await request(app)
        .get('/api/users?page=1&limit=10')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id (Admin only)', () => {
    it('should allow admin to delete user', async () => {
      // Create a user to delete
      const userToDelete = await User.create({
        email: 'delete@test.com',
        password: 'delete123',
        firstName: 'Өшірілетін',
        lastName: 'Қолданушы'
      });

      const res = await request(app)
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should not allow regular user to delete other users', async () => {
      const res = await request(app)
        .delete(`/api/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });
});
