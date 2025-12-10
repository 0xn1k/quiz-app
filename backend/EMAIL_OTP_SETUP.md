# Email OTP Authentication Setup

## ✅ Features Implemented

- ✅ Send OTP to email
- ✅ Verify OTP and create/login user
- ✅ 10-minute OTP expiry
- ✅ Beautiful HTML email template
- ✅ Automatic user registration on first login

## 🔧 Gmail Setup (Required)

### Step 1: Enable 2-Factor Authentication

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Enter "Quiz App"
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Note:** Remove spaces from app password: `abcdefghijklmnop`

## 📧 API Endpoints

### 1. Send OTP to Email

```bash
POST /api/auth/email-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "email": "user@example.com",
  "otp": "123456"  // Only in development mode
}
```

### 2. Verify Email OTP

```bash
POST /api/auth/verify-email-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "subscription": false
  }
}
```

## 🧪 Testing

### Using cURL

```bash
# 1. Send OTP
curl -X POST http://localhost:5000/api/auth/email-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_email@gmail.com",
    "name": "Test User"
  }'

# Check your email for OTP

# 2. Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_email@gmail.com",
    "otp": "123456",
    "name": "Test User"
  }'
```

### Using Postman

1. **Send OTP:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/email-otp`
   - Body (JSON):
     ```json
     {
       "email": "user@example.com",
       "name": "John Doe"
     }
     ```

2. **Check Email** for OTP

3. **Verify OTP:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/verify-email-otp`
   - Body (JSON):
     ```json
     {
       "email": "user@example.com",
       "otp": "123456",
       "name": "John Doe"
     }
     ```

## 🔄 Complete Authentication Flow

```
1. User enters email on frontend
   ↓
2. Frontend: POST /api/auth/email-otp
   ↓
3. Backend: Generate 6-digit OTP
   ↓
4. Backend: Send email with OTP
   ↓
5. User receives email with OTP
   ↓
6. User enters OTP on frontend
   ↓
7. Frontend: POST /api/auth/verify-email-otp
   ↓
8. Backend: Verify OTP
   ↓
9. Backend: Create user (if new) or login
   ↓
10. Backend: Return JWT token
   ↓
11. Frontend: Store token & redirect to dashboard
```

## 📱 Frontend Integration Example

### React/Next.js

```javascript
// Send OTP
const sendOTP = async (email, name) => {
  const response = await fetch('http://localhost:5000/api/auth/email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name })
  });
  const data = await response.json();
  return data;
};

// Verify OTP
const verifyOTP = async (email, otp, name) => {
  const response = await fetch('http://localhost:5000/api/auth/verify-email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, name })
  });
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    // Redirect to dashboard
  }
  
  return data;
};
```

### React Native

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Send OTP
const sendOTP = async (email, name) => {
  const response = await fetch('http://localhost:5000/api/auth/email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name })
  });
  return await response.json();
};

// Verify OTP
const verifyOTP = async (email, otp, name) => {
  const response = await fetch('http://localhost:5000/api/auth/verify-email-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, name })
  });
  const data = await response.json();
  
  if (data.success) {
    await AsyncStorage.setItem('token', data.token);
  }
  
  return data;
};
```

## 🔒 Security Features

- ✅ 10-minute OTP expiry
- ✅ OTP deleted after verification
- ✅ Email validation
- ✅ Case-insensitive email handling
- ✅ Secure password storage (app password)

## 🚀 Production Recommendations

1. **Use Redis** instead of in-memory storage:
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   
   await client.setEx(`email-otp:${email}`, 600, otp); // 10 min
   ```

2. **Rate Limiting**: Max 3 OTP requests per email per hour

3. **Email Service**: Consider using SendGrid or AWS SES for production

4. **Environment Variables**: Never commit EMAIL_PASSWORD to git

## 📊 Email Template Preview

```
┌─────────────────────────────────┐
│  Welcome to Quiz App!           │
│                                 │
│  Hi John Doe,                   │
│                                 │
│  Your OTP code is:              │
│                                 │
│      1 2 3 4 5 6               │
│                                 │
│  This OTP is valid for 10 min. │
│                                 │
│  Quiz App - Test Your Knowledge │
└─────────────────────────────────┘
```

## ⚠️ Troubleshooting

### "Invalid credentials" error
- Make sure you're using **App Password**, not your Gmail password
- Remove spaces from app password

### Email not received
- Check spam folder
- Verify EMAIL_USER is correct
- Ensure 2FA is enabled on Gmail

### "Less secure app access" error
- Use App Password instead (see Step 2 above)

## 🎯 All Authentication Methods Available

Your backend now supports **3 authentication methods**:

1. ✅ **Email OTP** (New!)
2. ✅ **Phone OTP** (Firebase)
3. ✅ **Google OAuth**

Choose the one that fits your needs!
