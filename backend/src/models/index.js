const { sequelize } = require('../config/database');
const User = require('./User');
const Book = require('./Book');
const Author = require('./Author');
const Category = require('./Category');
const Borrowing = require('./Borrowing');
const Favorite = require('./Favorite');
const Review = require('./Review');

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

// User - Favorite - Book (Many-to-Many через Favorite)
User.belongsToMany(Book, {
  through: Favorite,
  foreignKey: 'userId',
  otherKey: 'bookId',
  as: 'favorites'
});

Book.belongsToMany(User, {
  through: Favorite,
  foreignKey: 'bookId',
  otherKey: 'userId',
  as: 'favoritedBy'
});

// Прямые ассоциации для Favorite
Favorite.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Favorite.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

// User - Review - Book (One-to-Many через Review)
User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Book.hasMany(Review, {
  foreignKey: 'bookId',
  as: 'reviews'
});

Review.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

module.exports = {
  sequelize,
  User,
  Book,
  Author,
  Category,
  Borrowing,
  Favorite,
  Review
};
