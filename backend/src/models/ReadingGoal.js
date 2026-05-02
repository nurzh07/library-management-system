const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ReadingGoal = sequelize.define('ReadingGoal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  targetBooks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 12,
    field: 'targetbooks'
  },
  completedBooks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'completedbooks'
  }
}, {
  tableName: 'reading_goals',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'year']
    }
  ]
});

module.exports = ReadingGoal;
