const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1000,
      max: new Date().getFullYear()
    }
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: true
  },
  totalCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  availableCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'books',
  timestamps: true
});

module.exports = Book;
