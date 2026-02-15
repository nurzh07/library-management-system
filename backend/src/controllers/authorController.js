const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { Author, Book } = require('../models');
const logger = require('../utils/logger');

// Get all authors with pagination and search
exports.getAllAuthors = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'lastName',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Author.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: Book,
          as: 'books',
          attributes: ['id', 'title'],
          through: { attributes: [] }
        }
      ]
    });

    res.json({
      success: true,
      data: {
        authors: rows,
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

// Get single author by ID
exports.getAuthorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const author = await Author.findByPk(id, {
      include: [
        {
          model: Book,
          as: 'books',
          attributes: ['id', 'title', 'isbn', 'publicationYear'],
          through: { attributes: [] }
        }
      ]
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.json({
      success: true,
      data: { author }
    });
  } catch (error) {
    next(error);
  }
};

// Create new author
exports.createAuthor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { firstName, lastName, biography, dateOfBirth, nationality } = req.body;

    const author = await Author.create({
      firstName,
      lastName,
      biography,
      dateOfBirth,
      nationality
    });

    logger.info(`Author created: ${author.firstName} ${author.lastName} (ID: ${author.id})`);

    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: { author }
    });
  } catch (error) {
    next(error);
  }
};

// Update author
exports.updateAuthor = async (req, res, next) => {
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
    const author = await Author.findByPk(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    const { firstName, lastName, biography, dateOfBirth, nationality } = req.body;

    await author.update({
      firstName: firstName || author.firstName,
      lastName: lastName || author.lastName,
      biography: biography !== undefined ? biography : author.biography,
      dateOfBirth: dateOfBirth || author.dateOfBirth,
      nationality: nationality || author.nationality
    });

    logger.info(`Author updated: ${author.firstName} ${author.lastName} (ID: ${author.id})`);

    res.json({
      success: true,
      message: 'Author updated successfully',
      data: { author }
    });
  } catch (error) {
    next(error);
  }
};

// Delete author
exports.deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await Author.findByPk(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    await author.destroy();

    logger.info(`Author deleted: ${author.firstName} ${author.lastName} (ID: ${author.id})`);

    res.json({
      success: true,
      message: 'Author deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
