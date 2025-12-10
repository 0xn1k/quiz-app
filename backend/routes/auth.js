const express = require('express');
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  googleLogin,
  getMe,
  updateProfile,
  sendEmailOTP,
  verifyEmailOTPController
} = require('../controllers/authController');
const {
  register,
  login
} = require('../controllers/simpleAuthController');
const { protect } = require('../middleware/authMiddleware');

// Simple Auth Routes (No Firebase Required)
router.post('/register', register);
router.post('/login', login);

// Firebase Auth Routes (Optional - requires Firebase setup)
router.post('/otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleLogin);

// Email OTP Routes
router.post('/email-otp', sendEmailOTP);
router.post('/verify-email-otp', verifyEmailOTPController);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;