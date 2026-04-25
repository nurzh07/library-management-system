const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getBookReviews,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews
} = require('../controllers/reviewController');

const router = express.Router();

// Public - просмотр отзывов книги
router.get('/book/:bookId', getBookReviews);

// Protected - требуется авторизация
router.use(authenticate);

router.get('/my', getMyReviews);

router.post('/',
  body('bookId').isInt().withMessage('Book ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().trim(),
  createReview
);

router.put('/:id',
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim(),
  updateReview
);

router.delete('/:id', deleteReview);

module.exports = router;
