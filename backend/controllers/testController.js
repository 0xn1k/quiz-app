const Test = require('../models/test');
const Question = require('../models/question');

/**
 * @desc    Get all tests
 * @route   GET /api/tests
 * @access  Public/Private
 */
const getTests = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      isPublic,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';

    // If user is authenticated, show their private tests too
    if (req.user && isPublic !== 'true') {
      query.$or = [
        { isPublic: true },
        { createdBy: req.user.id }
      ];
    } else if (!req.user) {
      query.isPublic = true;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tests = await Test.find(query)
      .populate('createdBy', 'name email')
      .select('-__v')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Test.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      tests
    });
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests',
      error: error.message
    });
  }
};

/**
 * @desc    Get single test by ID
 * @route   GET /api/tests/:id
 * @access  Public/Private
 */
const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('questions')
      .select('-__v');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if test is private and user is not the creator
    if (!test.isPublic && (!req.user || test.createdBy._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This test is private.'
      });
    }

    res.status(200).json({
      success: true,
      test
    });
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test',
      error: error.message
    });
  }
};

/**
 * @desc    Create custom test
 * @route   POST /api/tests
 * @access  Private
 */
const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      isPublic,
      duration,
      totalMarks,
      category,
      difficulty
    } = req.body;

    // Validate required fields
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and at least one question'
      });
    }

    // Verify all questions exist
    const questionDocs = await Question.find({ _id: { $in: questions } });

    if (questionDocs.length !== questions.length) {
      return res.status(400).json({
        success: false,
        message: 'Some questions do not exist'
      });
    }

    // Create test
    const test = await Test.create({
      title,
      description,
      questions,
      createdBy: req.user.id,
      isPublic: isPublic || false,
      duration,
      totalMarks,
      category,
      difficulty
    });

    // Populate the test
    await test.populate('questions');
    await test.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      test
    });
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test',
      error: error.message
    });
  }
};

/**
 * @desc    Update test
 * @route   PUT /api/tests/:id
 * @access  Private
 */
const updateTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if user is the creator
    if (test.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this test'
      });
    }

    // If updating questions, verify they exist
    if (req.body.questions) {
      const questionDocs = await Question.find({ _id: { $in: req.body.questions } });
      if (questionDocs.length !== req.body.questions.length) {
        return res.status(400).json({
          success: false,
          message: 'Some questions do not exist'
        });
      }
    }

    // Update test
    const updatedTest = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('questions')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      test: updatedTest
    });
  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating test',
      error: error.message
    });
  }
};

/**
 * @desc    Delete test
 * @route   DELETE /api/tests/:id
 * @access  Private
 */
const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Check if user is the creator
    if (test.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this test'
      });
    }

    await test.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting test',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's tests
 * @route   GET /api/tests/my-tests
 * @access  Private
 */
const getMyTests = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tests = await Test.find({ createdBy: req.user.id })
      .populate('questions', 'question category difficulty')
      .select('-__v')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Test.countDocuments({ createdBy: req.user.id });

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      tests
    });
  } catch (error) {
    console.error('Get my tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your tests',
      error: error.message
    });
  }
};

module.exports = {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getMyTests
};