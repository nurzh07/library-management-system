const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { User, Borrowing } = require('../models');
const logger = require('../utils/logger');

// Get all users (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      where.role = role;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      success: true,
      data: {
        users: rows,
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

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Borrowing,
          as: 'borrowings',
          include: ['book']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Update user (Admin only or self)
exports.updateUser = async (req, res, next) => {
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
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    const { firstName, lastName, phone, role, isActive } = req.body;

    // Only admin can change role and isActive
    const updateData = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone
    };

    if (req.user.role === 'admin') {
      if (role !== undefined) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
    }

    await user.update(updateData);

    logger.info(`User updated: ${user.email} (ID: ${user.id})`);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.toPublicJSON() }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deletion
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.destroy();

    logger.info(`User deleted: ${user.email} (ID: ${user.id})`);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
