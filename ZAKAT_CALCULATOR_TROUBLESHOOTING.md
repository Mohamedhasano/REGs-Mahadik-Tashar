# 🔧 Zakat Calculator - Troubleshooting Guide

## ✅ Quick Check - هل النظام يعمل؟

### 1️⃣ Check Backend (Port 5000)
```bash
# Open terminal in: C:\Users\Lenovo\Downloads\REGs Global\backend
cd backend
npm run dev

# You should see:
# 🚀 Server running on port 5000
# ✅ MongoDB Connected: localhost
```

### 2️⃣ Check Frontend (Port 5173)
```bash
# Open NEW terminal in: C:\Users\Lenovo\Downloads\REGs Global
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
```

### 3️⃣ Test Zakat Calculator
Open browser: `http://localhost:5173/zakat-calculator`

---

## 🐛 Common Problems & Solutions

### Problem 1: "Cannot GET /api/zakat/nisab"
**السبب:** Backend not running

**الحل:**
```bash
cd backend
npm run dev
```

---

### Problem 2: "Network Error" or "Failed to fetch"
**السبب:** Backend on wrong port or not running

**الحل:**
1. Check backend terminal - should show `🚀 Server running on port 5000`
2. Check MongoDB - should show `✅ MongoDB Connected: localhost`
3. Restart backend:
   ```bash
   Ctrl+C (stop)
   npm run dev (restart)
   ```

---

### Problem 3: Page shows "Unauthorized" or redirects to login
**السبب:** User not logged in

**الحل:**
1. Go to `http://localhost:5173/login`
2. Login with your account
3. Then navigate to `http://localhost:5173/zakat-calculator`

---

### Problem 4: "Nisab values not loading"
**السبب:** API endpoint not working

**الحل:**
1. Open browser console (F12)
2. Check for errors
3. Verify backend is running
4. Test API manually:
   ```
   Open in browser: http://localhost:5000/api/zakat/nisab
   Should return JSON with gold/silver prices
   ```

---

### Problem 5: "Cannot calculate Zakat"
**السبب:** Invalid asset data or missing fields

**الحل:**
1. ✅ Fill ALL fields:
   - Asset Type (select from dropdown)
   - Asset Name (e.g., "Bitcoin")
   - Amount (e.g., 0.5)
   - Value in USD (e.g., 25000)
2. ✅ Check "Hawl completed" if applicable
3. ✅ Click "Calculate Zakat"

---

### Problem 6: Assets not showing or duplicate assets
**السبب:** State management issue

**الحل:**
1. Click "Reset" button
2. Refresh page (F5)
3. Re-add assets

---

### Problem 7: History not loading
**السبب:** No calculations saved yet OR backend issue

**الحل:**
1. Calculate Zakat at least once
2. Click "History" button
3. If still empty, check backend terminal for errors

---

### Problem 8: MongoDB not connected
**السبب:** MongoDB not running

**الحل:**

