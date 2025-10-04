# 🚀 Quick Start - REGs Global

## ✅ multer Installed Successfully!

---

## Option 1: Start Backend (Easy Way)

### في Terminal الخاص بالـ Backend:

```bash
cd backend
start-backend.bat
```

أو ببساطة:
```bash
npm run dev
```

---

## Option 2: Manual Start

### Terminal 1 - Backend:
```bash
cd "C:\Users\Lenovo\Downloads\REGs Global\backend"
npm run dev
```

**يجب أن ترى:**
```
🚀 Server running on port 5000
📊 Environment: development
```

### Terminal 2 - Frontend:
```bash
cd "C:\Users\Lenovo\Downloads\REGs Global"
npm run dev
```

**يجب أن ترى:**
```
VITE v5.4.19 ready
➜ Local: http://localhost:5173/
```

---

## ✅ Test KYC System

### 1. Register
- Go to: http://localhost:5173/signup
- Create account

### 2. Login
- Go to: http://localhost:5173/login
- Login with your account

### 3. Complete KYC
- Go to: http://localhost:5173/kyc-verification
- Complete all 3 levels:
  - **Level 1**: Personal information
  - **Level 2**: Upload documents
  - **Level 3**: Video verification

### 4. Check Profile
- Go to: http://localhost:5173/profile
- See your real data and KYC status

---

## 🚫 البيانات محفوظة للأبد!

All KYC data is permanently saved:
- ✅ Level 1 data → MongoDB
- ✅ Level 2 files → `/backend/uploads/kyc/`
- ✅ Level 3 results → MongoDB
- ✅ Never deleted!

---

## 🎉 Ready to Go!

Your backend is now ready with:
- ✅ multer installed
- ✅ KYC API endpoints
- ✅ File upload configured
- ✅ Database models extended

Start both servers and test the system!

