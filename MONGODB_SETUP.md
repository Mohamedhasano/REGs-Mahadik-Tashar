# 🔧 MongoDB Setup Guide - حل مشكلة الاتصال

## ❌ المشكلة
```
MongoDB connection error: MongooseServerSelectionError: connect ECONNREFUSED
```

**السبب:** MongoDB غير مثبت على جهازك

---

## ✅ الحل: 3 خيارات

### Option 1: MongoDB Atlas (الأسرع - مجاني) ⭐ الموصى به

#### 1. إنشاء حساب مجاني
```
https://www.mongodb.com/cloud/atlas/register
```

#### 2. إنشاء Cluster مجاني
- اختر "Free Shared" (M0)
- اختر AWS أو Google Cloud
- اختر أقرب Region لك

#### 3. إنشاء Database User
```
Username: regs_admin
Password: [اختر كلمة مرور قوية]
```

#### 4. Whitelist IP Address
- اذهب إلى "Network Access"
- اضغط "Add IP Address"
- اختر "Allow Access from Anywhere" (0.0.0.0/0)

#### 5. احصل على Connection String
```
mongodb+srv://regs_admin:<password>@cluster0.xxxxx.mongodb.net/regs-global?retryWrites=true&w=majority
```

#### 6. أضفه إلى `.env`
```bash
cd backend
echo MONGODB_URI=mongodb+srv://regs_admin:<password>@cluster0.xxxxx.mongodb.net/regs-global?retryWrites=true&w=majority > .env
```
**استبدل `<password>` بكلمة المرور الخاصة بك!**

---

### Option 2: تثبيت MongoDB محلياً (Windows)

#### خطوة 1: تنزيل MongoDB
```
https://www.mongodb.com/try/download/community
```
- اختر Windows
- اختر MSI Installer
- حمل الملف

#### خطوة 2: التثبيت
```bash
# شغل الملف المحمل
mongodb-windows-x86_64-X.X.X-signed.msi

# اختر "Complete Installation"
# اختار "Install MongoDB as a Service"
```

#### خطوة 3: تشغيل الخدمة
```cmd
# كـ Administrator
net start MongoDB
```

#### خطوة 4: تأكد من التشغيل
```cmd
mongosh
# إذا فتحت shell، يعني MongoDB شغال!
```

---

### Option 3: الاستمرار بدون Database (مؤقت)

البرنامج الآن معدّل ليعمل بدون MongoDB:
```bash
cd backend
npm run dev
```

**ملاحظة:** بعض المميزات لن تعمل:
- ❌ التسجيل والدخول
- ❌ حفظ البيانات
- ✅ مشاهدة الواجهة
- ✅ التصفح بين الصفحات

---

## 🧪 اختبار الاتصال

### بعد تطبيق أي حل، اختبر:

```bash
cd backend
npm run dev
```

**النتيجة المتوقعة:**
```
🚀 Server running on port 5000
📊 Environment: development
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

## 🚀 الخطوة التالية

بعد حل مشكلة MongoDB:

### 1. شغل Backend
```bash
cd backend
npm run dev
```

### 2. شغل Frontend
```bash
# في terminal ثاني، من الجذر
npm run dev
```

### 3. افتح المتصفح
```
http://localhost:5173
```

---

## 💡 نصائح

### لـ MongoDB Atlas:
- ✅ مجاني تماماً (512 MB)
- ✅ لا حاجة للتثبيت
- ✅ يعمل من أي جهاز
- ✅ Backup تلقائي

### لـ MongoDB المحلي:
- ✅ أسرع في التطوير
- ✅ يعمل offline
- ❌ يحتاج تثبيت
- ❌ يستهلك RAM

---

## 🐛 مشاكل شائعة

### "MongoDB service won't start"
```cmd
# Windows - كـ Administrator
sc delete MongoDB
# ثم أعد التثبيت
```

### "Connection timeout"
```bash
# تحقق من .env
cd backend
type .env

# تأكد من MONGODB_URI موجود
```

### "Authentication failed"
```
# في Atlas:
1. تحقق من كلمة المرور
2. تحقق من IP Whitelist
3. تحقق من Database User Permissions
```

---

## 📞 الدعم

إذا واجهتك مشكلة:
1. تحقق من الـ console للأخطاء
2. تحقق من ملف `.env`
3. جرب MongoDB Atlas (الأسهل!)

---

**Built with ❤️ for the Muslim Ummah**

