const crypto = require('crypto');

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Store OTP with expiry (5 minutes)
const storeOTP = (mobile, otp) => {
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(mobile, { otp, expiry });
};

// Verify OTP
const verifyOTP = (mobile, otp) => {
  const stored = otpStore.get(mobile);
  
  if (!stored) {
    return { success: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > stored.expiry) {
    otpStore.delete(mobile);
    return { success: false, message: 'OTP expired' };
  }
  
  if (stored.otp !== otp) {
    return { success: false, message: 'Invalid OTP' };
  }
  
  otpStore.delete(mobile);
  return { success: true, message: 'OTP verified successfully' };
};

// Send OTP via SMS (mock implementation - integrate Twilio/AWS SNS in production)
const sendOTPViaSMS = async (mobile, otp) => {
  // Mock SMS sending - replace with actual SMS service
  console.log(`📱 Sending OTP ${otp} to ${mobile}`);
  
  // For Twilio integration:
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   body: `Your Quiz App OTP is: ${otp}. Valid for 5 minutes.`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: mobile
  // });
  
  return { success: true };
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTPViaSMS
};
