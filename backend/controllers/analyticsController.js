const Analytics = require('../models/analytics');
const Test = require('../models/test');
const Question = require('../models/question');

/**
 * @desc    Get user analytics
 * @route   GET /api/analytics
 * @access  Private
 */
const getUserAnalytics = async (req, res) => {
  try {
    const { page = 1, limit = 20, testId } = req.query;

    // Build query
    const query = { user: req.user.id };
    if (testId) query.test = testId;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get analytics
    const analytics = await Analytics.find(query)
      .populate('test', 'title category difficulty totalMarks')
      .populate('user', 'name email')
      .select('-__v')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Analytics.countDocuments(query);

    // Calculate overall statistics
    const stats = await Analytics.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePercentage: { $avg: '$percentage' },
          totalCorrect: { $sum: '$correct' },
          totalWrong: { $sum: '$wrong' },
          totalAttempted: { $sum: '$attempted' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: analytics.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      statistics: stats[0] || {
        totalTests: 0,
        averageScore: 0,
        averagePercentage: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalAttempted: 0
      },
      analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Submit test and store analytics
 * @route   POST /api/analytics
 * @access  Private
 */
const submitTest = async (req, res) => {
  try {
    const {
      testId,
      answers,
      timeTaken
    } = req.body;

    // Validate required fields
    if (!testId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide test ID and answers array'
      });
    }

    // Get test with questions
    const test = await Test.findById(testId).populate('questions');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Calculate results
    let correct = 0;
    let wrong = 0;
    let attempted = 0;
    const processedAnswers = [];

    // Process each answer
    for (const answer of answers) {
      const question = test.questions.find(q => q._id.toString() === answer.questionId);
      
      if (!question) continue;

      attempted++;
      const isCorrect = question.answer === answer.selectedAnswer;
      
      if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }

      processedAnswers.push({
        question: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeTaken: answer.timeTaken || 0
      });
    }

    const unattempted = test.questions.length - attempted;
    
    // Calculate score (assuming each question is worth equal marks)
    const marksPerQuestion = test.totalMarks / test.questions.length;
    const score = correct * marksPerQuestion;
    const percentage = (score / test.totalMarks) * 100;

    // Create analytics record
    const analytics = await Analytics.create({
      user: req.user.id,
      test: testId,
      score: Math.round(score * 100) / 100,
      correct,
      wrong,
      attempted,
      unattempted,
      timeTaken,
      percentage: Math.round(percentage * 100) / 100,
      answers: processedAnswers
    });

    // Populate the analytics
    await analytics.populate('test', 'title category difficulty totalMarks');
    await analytics.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      analytics
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting test',
      error: error.message
    });
  }
};

/**
 * @desc    Get analytics by ID
 * @route   GET /api/analytics/:id
 * @access  Private
 */
const getAnalyticsById = async (req, res) => {
  try {
    const analytics = await Analytics.findById(req.params.id)
      .populate('test', 'title category difficulty totalMarks')
      .populate('user', 'name email')
      .populate('answers.question')
      .select('-__v');

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found'
      });
    }

    // Check if user owns this analytics
    if (analytics.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this analytics'
      });
    }

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Get analytics by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Get analytics statistics by category
 * @route   GET /api/analytics/stats/category
 * @access  Private
 */
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Analytics.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $lookup: {
          from: 'tests',
          localField: 'test',
          foreignField: '_id',
          as: 'testInfo'
        }
      },
      {
        $unwind: '$testInfo'
      },
      {
        $group: {
          _id: '$testInfo.category',
          totalTests: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePercentage: { $avg: '$percentage' },
          totalCorrect: { $sum: '$correct' },
          totalWrong: { $sum: '$wrong' }
        }
      },
      {
        $sort: { totalTests: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get performance trends over time
 * @route   GET /api/analytics/stats/trends
 * @access  Private
 */
const getPerformanceTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await Analytics.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          testsAttempted: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePercentage: { $avg: '$percentage' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Get performance trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching performance trends',
      error: error.message
    });
  }
};

module.exports = {
  getUserAnalytics,
  submitTest,
  getAnalyticsById,
  getCategoryStats,
  getPerformanceTrends
};