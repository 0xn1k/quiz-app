# Quiz App - React Native Frontend

A React Native mobile application for the Quiz App, built with Expo and connected to the Node.js backend.

## 🚀 Features

- **Authentication**
  - Phone OTP login
  - Google OAuth
  - Persistent sessions

- **Quiz Management**
  - Daily quiz questions
  - Browse all tests
  - Take tests with timer
  - View results

- **Analytics**
  - Performance tracking
  - Category-wise statistics
  - Progress trends

- **Profile**
  - User information
  - Subscription status
  - Settings

## 📋 Prerequisites

- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

## 🛠️ Installation

1. **Navigate to frontend directory**
```bash
cd frontend-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:
```env
API_BASE_URL=http://localhost:5000/api
RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. **Start the app**
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 📁 Project Structure

```
frontend-app/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.js
│   │   ├── auth.js
│   │   ├── questions.js
│   │   ├── tests.js
│   │   ├── analytics.js
│   │   ├── payments.js
│   │   └── filters.js
│   ├── components/       # Reusable components
│   ├── context/          # React Context (Auth)
│   │   └── AuthContext.js
│   ├── navigation/       # Navigation setup
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── screens/          # App screens
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── TestsScreen.js
│   │   ├── AnalyticsScreen.js
│   │   └── ProfileScreen.js
│   └── utils/            # Utility functions
├── App.js                # Entry point
├── app.json              # Expo configuration
└── package.json
```

## 🔌 API Integration

The app connects to the backend API at `http://localhost:5000/api`. Update the `API_BASE_URL` in `src/api/client.js` for production.

All API calls include JWT token authentication automatically via axios interceptors.

## 📱 Screens

- **Login**: Phone OTP authentication
- **Home**: Daily quiz questions
- **Tests**: Browse and take tests
- **Analytics**: View performance statistics
- **Profile**: User info and logout

## 🚀 Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 📝 Notes

- Ensure backend server is running before starting the app
- Update API_BASE_URL for production deployment
- Configure Firebase for phone authentication
- Add Razorpay credentials for payment integration

## 🔄 Version

- **v1.0.0** - Initial release
