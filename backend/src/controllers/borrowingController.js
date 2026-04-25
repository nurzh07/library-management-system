const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { Borrowing, Book, User } = require('../models');
const logger = require('../utils/logger');

// Calculate due date (default 14 days from borrow date)
const calculateDueDate = (borrowDate) => {
  const dueDate = new Date(borrowDate);
  dueDate.setDate(dueDate.getDate() + 14); // 14 days
  return dueDate;
};

// Calculate fine (if overdue)
const calculateFine = (dueDate, returnDate) => {
  if (!returnDate) return 0;
  const daysOverdue = Math.max(0, Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24)));
  return daysOverdue * 10; // 10 units per day
};

// Get all borrowings
exports.getAllBorrowings = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      userId,
      bookId,
      sortBy = 'borrowDate',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by user
    if (userId) {
      where.userId = userId;
    }

    // Filter by book
    if (bookId) {
      where.bookId = bookId;
    }

    // Users can only see their own borrowings unless admin
    if (req.user.role !== 'admin' && !userId) {
      where.userId = req.user.id;
    }

    const { count, rows } = await Borrowing.findAndCountAll({
      where,
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['id', 'title', 'isbn']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      success: true,
      data: {
        borrowings: rows,
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

// Get single borrowing by ID
exports.getBorrowingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const borrowing = await Borrowing.findByPk(id, {
      include: [
        {
          model: Book,
          as: 'book'
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && borrowing.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    res.json({
      success: true,
      data: { borrowing }
    });
  } catch (error) {
    next(error);
  }
};

// Create new borrowing (borrow a book)
exports.createBorrowing = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { bookId, userId, dueDate } = req.body;

    // Determine user ID (admin can borrow for others)
    const targetUserId = req.user.role === 'admin' && userId ? userId : req.user.id;

    // Check if book exists and is available
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available'
      });
    }

    // Check if user already has this book borrowed
    const existingBorrowing = await Borrowing.findOne({
      where: {
        userId: targetUserId,
        bookId,
        status: 'borrowed'
      }
    });

    if (existingBorrowing) {
      return res.status(400).json({
        success: false,
        message: 'User already has this book borrowed'
      });
    }

    const borrowDate = new Date();
    const calculatedDueDate = dueDate ? new Date(dueDate) : calculateDueDate(borrowDate);

    const borrowing = await Borrowing.create({
      userId: targetUserId,
      bookId,
      borrowDate,
      dueDate: calculatedDueDate,
      status: 'borrowed'
    });

    // Decrease available copies
    await book.decrement('availableCopies');

    const createdBorrowing = await Borrowing.findByPk(borrowing.id, {
      include: [
        {
          model: Book,
          as: 'book'
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    logger.info(`Book borrowed: Book ID ${bookId} by User ID ${targetUserId}`);

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: { borrowing: createdBorrowing }
    });
  } catch (error) {
    next(error);
  }
};

// Продлить срок аренды книги
exports.renewBorrowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { days = 7 } = req.body; // по умолчанию +7 дней

    const borrowing = await Borrowing.findByPk(id, {
      include: [
        {
          model: Book,
          as: 'book'
        }
      ]
    });

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Кітап табылмады'
      });
    }

    if (borrowing.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Кітап қойылған'
      });
    }

    // Проверить права
    if (req.user.role !== 'admin' && borrowing.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Рұқсат жоқ'
      });
    }

    // Нельзя продлить если уже просрочено
    const now = new Date();
    if (borrowing.dueDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Мерзімі өткен кітапты ұзарту мүмкін емес. Кітапханаға қайтарыңыз.'
      });
    }

    // Максимум 2 продления
    const renewalCount = borrowing.renewalCount || 0;
    if (renewalCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Кітапты 2 реттен көп ұзартуға болмайды'
      });
    }

    // Увеличить срок
    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + parseInt(days));

    await borrowing.update({
      dueDate: newDueDate,
      renewalCount: renewalCount + 1
    });

    logger.info(`Borrowing renewed: ID ${id}, new due date: ${newDueDate}`);

    res.json({
      success: true,
      message: `Кітап мерзімі ${days} күнге ұзартылды`,
      data: { borrowing }
    });
  } catch (error) {
    next(error);
  }
};

// Return a book
exports.returnBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const borrowing = await Borrowing.findByPk(id, {
      include: [
        {
          model: Book,
          as: 'book'
        }
      ]
    });

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing not found'
      });
    }

    if (borrowing.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book already returned'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && borrowing.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const returnDate = new Date();
    const fineAmount = calculateFine(borrowing.dueDate, returnDate);
    const status = returnDate > borrowing.dueDate ? 'overdue' : 'returned';

    await borrowing.update({
      returnDate,
      status: 'returned',
      fineAmount
    });

    // Increase available copies
    await borrowing.book.increment('availableCopies');

    logger.info(`Book returned: Borrowing ID ${id}`);

    res.json({
      success: true,
      message: 'Book returned successfully',
      data: { borrowing }
    });
  } catch (error) {
    next(error);
  }
};
