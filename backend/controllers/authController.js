const User = require('../models/user');
const { generateAuthToken } = require('../utils/jwt');
const { verifyFirebaseToken, verifyGoogleToken } = require('../utils/firebase');
const { generateOTP, storeOTP, verifyOTP: verifyOTPUtil, sendOTPViaSMS } = require('../utils/otp');
const { generateEmailOTP, storeEmailOTP, verifyEmailOTP, sendOTPViaEmail } = require('../utils/emailOtp');

/**
 * @desc    Send OTP to mobile number
 * @route   POST /api/auth/otp
 * @access  Public
 * @note    For Firebase: OTP is sent client-side, this endpoint just validates the number
 *          For Custom SMS: Generates and sends OTP via SMS service (requires Twilio/AWS SNS)
 */
const sendOTP = async (req, res) => {
  try {
    const { mobile, useFirebase = true } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    // Validate mobile number format
    const mobileRegex = /^[+]?[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number format'
      });
    }

    // Firebase approach (recommended - free and reliable)
    if (useFirebase) {
      return res.status(200).json({
        success: true,
        message: 'Please use Firebase Phone Auth on client side to send OTP',
        mobile,
        method: 'firebase'
      });
    }

    // Custom SMS approach (requires SMS service setup)
    const otp = generateOTP();
    storeOTP(mobile, otp);
    await sendOTPViaSMS(mobile, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      mobile,
      method: 'sms',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

/**
 * @desc    Verify OTP and login/register user
 * @route   POST /api/auth/verify-otp
 * @access  Public
 * @note    Supports both Firebase token verification and custom OTP verification
 */
const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp, name, idToken } = req.body;

    let phoneNumber = mobile;

    // Firebase verification (recommended)
    if (idToken) {
      try {
        const decodedToken = await verifyFirebaseToken(idToken);
        phoneNumber = decodedToken.phone_number;
        
        if (!phoneNumber) {
          return res.status(400).json({
            success: false,
            message: 'Phone number not found in Firebase token'
          });
        }
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Firebase token'
        });
      }
    }
    // Custom OTP verification
    else if (mobile && otp) {
      const otpVerification = verifyOTPUtil(mobile, otp);
      
      if (!otpVerification.success) {
        return res.status(400).json({
          success: false,
          message: otpVerification.message
        });
      }
    }
    // Missing credentials
    else {
      return res.status(400).json({
        success: false,
        message: 'Either (idToken) or (mobile + otp) is required'
      });
    }

    // Check if user exists
    let user = await User.findOne({ mobile: phoneNumber });

    if (!user) {
      // Create new user
      user = await User.create({
        mobile: phoneNumber,
        name: name || 'User'
      });
    }

    // Generate JWT token
    const token = generateAuthToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

/**
 * @desc    Google OAuth login
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify Google token
    const decodedToken = await verifyGoogleToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ googleId: uid });

    if (!user) {
      // Check if user exists with same email
      user = await User.findOne({ email });

      if (user) {
        // Update existing user with Google ID
        user.googleId = uid;
        user.name = name || user.name;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId: uid,
          email,
          name: name || 'User',
          profilePicture: picture
        });
      }
    }

    // Generate JWT token
    const token = generateAuthToken(user);

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error with Google login',
      error: error.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update name if provided
    if (name) user.name = name;

    // Handle email update
    if (email) {
      const newEmail = email.toLowerCase();
      
      // Check if email is different from current
      if (newEmail === user.email) {
        return res.status(400).json({
          success: false,
          message: 'New email is the same as the current email'
        });
      }

      // Check if email is already in use
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account'
        });
      }

      // Update email and require re-verification
      user.email = newEmail;
      user.isEmailVerified = false;
      await user.save();

      // Send OTP to new email
      const otp = generateEmailOTP();
      storeEmailOTP(newEmail, otp);
      await sendOTPViaEmail(newEmail, otp, user.name);

      return res.status(200).json({
        success: true,
        message: 'Email updated. Please verify your new email. OTP sent to your new email address.',
        user,
        requiresVerification: true
      });
    }

    // If only name was updated
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * @desc    Send OTP to email
 * @route   POST /api/auth/email-otp
 * @access  Public
 */
const sendEmailOTP = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

   const checkUserWithEmailisVerified = await User.findOne({ email: email.toLowerCase() }); 
    if (checkUserWithEmailisVerified && checkUserWithEmailisVerified.isEmailVerified) { 
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. Please login.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Generate OTP
    const otp = generateEmailOTP();
    
    // Store OTP
    storeEmailOTP(email, otp);
    
    // Send OTP via Email
    await sendOTPViaEmail(email, otp, name);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      email,
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Send email OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
};

/**
 * @desc    Verify email OTP and register/login user
 * @route   POST /api/auth/verify-email-otp
 * @access  Public
 */
const verifyEmailOTPController = async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP
    const otpVerification = verifyEmailOTP(email, otp);
    
    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.message
      });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user with verified email
      user = await User.create({
        email: email.toLowerCase(),
        name: name || 'User',
        isEmailVerified: true
      });
    } else {
      // Update existing user to verified
      user.isEmailVerified = true;
      await user.save();
    }

    // Generate JWT token
    const token = generateAuthToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isEmailVerified: user.isEmailVerified,
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry
      }
    });
  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  googleLogin,
  getMe,
  updateProfile,
  sendEmailOTP,
  verifyEmailOTPController
};