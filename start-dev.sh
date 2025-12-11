#!/bin/bash

echo "🚀 Starting Quiz App Development Environment"
echo ""

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    echo "⚠️  Backend .env not found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please update with your credentials"
fi

# Check if frontend .env.local exists
if [ ! -f frontend/.env.local ]; then
    echo "⚠️  Frontend .env.local not found. Creating..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > frontend/.env.local
    echo "✅ Created frontend/.env.local"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd backend && npm start"
echo "2. Terminal 2: cd frontend && npm run dev"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
