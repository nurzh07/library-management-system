const { Favorite, Book, Author, Category } = require('../models');
const logger = require('../utils/logger');

// Получить избранное текущего пользователя
exports.getMyFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Favorite.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Book,
          as: 'book',
          include: [
            {
              model: Author,
              as: 'authors',
              attributes: ['id', 'firstName', 'lastName'],
              through: { attributes: [] }
            },
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        favorites: rows.map(f => f.book),
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

// Добавить книгу в избранное
exports.addToFavorites = async (req, res, next) => {
  try {
    const { bookId } = req.body;

    // Проверить существование книги
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Кітап табылмады'
      });
    }

    // Проверить не добавлена ли уже
    const existing = await Favorite.findOne({
      where: { userId: req.user.id, bookId }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Бұл кітап сіздің тізіміңізде бар'
      });
    }

    await Favorite.create({
      userId: req.user.id,
      bookId
    });

    logger.info(`Book ${bookId} added to favorites by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Кітап сүйіктілерге қосылды'
    });
  } catch (error) {
    next(error);
  }
};

// Удалить из избранного
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, bookId }
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Кітап сүйіктілер тізімінде табылмады'
      });
    }

    await favorite.destroy();

    logger.info(`Book ${bookId} removed from favorites by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Кітап сүйіктілерден жойылды'
    });
  } catch (error) {
    next(error);
  }
};

// Проверить находится ли книга в избранном
exports.checkFavorite = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId: req.user.id, bookId }
    });

    res.json({
      success: true,
      data: { isFavorite: !!favorite }
    });
  } catch (error) {
    next(error);
  }
};
