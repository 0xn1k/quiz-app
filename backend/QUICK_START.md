# 🚀 Quick Start - Get Running in 5 Minutes

## Option 1: Run Without External Services (Fastest)

If you just want to test the API without setting up MongoDB, Firebase, or Razorpay:

### 1. Install Dependencies
```bash
npm install
```

### 2. Use Local MongoDB (if you have it installed)
The `.env` file is already configured to use local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/quiz-app
```

If you don't have MongoDB installed locally, you can:
- **Install MongoDB locally**: [Download MongoDB](https://www.mongodb.com/try/download/community)
- **Or use MongoDB Atlas** (free cloud database): See Option 2 below

### 3. Start the Server
```bash
npm run dev
```

The server will start with warnings about Firebase and Razorpay not being configured, but the core API will work!

### 4. Test the API
Open your browser and visit:
```
http://localhost:5000
```

You should see:
```json
{
  "success": true,
  "message": "Quiz App API is running",
  "version": "1.0.0"
}
```

### 5. Seed Sample Data (Optional)
```bash
npm run seed
```

This adds 15 sample questions to test with.

### 6. Test Endpoints
Try these endpoints in your browser or Postman:

- **Get all questions**: `http://localhost:5000/api/questions`
- **Get filters**: `http://localhost:5000/api/filters`
- **Get statistics**: `http://localhost:5000/api/filters/stats`

---

## Option 2: Full Setup with MongoDB Atlas (Recommended)

### 1. Create MongoDB Atlas Account (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a **FREE** M0 cluster (no credit card required)
4. Create a database user:
   - Username: `quizapp`
   - Password: Choose a strong password
5. Add your IP to whitelist:
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
6. Get your connection string:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### 2. Update .env File

Edit the `.env` file and replace the MongoDB URI:

```env
MONGODB_URI=mongodb+srv://quizapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/quiz-app?retryWrites=true&w=majority
```

Replace:
- `YOUR_PASSWORD` with your actual password
- `cluster0.xxxxx` with your actual cluster address

### 3. Start the Server
```bash
npm run dev
```

### 4. Seed the Database
```bash
npm run seed
```

---

## Option 3: Full Setup with All Services

### Prerequisites
- MongoDB Atlas account (see Option 2)
- Firebase project
- Razorpay account

### 1. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Phone & Google sign-in
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key"
6. Download the JSON file

### 2. Set Up Razorpay

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for an account
3. Go to Settings → API Keys
4. Generate Test API keys

### 3. Update .env File

```env
# MongoDB (from Option 2)
MONGODB_URI=mongodb+srv://...

# Firebase (from downloaded JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
```

### 4. Start the Server
```bash
npm run dev
```

---

## 🎯 What Works Without Configuration?

### ✅ Works Immediately (No Setup Required)
- Health check endpoint
- Question management (with local MongoDB)
- Test creation
- Filters and statistics
- All GET endpoints

### ⚠️ Requires Configuration
- **Firebase Auth** - Phone OTP and Google login
- **Razorpay** - Payment processing
- **MongoDB Atlas** - Cloud database (or use local MongoDB)

---

## 🧪 Testing the API

### Using Browser
Visit these URLs:
- `http://localhost:5000` - Health check
- `http://localhost:5000/api/questions` - Get questions
- `http://localhost:5000/api/filters` - Get filters

### Using Postman
Import the `postman_collection.json` file included in the project.

### Using cURL
```bash
# Health check
curl http://localhost:5000

# Get questions
curl http://localhost:5000/api/questions

# Get filters
curl http://localhost:5000/api/filters
```

---

## 🐛 Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running locally, OR
- Use MongoDB Atlas and update the connection string in `.env`

### "Firebase warnings"
- These are just warnings. The API will work without Firebase.
- Firebase is only needed for phone/Google authentication.

### "Port 5000 already in use"
```bash
# Kill the process
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. ✅ Get the server running (you're here!)
2. 📖 Read `README.md` for complete API documentation
3. 🔧 Read `SETUP_GUIDE.md` for detailed setup instructions
4. 🧪 Import `postman_collection.json` to test all endpoints
5. 🚀 Build your frontend and connect to the API!

---

## 💡 Pro Tips

- Start with local MongoDB for quick testing
- Add Firebase later when you need authentication
- Use Razorpay test keys for development
- Check the console for helpful warnings and errors
- The API works great even without Firebase/Razorpay configured!

Happy coding! 🎉