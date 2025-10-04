# 💻 MongoDB Local Installation (Windows)
# تثبيت MongoDB محلياً على جهازك

## 📥 التثبيت:

### 1. Download MongoDB
```
https://www.mongodb.com/try/download/community
```

اختر:
- Version: 7.0.x (Latest)
- Platform: Windows x64
- Package: MSI

### 2. Install
```
1. شغل ملف .msi المحمّل
2. اختر "Complete" installation
3. ✅ Install MongoDB as a Service
4. ✅ Install MongoDB Compass (GUI)
5. اضغط Install
⏳ انتظر التثبيت (2-3 دقائق)
```

### 3. Verify Installation
```bash
# افتح Command Prompt (كـ Administrator)
mongod --version
```

### 4. Start MongoDB Service
```bash
# Windows (كـ Administrator)
net start MongoDB
```

### 5. Update .env File
```bash
# افتح backend/.env
notepad backend\.env

# تأكد من السطر الأول:
MONGODB_URI=mongodb://localhost:27017/regs-global

# احفظ (Ctrl+S)
```

### 6. Restart Backend
```bash
# أوقف Backend (Ctrl+C)
# ثم شغله من جديد:
cd backend
npm run dev
```

### ✅ النتيجة:
```
✅ MongoDB Connected: localhost
```

---

## 🔧 Troubleshooting:

### خطأ: "net start MongoDB" fails
```bash
# حاول:
sc query MongoDB

# إذا لم يكن موجود، شغله يدوياً:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### إنشاء Data Directory
```bash
# إذا لم يكن موجود:
mkdir C:\data\db
```

---

## 📊 MongoDB Compass (GUI)

بعد التثبيت، افتح MongoDB Compass:
```
Connection String: mongodb://localhost:27017
اضغط "Connect"

✅ شوف databases
✅ شوف collections
✅ أضف/عدل data
```

---

**🎊 MongoDB installed locally! 🎊**

