const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase credentials are provided
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.warn('⚠️  Firebase credentials not found. Firebase authentication will not be available.');
      console.warn('   Please set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in .env file');
      return;
    }

    // Check if already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        })
      });
      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.warn('⚠️  Firebase authentication will not be available. Please check your Firebase credentials.');
  }
};

/**
 * Verify Firebase ID token from client
 * @param {String} idToken - Firebase ID token from client
 * @returns {Object} Decoded token with user info
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    if (admin.apps.length === 0) {
      throw new Error('Firebase is not initialized. Please configure Firebase credentials.');
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error.message);
    throw new Error(error.message || 'Invalid Firebase token');
  }
};

/**
 * Get user by phone number
 * @param {String} phoneNumber - Phone number in E.164 format
 * @returns {Object} Firebase user record
 */
const getUserByPhone = async (phoneNumber) => {
  try {
    if (admin.apps.length === 0) {
      throw new Error('Firebase is not initialized. Please configure Firebase credentials.');
    }
    const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
    return userRecord;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw error;
  }
};

/**
 * Create custom token for user
 * @param {String} uid - Firebase user ID
 * @returns {String} Custom token
 */
const createCustomToken = async (uid) => {
  try {
    if (admin.apps.length === 0) {
      throw new Error('Firebase is not initialized. Please configure Firebase credentials.');
    }
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error.message);
    throw error;
  }
};

/**
 * Verify Google OAuth token
 * @param {String} idToken - Google OAuth ID token
 * @returns {Object} Decoded token with user info
 */
const verifyGoogleToken = async (idToken) => {
  try {
    if (admin.apps.length === 0) {
      throw new Error('Firebase is not initialized. Please configure Firebase credentials.');
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if it's a Google sign-in
    if (decodedToken.firebase.sign_in_provider !== 'google.com') {
      throw new Error('Not a Google sign-in token');
    }
    
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Google token:', error.message);
    throw new Error(error.message || 'Invalid Google token');
  }
};

module.exports = {
  initializeFirebase,
  verifyFirebaseToken,
  getUserByPhone,
  createCustomToken,
  verifyGoogleToken
};