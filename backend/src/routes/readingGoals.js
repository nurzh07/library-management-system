const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getUserReadingGoal,
  setReadingGoal,
  getReadingStats
} = require('../controllers/readingGoalController');

const router = express.Router();

// Get user's reading goal for current year
router.get('/goal', authenticate, getUserReadingGoal);

// Set or update reading goal
router.post('/goal', authenticate, setReadingGoal);

// Get reading statistics
router.get('/stats', authenticate, getReadingStats);

module.exports = router;
