# 🚀 Start REGs Global Project

## Quick Start Guide - دليل البداية السريعة

---

## ✅ Current Status - الحالة الحالية

### Backend Status
```
✅ multer installed successfully
✅ KYC API endpoints created
✅ File upload configured
✅ Database models extended
✅ Ready to run!
```

### Frontend Status
```
✅ KYC page with full API integration
✅ Profile page with real user data
✅ Verifications page
✅ Role-based dashboards
✅ Referral system
✅ Ready to run!
```

---

## 🎯 Step-by-Step Instructions

### 1. Start Backend (Terminal 1)

```bash
cd "C:\Users\Lenovo\Downloads\REGs Global\backend"
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📊 Environment: development
✅ MongoDB Connected: localhost
```

**API Endpoints Available:**
- `http://localhost:5000/api/auth/register` - Register
- `http://localhost:5000/api/auth/login` - Login
- `http://localhost:5000/api/kyc/status` - Get KYC status
- `http://localhost:5000/api/kyc/level1` - Submit Level 1
- `http://localhost:5000/api/kyc/level2` - Submit Level 2
- `http://localhost:5000/api/kyc/level3` - Submit Level 3

---

### 2. Start Frontend (Terminal 2)

```bash
cd "C:\Users\Lenovo\Downloads\REGs Global"
npm run dev
```

**Expected Output:**
```
VITE v5.4.19 ready in 330 ms
➜ Local: http://localhost:5173/
```

---

### 3. Test the Application

#### A. Register a New User

1. Open browser: `http://localhost:5173/signup`
2. Fill the form:
   - **Full Name**: Ahmed Hassan
   - **Email**: ahmed@example.com
   - **Password**: password123
   - **Referral Code**: (optional)
3. Click **Create Account**
4. You should see: "Account created successfully!"

#### B. Login

1. Navigate to: `http://localhost:5173/login`
2. Enter credentials:
   - **Email**: ahmed@example.com
   - **Password**: password123
3. Click **Login**
4. You will be redirected to your dashboard

#### C. Complete KYC Verification

1. Navigate to: `http://localhost:5173/kyc-verification`
2. **Level 1: Personal Information**
   - First Name: Ahmed
   - Last Name: Hassan
   - Date of Birth: 01-01-1990
   - Citizenship: Egypt
   - Residence: Egypt
   - Click **Submit Level 1**
   - ✅ Data saved permanently in database!

3. **Level 2: Document Upload**
   - Upload ID Card (jpg/png/pdf, max 10MB)
   - Upload Passport (optional)
   - Upload Driver License (optional)
   - Click **Submit Level 2**
   - ✅ Files saved permanently in `/backend/uploads/kyc/`

4. **Level 3: Video Verification**
   - Click **Start Face Verification**
   - Wait for AI verification (simulated)
   - ✅ Results saved permanently!

5. **Completion**
   - You will see: "All KYC levels completed!"
   - Status: "Your KYC is now under review"
   - ✅ All data is in MongoDB database forever!

#### D. View Profile

1. Navigate to: `http://localhost:5173/profile`
2. You will see:
   - ✅ Real name (Ahmed Hassan)
   - ✅ Real email
   - ✅ Real User ID
   - ✅ KYC Progress (Level 1, 2, or 3)
   - ✅ Referral code (if you have one)
   - ✅ Referral earnings (if you referred someone)

---

## 📊 Database - Check Your Data

### MongoDB Compass (if installed)

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Database: `regs-global`
4. Collection: `users`
5. Find your user:

```json
{
  "_id": "...",
  "email": "ahmed@example.com",
  "name": "Ahmed Hassan",
  "kycLevel": 3,
  "kycStatus": "under_review",
  "kycLevel1": {
    "firstName": "Ahmed",
    "lastName": "Hassan",
    "dateOfBirth": "1990-01-01",
    "citizenshipCountry": "Egypt",
    "residenceCountry": "Egypt",
    "completedAt": "2025-10-03T..."
  },
  "kycLevel2": {
    "idCard": {
      "fileName": "id-card.jpg",
      "fileUrl": "/uploads/kyc/idCard-...",
      "uploadedAt": "2025-10-03T..."
    }
  },
  "kycLevel3": {
    "videoVerified": true,
    "aiConfidenceScore": 97.8,
    "livenessCheckPassed": true,
    "completedAt": "2025-10-03T..."
  }
}
```

**✅ All data is here - NEVER deleted!**

---

