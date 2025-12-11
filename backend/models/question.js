const mongoose = require('mongoose');

// Content block schema for rich content (text, math, images, tables)
const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'math', 'image', 'table', 'markdown'],
    required: true
  },
  text: String, // for type: 'text' or 'markdown'
  formula: String, // for type: 'math' (LaTeX)
  url: String, // for type: 'image'
  caption: String, // for images
  data: mongoose.Schema.Types.Mixed // for type: 'table' (array of arrays)
}, { _id: false });

// Option schema - supports text, math, or images
const optionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'math', 'image'],
    default: 'text'
  },
  text: String,
  formula: String, // LaTeX formula
  url: String // image URL
}, { _id: false });

const questionSchema = new mongoose.Schema({
  // Legacy support - simple text question
  question: {
    type: String,
    trim: true
  },
  
  // Rich content - structured JSON (recommended)
  content: {
    type: [contentBlockSchema],
    validate: {
      validator: function(v) {
        // Either question or content must be provided
        return this.question || (v && v.length > 0);
      },
      message: 'Either question text or content blocks must be provided'
    }
  },
  
  // Options - supports rich content
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length >= 2 && v.length <= 6;
      },
      message: 'Question must have between 2 and 6 options'
    }
  },
  
  // Answer - now uses index instead of text
  answerIndex: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Legacy answer field (for backward compatibility)
  answer: {
    type: String,
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
  // Explanation - supports rich content
  explanation: {
    type: mongoose.Schema.Types.Mixed, // Can be String or [contentBlockSchema]
    default: null
  },
  
  // Exam/Subject metadata
  exam: {
    type: String,
    trim: true,
    index: true
  },
  subject: {
    type: String,
    trim: true,
    index: true
  },
  topic: {
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
questionSchema.index({ exam: 1, subject: 1 });
questionSchema.index({ subject: 1, topic: 1 });

// Virtual for backward compatibility
questionSchema.virtual('questionText').get(function() {
  if (this.question) return this.question;
  if (this.content && this.content.length > 0) {
    return this.content.map(block => {
      if (block.type === 'text' || block.type === 'markdown') return block.text;
      if (block.type === 'math') return `[Math: ${block.formula}]`;
      if (block.type === 'image') return `[Image: ${block.caption || 'diagram'}]`;
      if (block.type === 'table') return '[Table]';
      return '';
    }).join(' ');
  }
  return '';
});

module.exports = mongoose.model('Question', questionSchema);