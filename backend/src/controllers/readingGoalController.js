const { ReadingGoal, Borrowing } = require('../models');
const logger = require('../utils/logger');

// Get user's reading goal for current year
exports.getUserReadingGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentYear = new Date().getFullYear();

    let goal = await ReadingGoal.findOne({
      where: { userId, year: currentYear }
    });

    // Если цели нет, создаем дефолтную
    if (!goal) {
      goal = await ReadingGoal.create({
        userId,
        year: currentYear,
        targetBooks: 12,
        completedBooks: 0
      });
    }

    // Подсчитываем реально прочитанные книги за этот год
    const completedBorrowings = await Borrowing.count({
      where: {
        userId,
        status: 'returned',
        returnedAt: {
          [require('sequelize').Op.gte]: new Date(`${currentYear}-01-01`),
          [require('sequelize').Op.lte]: new Date(`${currentYear}-12-31`)
        }
      }
    });

    // Обновляем completedBooks
    goal.completedBooks = completedBorrowings;
    await goal.save();

    res.json({
      success: true,
      data: { goal }
    });
  } catch (error) {
    next(error);
  }
};

// Create or update reading goal
exports.setReadingGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { year, targetBooks } = req.body;
    const currentYear = new Date().getFullYear();

    const goal = await ReadingGoal.findOne({
      where: { userId, year: year || currentYear }
    });

    if (goal) {
      await goal.update({ targetBooks });
    } else {
      await ReadingGoal.create({
        userId,
        year: year || currentYear,
        targetBooks,
        completedBooks: 0
      });
    }

    res.json({
      success: true,
      message: 'Reading goal updated'
    });
  } catch (error) {
    next(error);
  }
};

// Get reading statistics
exports.getReadingStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentYear = new Date().getFullYear();

    // Книги за этот год
    const completedThisYear = await Borrowing.count({
      where: {
        userId,
        status: 'returned',
        returnedAt: {
          [require('sequelize').Op.gte]: new Date(`${currentYear}-01-01`),
          [require('sequelize').Op.lte]: new Date(`${currentYear}-12-31`)
        }
      }
    });

    // Всего книг
    const totalCompleted = await Borrowing.count({
      where: { userId, status: 'returned' }
    });

    // Текущие активные
    const currentBorrowings = await Borrowing.count({
      where: { userId, status: 'borrowed' }
    });

    // Просроченные
    const overdueBorrowings = await Borrowing.count({
      where: {
        userId,
        status: 'borrowed',
        dueDate: { [require('sequelize').Op.lt]: new Date() }
      }
    });

    // Страниц в среднем (если добавим pageCount в Borrowing)
    const avgPagesPerMonth = Math.round(completedThisYear / 12);

    res.json({
      success: true,
      data: {
        completedThisYear,
        totalCompleted,
        currentBorrowings,
        overdueBorrowings,
        avgPagesPerMonth,
        currentYear
      }
    });
  } catch (error) {
    next(error);
  }
};
