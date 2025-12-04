const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate token for user authentication
 * @param {Object} user - User object from database
 * @returns {String} JWT token
 */
const generateAuthToken = (user) => {
  const payload = {
    id: user._id,
    mobile: user.mobile,
    email: user.email,
    subscription: user.subscription
  };
  return generateToken(payload);
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthToken
};