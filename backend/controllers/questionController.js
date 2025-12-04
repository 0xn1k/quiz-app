const Question = require('../models/question');

/**
 * @desc    Get all questions with filters
 * @route   GET /api/questions
 * @access  Public/Private (some questions may require subscription)
 */
const getQuestions = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      isPYQ,
      year,
      tags,
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isPYQ !== undefined) query.isPYQ = isPYQ === 'true';
    if (year) query.year = parseInt(year);
    if (tags) query.tags = { $in: tags.split(',') };
    
    // Search in question text
    if (search) {
      query.question = { $regex: search, $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const questions = await Question.find(query)
      .select('-__v')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

/**
 * @desc    Get Past Year Questions (PYQs)
 * @route   GET /api/questions/pyqs
 * @access  Public
 */
const getPYQs = async (req, res) => {
  try {
    const {
      category,
      year,
      difficulty,
      page = 1,
      limit = 20
    } = req.query;

    // Build query for PYQs
    const query = { isPYQ: true };

    if (category) query.category = category;
    if (year) query.year = parseInt(year);
    if (difficulty) query.difficulty = difficulty;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const questions = await Question.find(query)
      .select('-__v')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ year: -1, createdAt: -1 });

    // Get total count
    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      questions
    });
  } catch (error) {
    console.error('Get PYQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching PYQs',
      error: error.message
    });
  }
};

/**
 * @desc    Get single question by ID
 * @route   GET /api/questions/:id
 * @access  Public
 */
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).select('-__v');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
};

/**
 * @desc    Create new question (Admin only)
 * @route   POST /api/questions
 * @access  Private/Admin
 */
const createQuestion = async (req, res) => {
  try {
    const {
      question,
      options,
      answer,
      category,
      difficulty,
      isPYQ,
      year,
      explanation,
      tags
    } = req.body;

    // Validate required fields
    if (!question || !options || !answer || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create question
    const newQuestion = await Question.create({
      question,
      options,
      answer,
      category,
      difficulty,
      isPYQ,
      year,
      explanation,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
};

/**
 * @desc    Update question (Admin only)
 * @route   PUT /api/questions/:id
 * @access  Private/Admin
 */
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    // Update question
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
};

/**
 * @desc    Delete question (Admin only)
 * @route   DELETE /api/questions/:id
 * @access  Private/Admin
 */
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
};

/**
 * @desc    Get random questions for daily quiz
 * @route   GET /api/questions/daily
 * @access  Public
 */
const getDailyQuestions = async (req, res) => {
  try {
    const { count = 10, category, difficulty } = req.query;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    // Get random questions using aggregation
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } },
      { $project: { __v: 0 } }
    ]);

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('Get daily questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily questions',
      error: error.message
    });
  }
};

module.exports = {
  getQuestions,
  getPYQs,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getDailyQuestions
};