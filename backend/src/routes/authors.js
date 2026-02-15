const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authorController');

const router = express.Router();

// Validation rules
const createAuthorValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('nationality').optional().trim()
];

const updateAuthorValidation = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('nationality').optional().trim()
];

// Routes
router.get('/', getAllAuthors); // Public
router.get('/:id', getAuthorById); // Public
router.post('/', authenticate, authorize('admin'), createAuthorValidation, createAuthor); // Admin only
router.put('/:id', authenticate, authorize('admin'), updateAuthorValidation, updateAuthor); // Admin only
router.delete('/:id', authenticate, authorize('admin'), deleteAuthor); // Admin only

module.exports = router;
