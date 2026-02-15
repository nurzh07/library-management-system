const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const router = express.Router();

// Validation rules
const createBookValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('isbn').trim().notEmpty().withMessage('ISBN is required'),
  body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('totalCopies').optional().isInt({ min: 1 }),
  body('authorIds').optional().isArray()
];

const updateBookValidation = [
  body('title').optional().trim().notEmpty(),
  body('isbn').optional().trim().notEmpty(),
  body('publicationYear').optional().isInt({ min: 1000, max: new Date().getFullYear() }),
  body('totalCopies').optional().isInt({ min: 1 }),
  body('authorIds').optional().isArray()
];

// Routes
router.get('/', getAllBooks); // Public - anyone can view books
router.get('/:id', getBookById); // Public
router.post('/', authenticate, authorize('admin'), createBookValidation, createBook); // Admin only
router.put('/:id', authenticate, authorize('admin'), updateBookValidation, updateBook); // Admin only
router.delete('/:id', authenticate, authorize('admin'), deleteBook); // Admin only

module.exports = router;
