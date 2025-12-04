const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  correct: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  wrong: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  attempted: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unattempted: {
    type: Number,
    min: 0,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    min: 0
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: String,
    isCorrect: Boolean,
    timeTaken: Number // in seconds
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
analyticsSchema.index({ user: 1, createdAt: -1 });
analyticsSchema.index({ test: 1, score: -1 });
analyticsSchema.index({ user: 1, test: 1 });

// Calculate percentage before saving
analyticsSchema.pre('save', function(next) {
  if (this.score && this.test) {
    // Percentage will be calculated based on total marks
    // This is a placeholder - actual calculation should use test.totalMarks
    this.percentage = (this.score / 100) * 100;
  }
  next();
});

module.exports = mongoose.model('Analytics', analyticsSchema);