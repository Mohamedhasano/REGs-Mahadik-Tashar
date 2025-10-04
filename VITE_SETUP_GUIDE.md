# 🚀 REGs Global Vite React - Setup Guide

## ✅ تم إصلاح مشكلة التسجيل (Registration Fixed)

### المشاكل التي تم حلها:
1. ❌ لم يكن هناك ملف API connection
2. ❌ لم يكن هناك Auth Store
3. ❌ صفحة Signup غير متصلة بالـ Backend
4. ❌ نظام Referral Code غير موجود

### الحلول المطبقة:
1. ✅ إنشاء `src/lib/api.ts` - Axios config مع interceptors
2. ✅ إنشاء `src/store/authStore.ts` - Zustand state management
3. ✅ تحديث `src/pages/Signup.tsx` - إضافة Referral Code و API integration
4. ✅ تحديث `src/pages/Login.tsx` - ربط كامل مع Backend

---

## 📁 الملفات الجديدة

### 1. `src/lib/api.ts` - API Configuration

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-add token to requests
// Auto-redirect on 401 Unauthorized
```

**البيئة:**
- Dev: `VITE_API_URL=http://localhost:5000/api`
- Prod: `VITE_API_URL=https://your-api.com/api`

---

### 2. `src/store/authStore.ts` - Authentication State

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}
```

**الاستخدام:**
```tsx
const { user, isAuthenticated, setAuth, logout } = useAuthStore();
```

---

### 3. `src/pages/Signup.tsx` - التسجيل المُحدث

#### المميزات الجديدة:

##### ✅ Referral Code System
- قراءة تلقائية من URL: `/signup?ref=CODE123`
- حقل اختياري مع أيقونة Gift
- تحويل تلقائي إلى UPPERCASE
- بانر ترحيبي عند وجود كود
- رسالة تأكيد المكافأة

##### ✅ Form Validation
- التحقق من جميع الحقول المطلوبة
- تطابق كلمات المرور
- طول كلمة المرور (8+ أحرف)
- البريد الإلكتروني الصحيح
- الموافقة على الشروط

##### ✅ API Integration
```typescript
const response = await api.post('/auth/register', {
  name,
  email,
  password,
  role: 'trader',
  referralCode: referralCode || undefined,
});

const { user, token, message } = response.data;
setAuth(user, token);
toast.success(message);
navigate('/');
```

##### ✅ Loading States
- زر معطل أثناء التحميل
- Spinner animation
- رسائل خطأ واضحة

---

### 4. `src/pages/Login.tsx` - تسجيل الدخول المُحدث

#### المميزات:
- ✅ API integration كامل
- ✅ Auth state management
- ✅ Role-based redirect
- ✅ Error handling
- ✅ Loading states
- ✅ Social login buttons (قريباً)

---

## 🔧 Environment Setup

### إنشاء ملف `.env`

```bash
# في جذر المشروع
VITE_API_URL=http://localhost:5000/api
```

**ملاحظة:** Vite يستخدم `VITE_` prefix بدلاً من `NEXT_PUBLIC_`

---

## 🚀 تشغيل المشروع

### 1. Frontend (Vite React)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**يعمل على:** `http://localhost:5173`

---

### 2. Backend (Node.js)

```bash
cd backend

# Install dependencies
npm install

# Setup MongoDB connection in .env
echo "MONGODB_URI=mongodb://localhost:27017/regs-global" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
echo "PORT=5000" >> .env

# Run development server
npm run dev
```

**يعمل على:** `http://localhost:5000`

---

## 📊 تدفق التسجيل (Registration Flow)

```
1. المستخدم يفتح: /signup?ref=AHMED123
   ↓
2. الفورم يحمل مع الكود مسبقاً
   ↓
3. بانر ترحيبي يظهر: "🎁 Referral Bonus Activated!"
   ↓
4. المستخدم يملأ البيانات:
   - Full Name
   - Email
   - Password
   - Confirm Password
   - Referral Code (اختياري)
   ↓
5. الضغط على "Create Account"
   ↓
6. Frontend يرسل POST /api/auth/register:
   {
     name: "...",
     email: "...",
     password: "...",
     referralCode: "AHMED123"
   }
   ↓
7. Backend يتحقق من:
   - صحة البيانات
   - عدم وجود البريد مسبقاً
   - صحة كود الإحالة
   ↓
8. Backend ينشئ المستخدم:
   - يولد referralCode جديد (8 أحرف)
   - يربطه بالمُحيل (referredBy)
   - يحدث إحصائيات المُحيل
   ↓
9. Backend يرجع:
   {
     user: {...},
     token: "jwt...",
     message: "Referral bonus will be applied on first trade"
   }
   ↓
10. Frontend:
    - يحفظ User & Token في Zustand
    - يحفظ Token في localStorage
    - يعرض toast.success
    - يعيد التوجيه إلى "/"
```

