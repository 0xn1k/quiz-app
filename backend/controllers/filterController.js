const Question = require('../models/question');
const Test = require('../models/test');

/**
 * @desc    Get all available filters (categories, difficulties, years, tags)
 * @route   GET /api/filters
 * @access  Public
 */
const getFilters = async (req, res) => {
  try {
    // Get unique categories
    const categories = await Question.distinct('category');

    // Get unique difficulties
    const difficulties = ['easy', 'medium', 'hard'];

    // Get unique years for PYQs
    const years = await Question.distinct('year', { isPYQ: true });

    // Get unique tags
    const tags = await Question.distinct('tags');

    // Get question counts by category
    const categoryStats = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          pyqCount: {
            $sum: { $cond: ['$isPYQ', 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get question counts by difficulty
    const difficultyStats = await Question.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      filters: {
        categories: categories.sort(),
        difficulties,
        years: years.sort((a, b) => b - a), // Sort years in descending order
        tags: tags.sort()
      },
      statistics: {
        byCategory: categoryStats,
        byDifficulty: difficultyStats,
        totalQuestions: await Question.countDocuments(),
        totalPYQs: await Question.countDocuments({ isPYQ: true }),
        totalTests: await Test.countDocuments({ isPublic: true })
      }
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filters',
      error: error.message
    });
  }
};

/**
 * @desc    Get categories with details
 * @route   GET /api/filters/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          totalQuestions: { $sum: 1 },
          pyqCount: {
            $sum: { $cond: ['$isPYQ', 1, 0] }
          },
          easyCount: {
            $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] }
          },
          mediumCount: {
            $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] }
          },
          hardCount: {
            $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalQuestions: 1,
          pyqCount: 1,
          difficultyBreakdown: {
            easy: '$easyCount',
            medium: '$mediumCount',
            hard: '$hardCount'
          }
        }
      },
      {
        $sort: { totalQuestions: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

/**
 * @desc    Get years with PYQ counts
 * @route   GET /api/filters/years
 * @access  Public
 */
const getYears = async (req, res) => {
  try {
    const years = await Question.aggregate([
      {
        $match: { isPYQ: true, year: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
          count: 1
        }
      },
      {
        $sort: { year: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: years.length,
      years
    });
  } catch (error) {
    console.error('Get years error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching years',
      error: error.message
    });
  }
};

/**
 * @desc    Get tags with question counts
 * @route   GET /api/filters/tags
 * @access  Public
 */
const getTags = async (req, res) => {
  try {
    const tags = await Question.aggregate([
      {
        $unwind: '$tags'
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          tag: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: tags.length,
      tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tags',
      error: error.message
    });
  }
};

/**
 * @desc    Get statistics overview
 * @route   GET /api/filters/stats
 * @access  Public
 */
const getStatistics = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const totalPYQs = await Question.countDocuments({ isPYQ: true });
    const totalTests = await Test.countDocuments({ isPublic: true });
    const totalCategories = (await Question.distinct('category')).length;

    // Get latest questions
    const latestQuestions = await Question.find()
      .select('question category difficulty isPYQ createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get latest tests
    const latestTests = await Test.find({ isPublic: true })
      .select('title category difficulty createdAt')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      statistics: {
        totalQuestions,
        totalPYQs,
        totalTests,
        totalCategories,
        latestQuestions,
        latestTests
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getFilters,
  getCategories,
  getYears,
  getTags,
  getStatistics
};