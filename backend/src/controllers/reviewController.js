const { Op } = require('sequelize');
const { Review, Book, User } = require('../models');
const logger = require('../utils/logger');

// Получить все отзывы на книгу со статистикой
exports.getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Получить все отзывы
    const { count, rows } = await Review.findAndCountAll({
      where: { bookId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    // Подсчитать статистику рейтингов
    const allReviews = await Review.findAll({
      where: { bookId },
      attributes: ['rating']
    });

    const ratingStats = {
      average: 0,
      total: allReviews.length,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    if (allReviews.length > 0) {
      const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
      ratingStats.average = (sum / allReviews.length).toFixed(1);
      
      allReviews.forEach(r => {
        ratingStats.distribution[r.rating]++;
      });
    }

    res.json({
      success: true,
      data: {
        reviews: rows,
        ratingStats,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Создать отзыв
exports.createReview = async (req, res, next) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user.id;

    // Проверить существование книги
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Кітап табылмады'
      });
    }

    // Проверить не оставлял ли уже отзыв
    const existing = await Review.findOne({
      where: { userId, bookId }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Сіз бұл кітапқа баға қойғансыз'
      });
    }

    const review = await Review.create({
      userId,
      bookId,
      rating,
      comment
    });

    const createdReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    logger.info(`Review created: Book ${bookId} by User ${userId}, rating: ${rating}`);

    res.status(201).json({
      success: true,
      message: 'Пікір сәтті қосылды',
      data: { review: createdReview }
    });
  } catch (error) {
    next(error);
  }
};

// Обновить свой отзыв
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Пікір табылмады'
      });
    }

    // Только автор или админ может редактировать
    if (review.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Рұқсат жоқ'
      });
    }

    await review.update({
      rating: rating || review.rating,
      comment: comment !== undefined ? comment : review.comment
    });

    logger.info(`Review updated: ID ${id}`);

    res.json({
      success: true,
      message: 'Пікір жаңартылды',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// Удалить отзыв
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Пікір табылмады'
      });
    }

    // Только автор или админ может удалить
    if (review.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Рұқсат жоқ'
      });
    }

    await review.destroy();

    logger.info(`Review deleted: ID ${id}`);

    res.json({
      success: true,
      message: 'Пікір жойылды'
    });
  } catch (error) {
    next(error);
  }
};

// Получить мои отзывы
exports.getMyReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Review.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'coverImage']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        reviews: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
