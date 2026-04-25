const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const {
  getMyFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavorite
} = require('../controllers/favoriteController');

const router = express.Router();

// Все роуты требуют аутентификации
router.use(authenticate);

router.get('/', getMyFavorites);
router.post('/', body('bookId').isInt().withMessage('Book ID is required'), addToFavorites);
router.delete('/:bookId', removeFromFavorites);
router.get('/check/:bookId', checkFavorite);

module.exports = router;
