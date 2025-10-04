# ☁️ MongoDB Atlas Setup (5 دقائق)
# الحل الأسرع والأسهل - مجاني 100%!

## 🚀 الخطوات:

### 1. التسجيل (الصفحة مفتوحة الآن)
```
✅ Sign up with Google (أسرع)
✅ أو Email + Password
```

### 2. Create Cluster
```
1. اضغط "Create" أو "Build a Database"
2. اختر "M0 FREE" (المجاني)
3. Provider: AWS
4. Region: Frankfurt أو Mumbai (الأقرب للمنطقة)
5. Cluster Name: Cluster0
6. اضغط "Create Cluster"
⏳ انتظر 3-5 دقائق
```

### 3. Create Database User
```
Username: regs_admin
Password: Regs2025
✅ بدون رموز خاصة
Database User Privileges: Atlas admin
اضغط "Create User"
```

### 4. Network Access
```
اضغط "Add IP Address"
اختر "Allow Access from Anywhere"
IP: 0.0.0.0/0
اضغط "Confirm"
```

### 5. Get Connection String
```
1. اضغط "Connect" على Cluster0
2. اختر "Connect your application"
3. Driver: Node.js (4.1+)
4. انسخ Connection String:

mongodb+srv://regs_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update .env File
```bash
# افتح backend/.env
notepad backend\.env

# استبدل السطر الأول:
MONGODB_URI=mongodb+srv://regs_admin:Regs2025@cluster0.xxxxx.mongodb.net/regs-global?retryWrites=true&w=majority

# احفظ (Ctrl+S)
```

### 7. Restart Backend
```bash
# أوقف Backend (Ctrl+C)
# ثم شغله من جديد:
cd backend
npm run dev
```

### ✅ النتيجة:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

## 💡 مثال Connection String الكامل:
```
mongodb+srv://regs_admin:Regs2025@cluster0.ab1cd.mongodb.net/regs-global?retryWrites=true&w=majority
```

**⚠️ استبدل:**
- `Regs2025` بكلمة مرورك
- `cluster0.ab1cd` بـ cluster URL الخاص بك

---

**🎉 Done in 5 minutes! 🎉**

