const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const updateUserValidation = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
  body('role').optional().isIn(['user', 'admin']),
  body('isActive').optional().isBoolean()
];

// Routes
router.get('/', authorize('admin'), getAllUsers); // Admin only
router.get('/:id', getUserById); // Self or Admin
router.put('/:id', updateUserValidation, updateUser); // Self or Admin
router.delete('/:id', authorize('admin'), deleteUser); // Admin only

module.exports = router;
