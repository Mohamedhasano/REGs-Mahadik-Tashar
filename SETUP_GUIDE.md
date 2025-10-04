# 🚀 Complete Setup Guide - REGs Global

This guide will walk you through setting up both the frontend and backend from scratch.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18 or higher installed ([Download](https://nodejs.org/))
- [ ] MongoDB 6.0 or higher installed ([Download](https://www.mongodb.com/try/download/community))
- [ ] Git installed (optional)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## ✅ Step-by-Step Installation

### Step 1: Verify Node.js Installation

```bash
node --version
# Should output v18.x.x or higher

npm --version
# Should output 9.x.x or higher
```

### Step 2: Verify MongoDB Installation

```bash
# Windows
mongod --version

# Linux/Mac
mongod --version
```

### Step 3: Start MongoDB

#### Windows
```cmd
# Method 1: As a service (already running)
net start MongoDB

# Method 2: Manual start
mongod --dbpath="C:\data\db"
```

#### Linux
```bash
# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

#### macOS
```bash
# Using Homebrew
brew services start mongodb-community
```

### Step 4: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
# Windows:
copy .env.example .env

# Linux/Mac:
cp .env.example .env
```

#### Edit `.env` file

Open `backend/.env` in your code editor and update:

```env
PORT=5000
NODE_ENV=development

# Database - Update if using different settings
MONGODB_URI=mongodb://localhost:27017/regs-global

# JWT Secret - Generate a random string
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
JWT_EXPIRE=7d

# CORS - Keep as is for local development
CORS_ORIGIN=http://localhost:3000
```

#### Generate a Strong JWT Secret

```bash
# Generate random secret (run in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and paste it as JWT_SECRET in .env
```

#### Start Backend Server

```bash
# Start in development mode (auto-reload on changes)
npm run dev

# You should see:
# ✅ MongoDB Connected: localhost
# 🚀 Server running on port 5000
# 📊 Environment: development
```

Keep this terminal window open. The backend is now running on `http://localhost:5000`

### Step 5: Setup Frontend

Open a **NEW terminal window** (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file
# Windows:
echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local

# Linux/Mac:
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

#### Start Frontend Server

```bash
# Start in development mode
npm run dev

# You should see:
# - Local:   http://localhost:3000
```

The frontend is now running on `http://localhost:3000`

### Step 6: Verify Everything Works

1. **Open browser** and go to: `http://localhost:3000`
2. **You should see** the REGs Global landing page with role cards
3. **Click "Login"** button
4. **Try registering** a new user

## 👥 Creating Test Users

### Method 1: Using the Frontend

1. Go to `http://localhost:3000/login`
2. Click "Register" link
3. Fill in the form with:
   - Email: `trader@test.com`
   - Password: `password123`
   - Name: `Test Trader`
   - Role: (selected by backend, defaults to `trader`)
4. Click "Register"

### Method 2: Using API Directly

You can use **Postman**, **Insomnia**, or **curl** to create users:

#### Create Trader
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trader@test.com",
    "password": "password123",
    "name": "Test Trader",
    "role": "trader"
  }'
```

#### Create Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "name": "Test Admin",
    "role": "admin"
  }'
```

#### Create Shariah Board Member
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "scholar@test.com",
    "password": "password123",
    "name": "Test Scholar",
    "role": "shariah_board"
  }'
```

#### Create Support Staff
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "support@test.com",
    "password": "password123",
    "name": "Test Support",
    "role": "support"
  }'
```

#### Create Project Owner
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "project@test.com",
    "password": "password123",
    "name": "Test Project Owner",
    "role": "project"
  }'
```

## 🧪 Testing the Application

### 1. Test Trader Role

1. Login with: `trader@test.com` / `password123`
2. You'll be redirected to `/trader`
3. See portfolio, zakat calculator, and transactions

### 2. Test Admin Role

1. Login with: `admin@test.com` / `password123`
2. You'll be redirected to `/admin`
3. See user management, asset management, and stats

### 3. Test Shariah Board Role

1. Login with: `scholar@test.com` / `password123`
2. You'll be redirected to `/shariah-board`
3. See pending assets and projects for review

### 4. Test Support Role

1. Login with: `support@test.com` / `password123`
2. You'll be redirected to `/support`
3. See support tickets and forum posts

### 5. Test Project Role

1. Login with: `project@test.com` / `password123`
2. You'll be redirected to `/projects`
3. See project creation and submission

## 🛠️ Common Issues & Solutions

### Issue: "MongoDB connection error"

**Solution:**
```bash
# Make sure MongoDB is running
# Windows:
net start MongoDB

# Linux:
sudo systemctl start mongod

# Mac:
brew services start mongodb-community
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Option 1: Kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Option 2: Change port in backend/.env
PORT=5001
# Also update frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
npx kill-port 3000

# Or use different port:
PORT=3001 npm run dev
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot connect to backend API"

**Solution:**
1. Check backend is running on port 5000
2. Check `.env.local` in frontend has correct API URL
3. Check CORS settings in backend
4. Open browser console to see exact error

### Issue: "JWT token invalid"

**Solution:**
1. Logout and login again
2. Clear browser localStorage:
   - Open DevTools (F12)
   - Go to Application → Local Storage
   - Delete all items
3. Refresh page

## 📊 Viewing Database

### Method 1: MongoDB Compass (GUI)

1. Download MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Browse `regs-global` database
4. View collections: users, assets, transactions, projects

### Method 2: MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to database
use regs-global

# View all users
db.users.find().pretty()

# View all assets
db.assets.find().pretty()

# Count users
db.users.countDocuments()
```

## 🔄 Restarting Everything

If something goes wrong, restart everything:

```bash
# 1. Stop both frontend and backend (Ctrl+C in terminals)

# 2. Restart MongoDB
# Windows:
net stop MongoDB
net start MongoDB

# Linux:
sudo systemctl restart mongod

# 3. Start backend
cd backend
npm run dev

# 4. Start frontend (in new terminal)
cd frontend
npm run dev
```

## 📝 Development Workflow

### Making Changes

1. **Backend changes**: Server auto-reloads (nodemon)
2. **Frontend changes**: Page auto-reloads (Next.js fast refresh)
3. **Environment changes**: Restart servers

### Adding Sample Data

You can add sample assets, transactions etc via the API or MongoDB directly.

Example: Add a sample asset via MongoDB shell:

```javascript
// Connect to MongoDB
mongosh

use regs-global

// Add Bitcoin asset
db.assets.insertOne({
  symbol: "BTC",
  name: "Bitcoin",
  type: "crypto",
  complianceStatus: "approved",
  isActive: true,
  price: 45000,
  description: "The first cryptocurrency"
})
```

## 🎯 Next Steps

Now that everything is running:

1. ✅ Explore each user role dashboard
2. ✅ Try creating transactions as a trader
3. ✅ Test admin panel features
4. ✅ Submit assets for Shariah review
5. ✅ Create and submit projects

## 📚 Additional Resources

- Main README: `README.md`
- Frontend README: `frontend/README.md`
- Backend README: `backend/README.md`
- API Documentation: See backend README

## 🆘 Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review this guide's "Common Issues" section
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify all prerequisites are installed correctly

---

Happy Coding! 🚀

