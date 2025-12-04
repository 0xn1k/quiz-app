# OTP Implementation Guide

## Current Implementation

The backend now has **server-side OTP generation and verification**:

### Features:
- ✅ 6-digit OTP generation
- ✅ 5-minute expiry
- ✅ In-memory storage (use Redis in production)
- ✅ Mock SMS sending (console log)
- ✅ OTP verification
- ✅ Auto user creation on first login

## Testing the OTP Flow

### 1. Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210"}'
```

**Response (Development Mode):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "mobile": "+919876543210",
  "otp": "123456"
}
```

**Note:** OTP is shown in response only in development mode. Check server console for the OTP.

### 2. Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "+919876543210",
    "otp": "123456",
    "name": "John Doe"
  }'
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
    "mobile": "+919876543210",
    "email": null,
    "subscription": false,
    "subscriptionExpiry": null
  }
}
```

## Production SMS Integration

### Option 1: Twilio (Recommended)

1. **Install Twilio:**
```bash
npm install twilio
```

2. **Add to .env:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

3. **Update `utils/otp.js`:**
```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTPViaSMS = async (mobile, otp) => {
  await client.messages.create({
    body: `Your Quiz App OTP is: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: mobile
  });
  return { success: true };
};
```

### Option 2: AWS SNS

1. **Install AWS SDK:**
```bash
npm install @aws-sdk/client-sns
```

2. **Add to .env:**
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

3. **Update `utils/otp.js`:**
```javascript
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const client = new SNSClient({ region: process.env.AWS_REGION });

const sendOTPViaSMS = async (mobile, otp) => {
  await client.send(new PublishCommand({
    Message: `Your Quiz App OTP is: ${otp}. Valid for 5 minutes.`,
    PhoneNumber: mobile
  }));
  return { success: true };
};
```

## Production Storage

Replace in-memory Map with Redis:

```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

const storeOTP = async (mobile, otp) => {
  await client.setEx(`otp:${mobile}`, 300, otp); // 5 minutes
};

const verifyOTP = async (mobile, otp) => {
  const stored = await client.get(`otp:${mobile}`);
  if (!stored) return { success: false, message: 'OTP expired' };
  if (stored !== otp) return { success: false, message: 'Invalid OTP' };
  await client.del(`otp:${mobile}`);
  return { success: true };
};
```

## Security Best Practices

1. **Rate Limiting:** Limit OTP requests per mobile (3-5 per hour)
2. **Attempt Limiting:** Max 3 verification attempts per OTP
3. **IP Tracking:** Monitor suspicious patterns
4. **HTTPS Only:** Never send OTP over HTTP in production
5. **Remove Debug Info:** Don't send OTP in API response in production