---

## 🎁 نظام Referral Code

### Backend API

#### 1. Register with Referral
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Mohammed Ali",
  "email": "mohammed@example.com",
  "password": "secure123",
  "referralCode": "AHMED123"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "mohammed@example.com",
    "name": "Mohammed Ali",
    "referralCode": "MOHA5678",
    "referredBy": {
      "name": "Ahmed Hassan",
      "referralCode": "AHMED123"
    }
  },
  "token": "jwt_token...",
  "message": "Account created! Referral bonus will be applied on first trade."
}
```

#### 2. Get Referral Stats
```http
GET /api/auth/referral-stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "referralCode": "AHMED123",
  "referralCount": 15,
  "referralEarnings": 150.00,
  "referrals": [...],
  "referralLink": "http://localhost:5173/signup?ref=AHMED123"
}
```

---

## 🐛 استكشاف الأخطاء (Troubleshooting)

### المشكلة: "Registration failed"

**الأسباب المحتملة:**

1. **Backend غير شغال**
   ```bash
   cd backend
   npm run dev
   ```

2. **MongoDB غير متصل**
   - تأكد من تشغيل MongoDB
   - تحقق من `MONGODB_URI` في `.env`

3. **CORS Error**
   في `backend/src/server.ts`:
   ```typescript
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));
   ```

4. **Environment Variables خاطئة**
   ```bash
   # Frontend
   VITE_API_URL=http://localhost:5000/api
   
   # Backend
   MONGODB_URI=mongodb://localhost:27017/regs-global
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

---

### المشكلة: "Invalid referral code"

**الحلول:**

1. تأكد أن الكود موجود في قاعدة البيانات
2. الكود حساس لحالة الأحرف (uppercase)
3. تحقق من أن المستخدم المُحيل موجود

```typescript
// Backend validation
const referredByUser = await User.findOne({ 
  referralCode: referralCode.toUpperCase() 
});

if (!referredByUser) {
  return res.status(400).json({ 
    message: 'Invalid referral code' 
  });
}
```

---

### المشكلة: "Network Error"

**الحلول:**

1. تأكد من تشغيل Backend على `http://localhost:5000`
2. تحقق من `VITE_API_URL` في `.env`
3. تأكد من عدم وجود Firewall blocking

```bash
# Test Backend
curl http://localhost:5000/api/health

# Test from Frontend
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 📝 Testing Checklist

### Frontend
- [ ] صفحة Signup تفتح بدون أخطاء
- [ ] حقل Referral Code يظهر
- [ ] الفورم يقبل إدخال البيانات
- [ ] validation يعمل بشكل صحيح
- [ ] رسائل الخطأ تظهر
- [ ] Loading state يعمل

### Backend
- [ ] `POST /api/auth/register` يعمل
- [ ] Referral code validation يعمل
- [ ] User creation successful
- [ ] Token generation صحيح
- [ ] Referrer stats updated

### Integration
- [ ] Frontend يتصل بـ Backend
- [ ] Registration كامل ينجح
- [ ] Auth state يتحدث
- [ ] Redirect يعمل بعد التسجيل
- [ ] Toast notifications تظهر

---

## 🎯 Next Steps

### 1. إضافة صفحة Referral Dashboard
- عرض referral link الخاص
- قائمة الإحالات
- إحصائيات الأرباح
- أزرار المشاركة

### 2. Email Verification
- إرسال email تأكيد
- verify email endpoint
- resend verification

### 3. OAuth Integration
- Google login
- Apple login
- Microsoft login

### 4. Password Reset
- Forgot password page
- Email with reset link
- Reset password page

---

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من Console للأخطاء
2. راجع Network tab في DevTools
3. تأكد من تشغيل Backend
4. تحقق من Environment Variables

---

**النظام الآن يعمل بشكل كامل! ✅**

Built with ❤️ for the Muslim Ummah

