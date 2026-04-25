const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Public - просмотр категорий
router.get('/', getAllCategories);

// Protected - только админ может управлять
router.post('/',
  authenticate,
  authorize('admin'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  createCategory
);

router.put('/:id',
  authenticate,
  authorize('admin'),
  body('name').optional().trim().notEmpty(),
  updateCategory
);

router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
