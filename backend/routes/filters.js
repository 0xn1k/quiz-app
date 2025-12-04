const express = require('express');
const router = express.Router();
const {
  getFilters,
  getCategories,
  getYears,
  getTags,
  getStatistics
} = require('../controllers/filterController');

// All filter routes are public
router.get('/', getFilters);
router.get('/categories', getCategories);
router.get('/years', getYears);
router.get('/tags', getTags);
router.get('/stats', getStatistics);

module.exports = router;