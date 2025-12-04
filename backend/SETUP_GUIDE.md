# Quiz App Backend - Setup Guide

## 🚀 Quick Start Guide

Follow these steps to get your quiz application backend up and running.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js
- Mongoose
- Firebase Admin SDK
- Razorpay
- JWT
- And more...

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/quiz-app?retryWrites=true&w=majority
```

## Step 3: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Phone** sign-in method
4. Enable **Authentication** → **Google** sign-in method
5. Go to **Project Settings** → **Service Accounts**
6. Click **Generate New Private Key**
7. Download the JSON file

From the downloaded JSON file, you'll need:
- `project_id`
- `private_key`
- `client_email`

## Step 4: Set Up Razorpay

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for an account
3. Go to **Settings** → **API Keys**
4. Generate Test/Live API keys
5. Copy the **Key ID** and **Key Secret**

## Step 5: Create .env File

Create a `.env` file in the root directory and add your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/quiz-app?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- Keep the `FIREBASE_PRIVATE_KEY` in quotes and preserve the `\n` characters
- Never commit the `.env` file to version control

## Step 6: Seed the Database (Optional)

Populate your database with sample questions:

```bash
npm run seed
```

This will add 15 sample questions across different categories.

## Step 7: Start the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## Step 8: Test the API

### Using Browser
Visit: `http://localhost:5000`

You should see:
```json
{
  "success": true,
  "message": "Quiz App API is running",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### Using Postman or Thunder Client

1. **Test Health Check**
   ```
   GET http://localhost:5000/
   ```

2. **Get All Questions**
   ```
   GET http://localhost:5000/api/questions
   ```

3. **Get Filters**
   ```
   GET http://localhost:5000/api/filters
   ```

## 📱 Testing Authentication

### Firebase Phone Auth (Client-Side Setup Required)

The OTP flow requires Firebase SDK on the client side:

1. Client sends phone number to Firebase
2. Firebase sends OTP to user
3. User enters OTP
4. Client verifies OTP with Firebase
5. Client receives `idToken`
6. Client sends `idToken` to your backend `/api/auth/verify-otp`
7. Backend verifies token and returns JWT

### Google OAuth (Client-Side Setup Required)

1. Client initiates Google sign-in
2. Client receives Google `idToken`
3. Client sends `idToken` to `/api/auth/google`
4. Backend verifies and returns JWT

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Check if your IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Ensure network access is configured

### Firebase Issues
- Verify all Firebase credentials are correct
- Check if Phone Auth is enabled in Firebase Console
- Ensure private key format is preserved with `\n` characters

### Razorpay Issues
- Use test keys for development
- Verify keys are copied correctly
- Check Razorpay dashboard for any restrictions

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

## 📚 Next Steps

1. **Integrate with Frontend**
   - Use the API endpoints in your React/Vue/Angular app
   - Implement Firebase Auth on client side
   - Handle JWT tokens for authenticated requests

2. **Add More Questions**
   - Use the POST `/api/questions` endpoint
   - Or modify the seed script

3. **Customize**
   - Add more categories
   - Implement admin roles
   - Add more analytics features

4. **Deploy**
   - Deploy to Heroku, Railway, or Render
   - Set environment variables in deployment platform
   - Update CORS_ORIGIN to your frontend URL

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Never commit `.env` file
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your frontend domain in production
- [ ] Use HTTPS in production
- [ ] Implement rate limiting for auth endpoints
- [ ] Add input validation for all endpoints
- [ ] Regularly update dependencies

## 📞 Support

If you encounter any issues:
1. Check the error logs in the console
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, Firebase, Razorpay) are properly configured
4. Review the README.md for API documentation

Happy coding! 🚀