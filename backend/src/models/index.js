const { sequelize } = require('../config/database');
const User = require('./User');
const Book = require('./Book');
const Author = require('./Author');
const Category = require('./Category');
const Borrowing = require('./Borrowing');

// Define associations
// Book - Author (Many-to-Many)
Book.belongsToMany(Author, {
  through: 'BookAuthors',
  foreignKey: 'bookId',
  otherKey: 'authorId',
  as: 'authors'
});

Author.belongsToMany(Book, {
  through: 'BookAuthors',
  foreignKey: 'authorId',
  otherKey: 'bookId',
  as: 'books'
});

// Book - Category (Many-to-One)
Book.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Category.hasMany(Book, {
  foreignKey: 'categoryId',
  as: 'books'
});

// Book - Borrowing (One-to-Many)
Book.hasMany(Borrowing, {
  foreignKey: 'bookId',
  as: 'borrowings'
});

Borrowing.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

// User - Borrowing (One-to-Many)
User.hasMany(Borrowing, {
  foreignKey: 'userId',
  as: 'borrowings'
});

Borrowing.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Book,
  Author,
  Category,
  Borrowing
};
