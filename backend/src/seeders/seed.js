const { User, Book, Author, Category, Borrowing } = require('../models');

const seedDatabase = async () => {
  try {
    // Create categories
    const fiction = await Category.create({
      name: 'Беллетристика',
      description: 'Көркем әдебиет'
    });

    const science = await Category.create({
      name: 'Ғылым',
      description: 'Ғылыми әдебиет'
    });

    // Create authors
    const author1 = await Author.create({
      firstName: 'Абай',
      lastName: 'Құнанбаев',
      biography: 'Қазақ ақыны',
      nationality: 'Қазақстан'
    });

    const author2 = await Author.create({
      firstName: 'Мұхтар',
      lastName: 'Әуезов',
      biography: 'Қазақ жазушысы',
      nationality: 'Қазақстан'
    });

    // Create books
    const book1 = await Book.create({
      title: 'Қара сөздер',
      isbn: '978-601-01-1234-5',
      description: 'Абайдың философиялық шығармасы',
      publicationYear: 1890,
      publisher: 'Алматы',
      totalCopies: 10,
      availableCopies: 10,
      categoryId: fiction.id
    });

    const book2 = await Book.create({
      title: 'Абай жолы',
      isbn: '978-601-01-1235-6',
      description: 'Мұхтар Әуезовтың романы',
      publicationYear: 1942,
      publisher: 'Алматы',
      totalCopies: 5,
      availableCopies: 5,
      categoryId: fiction.id
    });

    // Associate books with authors
    await book1.setAuthors([author1.id]);
    await book2.setAuthors([author2.id]);

    // Create admin user
    await User.create({
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
      lastName: 'Пайдаланушы'
    });

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@lms.kz / admin123');
    console.log('User credentials: user@lms.kz / user123');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run seeder if called directly
if (require.main === module) {
  require('../config/database').sequelize.sync({ force: true })
    .then(() => seedDatabase())
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
