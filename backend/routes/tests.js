const express = require('express');
const router = express.Router();
const {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getMyTests
} = require('../controllers/testController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Public/Optional auth routes
router.get('/', optionalAuth, getTests);
router.get('/:id', optionalAuth, getTestById);

// Protected routes
router.post('/', protect, createTest);
router.put('/:id', protect, updateTest);
router.delete('/:id', protect, deleteTest);
router.get('/user/my-tests', protect, getMyTests);

module.exports = router;