const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  totalMarks: {
    type: Number,
    default: 100
  },
  category: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'mixed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
testSchema.index({ createdBy: 1, createdAt: -1 });
testSchema.index({ isPublic: 1, category: 1 });
testSchema.index({ category: 1, difficulty: 1 });

// Virtual for question count
testSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

module.exports = mongoose.model('Test', testSchema);