const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length >= 2 && v.length <= 6;
      },
      message: 'Question must have between 2 and 6 options'
    }
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    index: true
  },
  isPYQ: {
    type: Boolean,
    default: false,
    index: true
  },
  year: {
    type: Number,
    sparse: true
  },
  explanation: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient filtering
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ isPYQ: 1, year: -1 });
questionSchema.index({ category: 1, isPYQ: 1 });

module.exports = mongoose.model('Question', questionSchema);