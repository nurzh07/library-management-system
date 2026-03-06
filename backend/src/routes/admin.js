const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getStats } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', getStats);

module.exports = router;
