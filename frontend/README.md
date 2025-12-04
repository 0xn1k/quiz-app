# Quiz Application Frontend

A modern Next.js frontend for the Quiz Application with authentication, test management, analytics, and payment integration.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 14, React 18, and Tailwind CSS
- **Authentication**: Firebase Phone OTP and Google OAuth integration
- **Test Management**: Browse, filter, and take tests with real-time timer
- **Daily Quiz**: Practice with daily generated questions
- **PYQs**: Access and filter past year questions
- **Analytics Dashboard**: Track performance with detailed statistics
- **Payment Integration**: Razorpay subscription management
- **Responsive Design**: Mobile-first approach with responsive layouts

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🛠️ Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── login/             # Login page
│   │   ├── tests/             # Tests listing and detail
│   │   ├── dashboard/         # User dashboard
│   │   ├── analytics/         # Analytics page
│   │   ├── daily-quiz/        # Daily quiz page
│   │   ├── pyqs/              # Past year questions
│   │   └── pricing/           # Pricing and subscription
│   ├── components/            # Reusable components
│   │   └── Navbar.tsx         # Navigation bar
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                   # Utilities and configurations
│   │   ├── api.ts             # API client
│   │   └── firebase.ts        # Firebase config
│   └── types/                 # TypeScript types
│       └── index.ts           # Type definitions
├── public/                    # Static assets
├── .env.example               # Environment variables example
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## 🎨 Pages

### Home Page (`/`)
- Hero section with call-to-action
- Statistics overview
- Feature highlights
- Popular tests showcase

### Login Page (`/login`)
- Phone OTP authentication
- Firebase integration
- User-friendly interface

### Tests Page (`/tests`)
- Browse all available tests
- Filter by category
- Test cards with details

### Test Detail Page (`/tests/[id]`)
- Test information and instructions
- Interactive quiz interface
- Real-time timer
- Question navigator
- Submit functionality

### Dashboard (`/dashboard`)
- User statistics
- Recent test results
- Quick action cards
- Created tests (if any)

### Analytics (`/analytics`)
- Overall performance metrics
- Category-wise statistics
- Test history table
- Performance trends

### Daily Quiz (`/daily-quiz`)
- 10 random questions
- Instant feedback
- Score tracking
- Explanations

### PYQs (`/pyqs`)
- Past year questions
- Filter by year and category
- Detailed solutions
- Tag-based organization

### Pricing (`/pricing`)
- Subscription plans
- Razorpay payment integration
- Feature comparison
- Premium benefits

## 🔧 Configuration

### API Integration

The frontend communicates with the backend API through axios. Configure the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Firebase Setup

1. Create a Firebase project
2. Enable Phone Authentication
3. Add your Firebase config to `.env.local`

### Razorpay Setup

1. Create a Razorpay account
2. Get your API key
3. Add to `.env.local`

## 🎯 Key Features Implementation

### Authentication Flow
1. User enters phone number
2. Firebase sends OTP
3. User verifies OTP
4. Backend creates/updates user
5. JWT token stored in localStorage

### Test Taking Flow
1. User selects a test
2. Reviews test details
3. Starts the test (timer begins)
4. Answers questions
5. Submits test
6. Results saved to analytics

### Payment Flow
1. User selects a plan
2. Razorpay order created
3. Payment gateway opens
4. User completes payment
5. Backend verifies payment
6. User subscription updated

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security

- JWT tokens stored in localStorage
- Protected routes with authentication checks
- Secure API communication
- Environment variables for sensitive data

## 🧪 Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Running Production Build
```bash
npm start
```

### Linting
```bash
npm run lint
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | Backend API URL | Yes |
| NEXT_PUBLIC_FIREBASE_API_KEY | Firebase API key | Yes |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Firebase auth domain | Yes |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Firebase project ID | Yes |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Razorpay key ID | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, email support@quizapp.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with all core features
