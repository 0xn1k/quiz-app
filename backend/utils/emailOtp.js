const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory OTP storage (use Redis in production)
const emailOtpStore = new Map();

// Generate 6-digit OTP
const generateEmailOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Store OTP with expiry (10 minutes)
const storeEmailOTP = (email, otp) => {
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  emailOtpStore.set(email.toLowerCase(), { otp, expiry });
};

// Verify OTP
const verifyEmailOTP = (email, otp) => {
  const stored = emailOtpStore.get(email.toLowerCase());
  
  if (!stored) {
    return { success: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > stored.expiry) {
    emailOtpStore.delete(email.toLowerCase());
    return { success: false, message: 'OTP expired' };
  }
  
  if (stored.otp !== otp) {
    return { success: false, message: 'Invalid OTP' };
  }
  
  emailOtpStore.delete(email.toLowerCase());
  return { success: true, message: 'OTP verified successfully' };
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send OTP via Email
const sendOTPViaEmail = async (email, otp, name = 'User') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Quiz App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Quiz App OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Quiz App!</h2>
          <p>Hi ${name},</p>
          <p>Your OTP code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">Quiz App - Test Your Knowledge</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = {
  generateEmailOTP,
  storeEmailOTP,
  verifyEmailOTP,
  sendOTPViaEmail
};
