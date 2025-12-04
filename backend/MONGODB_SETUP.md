# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `quizapp`
   - Password: Generate a secure password
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `quiz-app`

6. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://quizapp:<password>@cluster0.xxxxx.mongodb.net/quiz-app?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB

1. **Install MongoDB**
   - macOS: `brew install mongodb-community`
   - Ubuntu: `sudo apt-get install mongodb`
   - Windows: Download from https://www.mongodb.com/try/download/community

2. **Start MongoDB**
   - macOS/Linux: `brew services start mongodb-community` or `sudo systemctl start mongod`
   - Windows: MongoDB runs as a service automatically

3. **Use in .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/quiz-app
   ```

## Quick Test Connection

After setup, run:
```bash
cd backend
npm run dev
```

You should see: `MongoDB Connected: cluster0.xxxxx.mongodb.net` or `localhost`
