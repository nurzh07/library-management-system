const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { Book, Author, Category } = require('../models');
const logger = require('../utils/logger');

// Get all books with pagination, search, and filtering
exports.getAllBooks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      categoryId,
      authorId,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Search by title or ISBN
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { isbn: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by author (through association)
    const include = [
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
    ];

    if (authorId) {
      include[0].where = { id: authorId };
    }

    const { count, rows } = await Book.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    res.json({
      success: true,
      data: {
        books: rows,
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

// Get single book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: 'authors',
          attributes: ['id', 'firstName', 'lastName', 'biography'],
          through: { attributes: [] }
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

// Create new book
exports.createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      title,
      isbn,
      description,
      publicationYear,
      publisher,
      totalCopies,
      categoryId,
      authorIds,
      coverImage
    } = req.body;

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }

    const book = await Book.create({
      title,
      isbn,
      description,
      publicationYear,
      publisher,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
      categoryId,
      coverImage
    });

    // Associate authors if provided
    if (authorIds && authorIds.length > 0) {
      await book.setAuthors(authorIds);
    }

    const createdBook = await Book.findByPk(book.id, {
      include: [
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] }
        },
        {
          model: Category,
          as: 'category'
        }
      ]
    });

    logger.info(`Book created: ${book.title} (ID: ${book.id})`);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book: createdBook }
    });
  } catch (error) {
    next(error);
  }
};

// Update book
exports.updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const {
      title,
      isbn,
      description,
      publicationYear,
      publisher,
      totalCopies,
      categoryId,
      authorIds,
      coverImage
    } = req.body;

    // Check ISBN uniqueness if changed
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ where: { isbn } });
      if (existingBook) {
        return res.status(409).json({
          success: false,
          message: 'Book with this ISBN already exists'
        });
      }
    }

    // Calculate available copies if totalCopies changed
    const copiesDiff = totalCopies ? totalCopies - book.totalCopies : 0;
    const newAvailableCopies = Math.max(0, book.availableCopies + copiesDiff);

    await book.update({
      title: title || book.title,
      isbn: isbn || book.isbn,
      description: description !== undefined ? description : book.description,
      publicationYear: publicationYear || book.publicationYear,
      publisher: publisher || book.publisher,
      totalCopies: totalCopies || book.totalCopies,
      availableCopies: newAvailableCopies,
      categoryId: categoryId !== undefined ? categoryId : book.categoryId,
      coverImage: coverImage || book.coverImage
    });

    // Update authors if provided
    if (authorIds) {
      await book.setAuthors(authorIds);
    }

    const updatedBook = await Book.findByPk(id, {
      include: [
        {
          model: Author,
          as: 'authors',
          through: { attributes: [] }
        },
        {
          model: Category,
          as: 'category'
        }
      ]
    });

    logger.info(`Book updated: ${book.title} (ID: ${book.id})`);

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: { book: updatedBook }
    });
  } catch (error) {
    next(error);
  }
};

// Delete book
exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await book.destroy();

    logger.info(`Book deleted: ${book.title} (ID: ${book.id})`);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
