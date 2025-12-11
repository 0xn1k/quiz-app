const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    unique: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    select: false // Don't return password in queries by default
  },
  subscription: {
    type: Boolean,
    default: false
  },
  subscriptionExpiry: {
    type: Date
  },
  subscriptionPlan: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  lastPaymentId: {
    type: String
  },
  lastPaymentDate: {
    type: Date
  },
  firebaseUid: {
    type: String
  },
  profilePicture: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);