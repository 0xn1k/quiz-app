# Quiz Application Backend

A comprehensive Node.js + Express backend for a quiz application with authentication, question management, test creation, analytics, and payment integration.

## 🚀 Features

- **Authentication**
  - Firebase Phone Authentication (OTP)
  - Google OAuth Login
  - JWT-based session management

- **Question Management**
  - CRUD operations for questions
  - Filter by category, difficulty, tags
  - Past Year Questions (PYQs) support
  - Daily quiz generation

- **Test/Paper Management**
  - Create custom tests
  - Public and private tests
  - Test history tracking

- **Analytics**
  - Detailed performance tracking
  - Category-wise statistics
  - Performance trends over time
  - Test result analysis

- **Payment Integration**
  - Razorpay payment gateway
  - Subscription management
  - Payment history

- **Filters & Metadata**
  - Categories, difficulties, years, tags
  - Statistics and insights

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Firebase project with Phone Auth enabled
- Razorpay account

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

4. **Seed the database (optional)**
```bash
npm run seed
```

5. **Start the server**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Send OTP
```http
POST /api/auth/otp
Content-Type: application/json

{
  "mobile": "+919876543210"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "idToken": "firebase_id_token",
  "name": "User Name"
}
```

#### Google Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google_id_token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "user@example.com"
}
```

### Question Endpoints

#### Get All Questions
```http
GET /api/questions?category=Science&difficulty=easy&page=1&limit=20
```

#### Get PYQs
```http
GET /api/questions/pyqs?year=2023&category=History
```

#### Get Daily Questions
```http
GET /api/questions/daily?count=10&category=Science
```

#### Get Question by ID
```http
GET /api/questions/:id
```

#### Create Question (Protected)
```http
POST /api/questions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "question": "What is the capital of France?",
  "options": ["London", "Berlin", "Paris", "Madrid"],
  "answer": "Paris",
  "category": "Geography",
  "difficulty": "easy",
  "isPYQ": false,
  "explanation": "Paris is the capital of France",
  "tags": ["Geography", "Europe"]
}
```

### Test Endpoints

#### Get All Tests
```http
GET /api/tests?category=Science&page=1&limit=20
```

#### Get Test by ID
```http
GET /api/tests/:id
```

#### Create Test (Protected)
```http
POST /api/tests
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Science Quiz",
  "description": "Test your science knowledge",
  "questions": ["question_id_1", "question_id_2"],
  "isPublic": true,
  "duration": 60,
  "totalMarks": 100,
  "category": "Science",
  "difficulty": "medium"
}
```

#### Get My Tests (Protected)
```http
GET /api/tests/user/my-tests
Authorization: Bearer <jwt_token>
```

### Analytics Endpoints

#### Get User Analytics (Protected)
```http
GET /api/analytics?page=1&limit=20
Authorization: Bearer <jwt_token>
```

#### Submit Test (Protected)
```http
POST /api/analytics
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "testId": "test_id",
  "answers": [
    {
      "questionId": "question_id",
      "selectedAnswer": "answer",
      "timeTaken": 30
    }
  ],
  "timeTaken": 1800
}
```

#### Get Category Statistics (Protected)
```http
GET /api/analytics/stats/category
Authorization: Bearer <jwt_token>
```

#### Get Performance Trends (Protected)
```http
GET /api/analytics/stats/trends?days=30
Authorization: Bearer <jwt_token>
```

### Payment Endpoints

#### Create Order (Protected)
```http
POST /api/payments/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "amount": 499,
  "currency": "INR",
  "plan": "monthly"
}
```

#### Verify Payment (Protected)
```http
POST /api/payments/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature",
  "plan": "monthly"
}
```

#### Get Subscription Status (Protected)
```http
GET /api/payments/subscription-status
Authorization: Bearer <jwt_token>
```

### Filter Endpoints

#### Get All Filters
```http
GET /api/filters
```

#### Get Categories
```http
GET /api/filters/categories
```

#### Get Years
```http
GET /api/filters/years
```

#### Get Tags
```http
GET /api/filters/tags
```

#### Get Statistics
```http
GET /api/filters/stats
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── questionController.js
│   ├── testController.js
│   ├── analyticsController.js
│   ├── paymentController.js
│   └── filterController.js
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   └── errorHandler.js      # Error handling
├── models/
│   ├── user.js
│   ├── question.js
│   ├── test.js
│   └── analytics.js
├── routes/
│   ├── auth.js
│   ├── questions.js
│   ├── tests.js
│   ├── analytics.js
│   ├── payments.js
│   └── filters.js
├── utils/
│   ├── jwt.js               # JWT utilities
│   ├── firebase.js          # Firebase utilities
│   └── seed.js              # Database seeding
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js                # Entry point
```

## 🔒 Security Features

- JWT-based authentication
- Firebase Phone Auth integration
- Password-less authentication
- Protected routes with middleware
- Input validation
- Error handling
- CORS configuration

## 🧪 Testing

To test the API endpoints, you can use:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment mode | No (default: development) |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT | Yes |
| JWT_EXPIRE | JWT expiration time | No (default: 7d) |
| FIREBASE_PROJECT_ID | Firebase project ID | Yes |
| FIREBASE_PRIVATE_KEY | Firebase private key | Yes |
| FIREBASE_CLIENT_EMAIL | Firebase client email | Yes |
| RAZORPAY_KEY_ID | Razorpay key ID | Yes |
| RAZORPAY_KEY_SECRET | Razorpay key secret | Yes |
| CORS_ORIGIN | Allowed CORS origin | No (default: *) |

## 🚀 Deployment

### Deploy to Heroku

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:

```bash
git push heroku main
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, email support@quizapp.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with all core features