const express = require('express');
const router = express.Router();
const {
  getUserAnalytics,
  submitTest,
  getAnalyticsById,
  getCategoryStats,
  getPerformanceTrends
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All analytics routes are protected
router.get('/', protect, getUserAnalytics);
router.post('/', protect, submitTest);
router.get('/stats/category', protect, getCategoryStats);
router.get('/stats/trends', protect, getPerformanceTrends);
router.get('/:id', protect, getAnalyticsById);

module.exports = router;