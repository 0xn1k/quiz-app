const { verifyToken } = require('../utils/jwt');
const User = require('../models/user');

/**
 * Middleware to protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-__v');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user has active subscription
 */
const checkSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if user has active subscription
    if (!req.user.subscription) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required to access this resource'
      });
    }

    // Check if subscription has expired
    if (req.user.subscriptionExpiry && new Date(req.user.subscriptionExpiry) < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Subscription has expired. Please renew to continue.'
      });
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error checking subscription status',
      error: error.message
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Useful for routes that work differently for authenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = await User.findById(decoded.id).select('-__v');
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

module.exports = {
  protect,
  checkSubscription,
  optionalAuth
};