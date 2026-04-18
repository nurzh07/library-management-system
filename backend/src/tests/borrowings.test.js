const request = require('supertest');
const app = require('../app');
const { Book, User, Author, Category, Borrowing, sequelize } = require('../models');

// Test data
let authToken;
let regularUser;
let adminUser;
let testBook;
let testCategory;
let testAuthor;

describe('Borrowings API', () => {
  beforeAll(async () => {
    // Clean up
    await Borrowing.destroy({ where: {}, truncate: true, cascade: true });
    await Book.destroy({ where: {}, truncate: true, cascade: true });
    await Author.destroy({ where: {}, truncate: true, cascade: true });
    await Category.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: { email: ['user@test.com', 'admin@test.com'] }, truncate: false });
    
    // Create test category
    testCategory = await Category.create({
      name: 'Тест категория',
      description: 'Тест сипаттама'
    });
    
    // Create test author
    testAuthor = await Author.create({
      firstName: 'Тест',
      lastName: 'Автор',
      nationality: 'Қазақстан'
    });
    
    // Create test book
    testBook = await Book.create({
      title: 'Тест кітап',
      isbn: '978-1234567890',
      description: 'Тест сипаттама',
      publicationYear: 2024,
      publisher: 'Тест баспа',
      totalCopies: 5,
      availableCopies: 5,
      categoryId: testCategory.id
    });
    await testBook.addAuthor(testAuthor.id);
    
    // Create regular user
    regularUser = await User.create({
      email: 'user@test.com',
      password: 'user123',
      firstName: 'Қарапайым',
      lastName: 'Қолданушы',
      role: 'user'
    });
    
    // Create admin user
    adminUser = await User.create({
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Әкімші',
      lastName: 'Қолданушы',
      role: 'admin'
    });
  });

  beforeEach(async () => {
    // Clean borrowings before each test
    await Borrowing.destroy({ where: {}, truncate: true, cascade: true });
    
    // Reset book availability
    await Book.update(
      { availableCopies: 5 },
      { where: { id: testBook.id } }
    );
    
    // Login as regular user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@test.com',
        password: 'user123'
      });
    
    authToken = loginRes.body.data.token;
  });

  describe('GET /api/borrowings', () => {
    beforeEach(async () => {
      // Create some borrowings
      await Borrowing.create({
        bookId: testBook.id,
        userId: regularUser.id,
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'active'
      });
      
      // Update available copies
      await Book.update(
        { availableCopies: 4 },
        { where: { id: testBook.id } }
      );
    });

    it('should return user borrowings when authenticated', async () => {
      const res = await request(app)
        .get('/api/borrowings?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('borrowings');
      expect(Array.isArray(res.body.data.borrowings)).toBe(true);
    });

    it('should not return borrowings without authentication', async () => {
      const res = await request(app)
        .get('/api/borrowings?page=1&limit=10')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/borrowings', () => {
    it('should create borrowing with valid data', async () => {
      const res = await request(app)
        .post('/api/borrowings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bookId: testBook.id,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('status', 'active');
    });

    it('should not create borrowing for unavailable book', async () => {
      // Make book unavailable
      await Book.update(
        { availableCopies: 0 },
        { where: { id: testBook.id } }
      );

      const res = await request(app)
        .post('/api/borrowings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bookId: testBook.id
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should not create borrowing without authentication', async () => {
      const res = await request(app)
        .post('/api/borrowings')
        .send({
          bookId: testBook.id
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/borrowings/:id/return', () => {
    let borrowing;

    beforeEach(async () => {
      borrowing = await Borrowing.create({
        bookId: testBook.id,
        userId: regularUser.id,
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'active'
      });
      
      await Book.update(
        { availableCopies: 4 },
        { where: { id: testBook.id } }
      );
    });

    it('should return book successfully', async () => {
      const res = await request(app)
        .post(`/api/borrowings/${borrowing.id}/return`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status', 'returned');
      expect(res.body.data).toHaveProperty('returnDate');
    });

    it('should not return already returned book', async () => {
      // First return
      await request(app)
        .post(`/api/borrowings/${borrowing.id}/return`)
        .set('Authorization', `Bearer ${authToken}`);

      // Second return attempt
      const res = await request(app)
        .post(`/api/borrowings/${borrowing.id}/return`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/borrowings/:id', () => {
    let borrowing;

    beforeEach(async () => {
      borrowing = await Borrowing.create({
        bookId: testBook.id,
        userId: regularUser.id,
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'active'
      });
    });

    it('should return borrowing details', async () => {
      const res = await request(app)
        .get(`/api/borrowings/${borrowing.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', borrowing.id);
      expect(res.body.data).toHaveProperty('Book');
    });
  });
});
