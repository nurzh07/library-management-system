const { Category, Book } = require('../models');
const logger = require('../utils/logger');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
      include: [{
        model: Book,
        as: 'books',
        attributes: ['id'],
        required: false
      }]
    });
    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Check if name already exists
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({ name, description });
    logger.info(`Category created: ${name}`);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check name uniqueness if changed
    if (name && name !== category.name) {
      const existing = await Category.findOne({ where: { name } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    await category.update({ name: name || category.name, description });
    logger.info(`Category updated: ${category.name} (ID: ${id})`);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [{
        model: Book,
        as: 'books',
        attributes: ['id']
      }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has books
    if (category.books && category.books.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with books. Move books to another category first.'
      });
    }

    await category.destroy();
    logger.info(`Category deleted: ID ${id}`);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