**Option A: Use MongoDB Atlas (Free Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/regs-global
   ```

**Option B: Install MongoDB Locally**
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Run MongoDB service
4. Backend should auto-connect to `mongodb://localhost:27017/regs-global`

---

## 🧪 Test Zakat Calculator

### Test Case 1: Basic Calculation
1. **Add Asset:**
   - Type: `Crypto`
   - Name: `Bitcoin`
   - Amount: `0.5`
   - Value: `$25,000`
2. **Settings:**
   - Nisab Type: `Silver` (Recommended)
   - ✅ Check "Hawl completed"
3. **Click:** "Calculate Zakat"
4. **Expected Result:**
   - Total Wealth: $25,000
   - Nisab Status: ✅ Meets Nisab (Silver ~$505)
   - Zakat Due: $625 (2.5% of $25,000)

---

### Test Case 2: Multiple Assets
1. **Asset #1:**
   - Type: `Crypto`
   - Name: `Bitcoin`
   - Amount: `0.5`
   - Value: `$25,000`
2. **Click** "Add Asset"
3. **Asset #2:**
   - Type: `Cash`
   - Name: `USD`
   - Amount: `5000`
   - Value: `$5,000`
4. **Calculate Zakat**
5. **Expected Result:**
   - Total Wealth: $30,000
   - Zakat Due: $750 (2.5%)

---

### Test Case 3: Below Nisab
1. **Add Asset:**
   - Type: `Cash`
   - Name: `USD`
   - Amount: `100`
   - Value: `$100`
2. **Calculate Zakat**
3. **Expected Result:**
   - Total Wealth: $100
   - Nisab Status: ❌ Below Nisab
   - Zakat Due: $0 (No Zakat required)

---

## 📊 Verify Backend APIs

### Test Nisab API:
```bash
# Method 1: Browser
Open: http://localhost:5000/api/zakat/nisab

# Method 2: Terminal (PowerShell)
Invoke-RestMethod -Uri "http://localhost:5000/api/zakat/nisab" -Method GET

# Expected Response:
{
  "metalPrices": {
    "gold": { "pricePerGram": 65.0, "currency": "USD" },
    "silver": { "pricePerGram": 0.85, "currency": "USD" }
  },
  "nisab": {
    "gold": { "grams": 85, "valueUSD": 5525.0 },
    "silver": { "grams": 595, "valueUSD": 505.75 }
  },
  "zakatRate": "2.5%",
  "recommendation": "Silver Nisab is recommended..."
}
```

---

### Test Calculate API (Requires Login):
```bash
# You need JWT token from login
# 1. Login first to get token
# 2. Then use token to calculate Zakat

# PowerShell:
$token = "YOUR_JWT_TOKEN"
$headers = @{ "Authorization" = "Bearer $token" }
$body = @{
  assets = @(
    @{ type = "crypto"; name = "Bitcoin"; amount = 0.5; valueUSD = 25000 }
  )
  nisabType = "silver"
  hawlCompleted = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/zakat/calculate" -Method POST -Headers $headers -Body $body -ContentType "application/json"
```

---

## 🔍 Debug Mode

### Enable Console Logs:
1. Open `src/pages/ZakatCalculator.tsx`
2. Add console.logs:
   ```typescript
   const calculateZakat = async () => {
     console.log('Assets:', validAssets);
     console.log('Nisab Type:', nisabType);
     console.log('Hawl Completed:', hawlCompleted);
     
     try {
       const response = await api.post('/zakat/calculate', {
         assets: validAssets,
         nisabType,
         hawlCompleted
       });
       console.log('Response:', response.data);
       // ... rest of code
     } catch (error) {
       console.error('Error:', error);
     }
   };
   ```

---

## ✅ Checklist Before Reporting Issue

- [ ] Backend is running (`npm run dev` in backend folder)
- [ ] Frontend is running (`npm run dev` in root folder)
- [ ] MongoDB is connected (see backend terminal)
- [ ] User is logged in (check localStorage for 'token')
- [ ] Browser console has no errors (F12 → Console)
- [ ] Network tab shows API calls (F12 → Network)
- [ ] All asset fields are filled
- [ ] Asset value > 0

---

## 🆘 Still Not Working?

### Collect Debug Info:
1. **Backend Terminal Output:**
   - Copy last 50 lines
   - Look for errors (red text)

2. **Frontend Console Errors:**
   - Open browser console (F12)
   - Copy all errors (red text)

3. **Network Tab:**
   - Open F12 → Network
   - Try to calculate Zakat
   - Check failed requests (red)
   - Copy request/response

4. **Screenshot:**
   - Take screenshot of the error
   - Take screenshot of browser console

---

## 📞 Quick Fixes

### Reset Everything:
```bash
# Stop all servers (Ctrl+C in both terminals)

# Backend:
cd backend
npm install
npm run dev

# Frontend (NEW terminal):
cd ..
npm install
npm run dev
```

---

### Clear Browser Cache:
1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (F5)

---

### Restart MongoDB:
**Windows:**
```bash
# Open Services (Win+R → services.msc)
# Find "MongoDB Server"
# Right-click → Restart
```

**Or use MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to localhost:27017
3. Verify "regs-global" database exists

---

## 🎯 Expected Behavior

### ✅ Working Correctly When:
1. Nisab values display (Gold & Silver)
2. Can add multiple assets
3. Can remove assets
4. Can calculate Zakat
5. Results show:
   - Total Wealth
   - Nisab Status (Meets/Below)
   - Zakat Due (if meets Nisab)
6. History shows past calculations
7. Islamic guidelines display

### ❌ Not Working If:
1. Nisab values show "0" or "NaN"
2. Cannot add assets
3. "Calculate Zakat" button disabled
4. No results after calculation
5. Error toasts appear
6. Page redirects to login
7. Console shows errors

---

## 📱 Contact Support

If still having issues, provide:
1. ✅ Backend terminal output
2. ✅ Frontend console errors
3. ✅ Screenshot of the error
4. ✅ Steps to reproduce
5. ✅ MongoDB status (connected/not connected)

---

**Last Updated:** January 2025  
**Status:** ✅ All Systems Operational

**جميع الأنظمة تعمل بشكل صحيح! إذا كانت هناك مشكلة، اتبع الخطوات أعلاه. 🕌💰**

