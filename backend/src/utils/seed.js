const { User, Book, Author, Category, Borrowing } = require('../models');
const logger = require('./logger');

const seedDatabase = async () => {
  try {
    // Create categories
    const category1 = await Category.create({
      name: 'Әдебиет',
      description: 'Әдеби шығармалар'
    });

    const category2 = await Category.create({
      name: 'Ғылым',
      description: 'Ғылыми әдебиеттер'
    });

    // Create authors
    const author1 = await Author.create({
      firstName: 'Абай',
      lastName: 'Құнанбаев',
      biography: 'Қазақтың ұлы ақыны',
      nationality: 'Қазақстан'
    });

    const author2 = await Author.create({
      firstName: 'Мұхтар',
      lastName: 'Әуезов',
      biography: 'Қазақтың ұлы жазушысы',
      nationality: 'Қазақстан'
    });

    // Create books
    const book1 = await Book.create({
      title: 'Абай жолы',
      isbn: '978-601-01-1234-5',
      description: 'Абай Құнанбаевтың өмірбаяны',
      publicationYear: 2020,
      publisher: 'Алматы кітап',
      totalCopies: 10,
      availableCopies: 8,
      categoryId: category1.id
    });

    const book2 = await Book.create({
      title: 'Абайдың қара сөздері',
      isbn: '978-601-01-1235-6',
      description: 'Абайдың философиялық шығармалары',
      publicationYear: 2021,
      publisher: 'Алматы кітап',
      totalCopies: 5,
      availableCopies: 5,
      categoryId: category1.id
    });

    // Associate books with authors
    await book1.setAuthors([author1.id]);
    await book2.setAuthors([author1.id]);

    // Create admin user
    const admin = await User.create({
      email: 'admin@lms.kz',
      password: 'admin123',
      firstName: 'Админ',
      lastName: 'Әкімші',
      role: 'admin'
    });

    // Create regular user
    const user = await User.create({
      email: 'user@lms.kz',
      password: 'user123',
      firstName: 'Оқырман',
      lastName: 'Пайдаланушы',
      phone: '+77001234567'
    });

    logger.info('Database seeded successfully');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;
