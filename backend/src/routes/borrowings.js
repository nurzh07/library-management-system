const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllBorrowings,
  getBorrowingById,
  createBorrowing,
  returnBook,
  renewBorrowing
} = require('../controllers/borrowingController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const createBorrowingValidation = [
  body('bookId').isInt().withMessage('Book ID is required'),
  body('userId').optional().isInt(),
  body('dueDate').optional().isISO8601().toDate()
];

// Routes
router.get('/', getAllBorrowings);
router.get('/:id', getBorrowingById);
router.post('/', createBorrowingValidation, createBorrowing);
router.post('/:id/return', returnBook); // Return a book
router.post('/:id/renew', renewBorrowing); // Renew borrowing

module.exports = router;
