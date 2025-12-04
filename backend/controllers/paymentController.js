const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/user');

// Initialize Razorpay instance only if credentials are provided
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.warn('⚠️  Razorpay credentials not found. Payment features will not be available.');
  console.warn('   Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file');
}

/**
 * @desc    Create Razorpay order for subscription
 * @route   POST /api/payment/create
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact administrator.'
      });
    }

    const { amount, currency = 'INR', plan } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    // Create order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
        plan: plan || 'basic',
        email: req.user.email,
        mobile: req.user.mobile
      }
    };

    // Create order
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payment/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is not configured. Please contact administrator.'
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = 'monthly'
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Generate signature for verification
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Payment is valid, update user subscription
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate subscription expiry based on plan
    const expiryDate = new Date();
    switch (plan) {
      case 'monthly':
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        break;
      case 'quarterly':
        expiryDate.setMonth(expiryDate.getMonth() + 3);
        break;
      case 'yearly':
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        break;
      default:
        expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Update user subscription
    user.subscription = true;
    user.subscriptionExpiry = expiryDate;
    user.subscriptionPlan = plan;
    user.lastPaymentId = razorpay_payment_id;
    user.lastPaymentDate = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        active: true,
        plan,
        expiryDate,
        paymentId: razorpay_payment_id
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

/**
 * @desc    Get payment history
 * @route   GET /api/payment/history
 * @access  Private
 */
const getPaymentHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('lastPaymentId lastPaymentDate subscriptionPlan subscriptionExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      paymentHistory: {
        lastPaymentId: user.lastPaymentId,
        lastPaymentDate: user.lastPaymentDate,
        currentPlan: user.subscriptionPlan,
        expiryDate: user.subscriptionExpiry
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

/**
 * @desc    Get subscription status
 * @route   GET /api/payment/subscription-status
 * @access  Private
 */
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription subscriptionExpiry subscriptionPlan');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isActive = user.subscription && 
                     user.subscriptionExpiry && 
                     new Date(user.subscriptionExpiry) > new Date();

    res.status(200).json({
      success: true,
      subscription: {
        active: isActive,
        plan: user.subscriptionPlan,
        expiryDate: user.subscriptionExpiry,
        daysRemaining: isActive 
          ? Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24))
          : 0
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel subscription
 * @route   POST /api/payment/cancel-subscription
 * @access  Private
 */
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Set subscription to false but keep expiry date
    // This allows user to use subscription until expiry
    user.subscription = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled. You can continue using premium features until expiry date.',
      expiryDate: user.subscriptionExpiry
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getSubscriptionStatus,
  cancelSubscription
};