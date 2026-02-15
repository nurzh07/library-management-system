const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'authors',
  timestamps: true
});

module.exports = Author;
