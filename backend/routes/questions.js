const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getPYQs,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getDailyQuestions
} = require('../controllers/questionController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getQuestions);
router.get('/pyqs', getPYQs);
router.get('/daily', getDailyQuestions);
router.get('/:id', getQuestionById);

// Protected routes (Admin only - you may want to add admin middleware)
router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;