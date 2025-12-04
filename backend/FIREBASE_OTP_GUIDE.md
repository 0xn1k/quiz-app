# Firebase Phone OTP Integration Guide

## ✅ Why Use Firebase Phone Auth?

- **FREE**: 10,000 verifications/month
- **Reliable**: Google's SMS infrastructure
- **Secure**: Built-in spam protection
- **Easy**: No SMS gateway setup needed

## 🔧 Backend Setup (Already Done!)

Your backend now supports **both** methods:
1. ✅ Firebase Phone Auth (recommended)
2. ✅ Custom OTP (for advanced use cases)

## 📱 Frontend Integration

### Web (React/Next.js)

#### 1. Install Firebase
```bash
npm install firebase
```

#### 2. Initialize Firebase (`src/config/firebase.js`)
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

#### 3. Send OTP
```javascript
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './config/firebase';

// Setup reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible'
});

// Send OTP
const sendOTP = async (phoneNumber) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
    window.confirmationResult = confirmationResult;
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
```

#### 4. Verify OTP & Login to Backend
```javascript
const verifyOTP = async (otp, name) => {
  try {
    // Verify with Firebase
    const result = await window.confirmationResult.confirm(otp);
    
    // Get Firebase ID token
    const idToken = await result.user.getIdToken();
    
    // Send to your backend
    const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, name })
    });
    
    const data = await response.json();
    
    // Store JWT token
    localStorage.setItem('token', data.token);
    console.log('Login successful:', data.user);
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};
```

### React Native (Expo)

#### 1. Install Firebase
```bash
npm install firebase
```

#### 2. Setup (`src/config/firebase.js`)
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

#### 3. Send & Verify OTP
```javascript
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './config/firebase';

// Send OTP
const sendOTP = async (phoneNumber) => {
  const provider = new PhoneAuthProvider(auth);
  const verificationId = await provider.verifyPhoneNumber(phoneNumber);
  return verificationId;
};

// Verify OTP
const verifyOTP = async (verificationId, otp, name) => {
  const credential = PhoneAuthProvider.credential(verificationId, otp);
  const result = await signInWithCredential(auth, credential);
  
  // Get token and send to backend
  const idToken = await result.user.getIdToken();
  
  const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, name })
  });
  
  const data = await response.json();
  return data;
};
```

## 🔄 Complete Flow

```
1. User enters phone number
   ↓
2. Frontend: Firebase sends OTP (automatic)
   ↓
3. User enters OTP
   ↓
4. Frontend: Firebase verifies OTP
   ↓
5. Frontend: Get Firebase ID token
   ↓
6. Frontend: Send ID token to your backend
   ↓
7. Backend: Verify Firebase token
   ↓
8. Backend: Create/login user & return JWT
   ↓
9. Frontend: Store JWT for API calls
```

## 🧪 Testing

### Using Firebase (Recommended)
```bash
# 1. Frontend sends OTP via Firebase SDK (automatic)

# 2. Frontend verifies OTP and gets idToken

# 3. Send to backend
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "firebase_id_token_here",
    "name": "John Doe"
  }'
```

### Using Custom OTP (Development/Testing)
```bash
# 1. Send OTP
curl -X POST http://localhost:5000/api/auth/otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+919876543210",
    "useFirebase": false
  }'

# Response: { "otp": "123456" } (in dev mode)

# 2. Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+919876543210",
    "otp": "123456",
    "name": "John Doe"
  }'
```

## 🔐 Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (quiz-app-7dcbd)
3. Go to **Authentication** → **Sign-in method**
4. Enable **Phone** authentication
5. Add your domain to authorized domains (for web)

## 📱 Where to Check OTP?

### Real Phone Numbers:
**You DON'T see OTP in Firebase Console!**

Firebase sends OTP directly to the user's phone via SMS.
- User receives SMS on their phone
- User enters OTP in your app
- Firebase verifies it automatically

### For Testing (Without Real Phone):

#### Option 1: Add Test Phone Numbers in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Authentication**
3. Click **Settings** (gear icon) → **Phone numbers for testing**
4. Add test numbers:
   ```
   Phone Number: +91 98765 43210
   OTP Code: 123456
   ```
5. Click **Add**

Now when you use `+919876543210`:
- Firebase won't send real SMS
- You can use OTP `123456` to verify
- Perfect for development!

#### Option 2: Use Your Own Phone

Just use your real phone number:
- Firebase sends real SMS (FREE up to 10,000/month)
- You receive OTP on your phone
- Enter it in your app

#### Option 3: Check Firebase Authentication Users

After successful login:
1. Go to Firebase Console → **Authentication** → **Users**
2. You'll see all logged-in users with their phone numbers
3. But you won't see OTP codes here (they're temporary)

## 🧪 Testing Without SMS (Recommended for Development)

### Step 1: Add Test Phone Number
```
Firebase Console → Authentication → Settings → Phone numbers for testing

Add:
  Phone: +919876543210
  Code: 123456
```

### Step 2: Use in Your App
```javascript
// Frontend code
const phoneNumber = '+919876543210';
const otp = '123456'; // Fixed OTP for testing

// Send OTP (Firebase won't send SMS for test numbers)
await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

// Verify with fixed OTP
await confirmationResult.confirm(otp);
```

### Step 3: Check Backend Logs
```bash
# Your backend will log:
Server running in development mode on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

## 💰 Cost

- **Free tier**: 10,000 verifications/month
- **After free tier**: ~$0.01 per SMS (varies by country)
- **India**: Very cheap, ~₹0.50 per SMS

## 🎯 Recommendation

**Use Firebase Phone Auth** because:
- ✅ Already configured in your backend
- ✅ Free for most apps
- ✅ No SMS gateway setup needed
- ✅ Reliable and secure
- ✅ Works globally

Only use custom SMS if you need:
- Custom SMS templates
- Your own SMS provider
- Special compliance requirements

## 🔍 Quick Summary: Where is OTP?

| Scenario | Where to Find OTP |
|----------|------------------|
| **Real phone number** | User's phone (SMS) |
| **Test phone number** | You set it in Firebase Console (e.g., 123456) |
| **Development mode (custom OTP)** | Backend response & console logs |
| **Firebase Console** | ❌ Not visible (OTPs are temporary) |
| **After login** | ❌ OTP is gone, only user data remains |

## 🎬 Complete Testing Example

```javascript
// 1. Setup test number in Firebase Console:
//    Phone: +919876543210
//    Code: 123456

// 2. Frontend: Send OTP
const confirmationResult = await signInWithPhoneNumber(
  auth, 
  '+919876543210', 
  recaptchaVerifier
);
// No SMS sent! Firebase knows it's a test number

// 3. Frontend: Verify with test OTP
const result = await confirmationResult.confirm('123456');
const idToken = await result.user.getIdToken();

// 4. Frontend: Send to backend
const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken, name: 'Test User' })
});

const data = await response.json();
console.log('JWT Token:', data.token);
// Now use this token for all API calls!
```