## 🎯 Important URLs

### Frontend
- **Home**: http://localhost:5173/
- **Signup**: http://localhost:5173/signup
- **Login**: http://localhost:5173/login
- **Profile**: http://localhost:5173/profile
- **KYC Verification**: http://localhost:5173/kyc-verification
- **Verifications**: http://localhost:5173/verifications
- **Markets**: http://localhost:5173/markets
- **Earn**: http://localhost:5173/earn

### Backend
- **Health Check**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api

---

## 🔧 Troubleshooting

### Backend won't start?

**Issue**: `Cannot find module 'multer'`

**Solution**:
```bash
cd backend
npm install
npm run dev
```

---

### MongoDB not connected?

**Issue**: `MongoDB connection error: ECONNREFUSED`

**Solution 1** - Use MongoDB Atlas (Recommended):
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create cluster
4. Get connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/regs-global
   ```

**Solution 2** - Install MongoDB locally:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service
4. Backend will connect automatically

---

### Frontend shows errors?

**Issue**: Dependencies not resolved

**Solution**:
```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
REGs Global/
├── backend/              # Backend API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── kyc.controller.ts  ← KYC API
│   │   ├── models/
│   │   │   └── User.model.ts      ← Extended with KYC
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── kyc.routes.ts      ← KYC routes
│   │   └── server.ts
│   ├── uploads/
│   │   └── kyc/                   ← Uploaded documents
│   └── package.json
│
├── src/                  # Frontend
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Profile.tsx            ← Real user data
│   │   ├── KYCVerification.tsx    ← Full API integration
│   │   └── Verifications.tsx
│   ├── store/
│   │   └── authStore.ts           ← User authentication
│   └── lib/
│       └── api.ts                 ← Axios instance
│
└── Documentation/
    ├── KYC_BACKEND_INTEGRATION.md    ← Complete KYC guide
    ├── PROFILE_PAGE_REAL_DATA.md     ← Profile guide
    ├── VERIFICATIONS_PAGE.md         ← Verifications guide
    └── START_PROJECT.md              ← This file
```

---

## ✅ What You Have Now

### 1. Complete KYC System
- ✅ 3 levels of verification
- ✅ Backend API integration
- ✅ File upload (documents)
- ✅ Database storage (permanent)
- ✅ Admin approval/rejection

### 2. Real User Data
- ✅ Profile page with real data
- ✅ No fake/dummy data
- ✅ Dynamic content
- ✅ Real-time updates

### 3. Verifications Page
- ✅ KYC status display
- ✅ Security settings
- ✅ Contact information
- ✅ Social media links

### 4. Authentication System
- ✅ Registration with referral code
- ✅ Login with role-based redirect
- ✅ JWT authentication
- ✅ Password reset (OAuth ready)

### 5. Premium Design
- ✅ Circular logo with glow
- ✅ Ultra-premium UI
- ✅ Responsive design
- ✅ Dark/Light theme

---

## 🚫 Data Persistence

### البيانات محفوظة للأبد - ممنوع الحذف!

```typescript
ALL KYC data is PERMANENTLY saved in MongoDB:
✅ Level 1: Personal information
✅ Level 2: Uploaded documents (files)
✅ Level 3: Video verification results
✅ Timestamps: Submitted, approved, rejected
✅ Status tracking: pending → under_review → approved/rejected

❌ NEVER deleted!
❌ NEVER lost!
✅ ALWAYS accessible!
✅ ALWAYS in database!
```

---

## 📖 Additional Documentation

For detailed information, check these files:

1. **KYC_BACKEND_INTEGRATION.md** - Complete KYC system guide
2. **PROFILE_PAGE_REAL_DATA.md** - Profile page documentation
3. **VERIFICATIONS_PAGE.md** - Verifications page guide
4. **REFERRAL_SYSTEM.md** - Referral system documentation
5. **BRANDING_GUIDE.md** - Logo and branding guidelines

---

## 🎉 You're Ready!

Everything is set up and ready to go:

1. ✅ Backend API with KYC endpoints
2. ✅ Frontend with full integration
3. ✅ Database models extended
4. ✅ File upload configured
5. ✅ Real user data (no fake data)
6. ✅ Premium design
7. ✅ Data permanently saved

**Start both servers and test the complete flow!**

---

**Last Updated**: October 3, 2025  
**Status**: ✅ READY TO USE  
**Data Persistence**: ✅ PERMANENT (محفوظ للأبد)

