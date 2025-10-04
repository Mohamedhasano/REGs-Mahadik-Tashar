# 🕌 Zakat Calculator - Quick Start Guide

## ✅ النظام جاهز تماماً! System is 100% Ready!

---

## 🚀 Quick Test (5 Minutes)

### Step 1: Open Zakat Calculator
```
http://localhost:5173/zakat-calculator
```

### Step 2: Login (if needed)
- If redirected to login, use your credentials
- After login, you'll be redirected back to calculator

### Step 3: Calculate Zakat
1. **Add Your First Asset:**
   - Type: Select `Crypto`
   - Name: Enter `Bitcoin`
   - Amount: Enter `0.5`
   - Value (USD): Enter `25000`

2. **Settings:**
   - Nisab Based On: Select `Silver (Recommended)`
   - ☑️ Check `I confirm that my wealth has been held for a full lunar year (Hawl)`

3. **Calculate:**
   - Click **[Calculate Zakat]** button
   - Wait 1-2 seconds

4. **See Results:**
   ```
   Total Wealth: $25,000
   Nisab Status: ✅ Meets Nisab ($505.75)
   Zakat Due: $625 (2.5%)
   ```

---

## 🎯 What You Should See

### ✅ Nisab Threshold Card:
```
┌─────────────────────────────────────┐
│ 🌙 Nisab Threshold                 │
│                                     │
│ Gold: $5,525    Silver: $505.75 ⭐ │
│ 85g × $65/g     595g × $0.85/g     │
│                                     │
│ ℹ️ Silver Nisab benefits more...   │
└─────────────────────────────────────┘
```

### ✅ Your Assets Card:
```
┌─────────────────────────────────────┐
│ 💼 Your Assets      [+ Add Asset]   │
│                                     │
│ Asset #1           Type: [Crypto▼] │
│ Name: [Bitcoin              ]      │
│ Amount: [0.5    ] Value: [$25,000] │
│                                     │
│ Nisab: [○ Gold] [● Silver]         │
│ ☑ Hawl completed                    │
│                                     │
│ [Calculate Zakat]  [Reset]         │
└─────────────────────────────────────┘
```

### ✅ Zakat Calculation Result:
```
┌─────────────────────────────────────┐
│ 📊 Zakat Calculation                │
│                                     │
│ Total Wealth: $25,000              │
│ Nisab Status: ✅ Meets Nisab       │
│                                     │
│ 💰 Zakat Due: $625                 │
│ (2.5% of total wealth)             │
└─────────────────────────────────────┘
```

---

## 🧪 Test Different Scenarios

### Scenario 1: Multiple Assets
```
Asset #1: Bitcoin - 0.5 BTC = $25,000
Asset #2: Cash USD - $5,000

Expected Result:
- Total: $30,000
- Zakat: $750 (2.5%)
```

### Scenario 2: Below Nisab
```
Asset #1: Cash USD - $100

Expected Result:
- Total: $100
- Status: ❌ Below Nisab
- Zakat: $0 (Not required)
```

### Scenario 3: Gold Assets
```
Asset #1: Gold - 100g = $6,500

Expected Result:
- Total: $6,500
- Status: ✅ Meets Nisab (Gold $5,525)
- Zakat: $162.50 (2.5%)
```

---

## 🔍 Troubleshooting

### ❌ Problem: Page shows "Loading..." forever
**Solution:**
```bash
# Check backend is running
# Open terminal in backend folder:
cd backend
npm run dev

# Should see:
# 🚀 Server running on port 5000
# ✅ MongoDB Connected: localhost
```

### ❌ Problem: Nisab values show "$0.00"
**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify backend API:
   - Open: http://localhost:5000/api/zakat/nisab
   - Should return JSON data

### ❌ Problem: "Calculate Zakat" button disabled
**Solution:**
1. Fill ALL asset fields:
   - ✅ Type selected
   - ✅ Name entered
   - ✅ Amount > 0
   - ✅ Value > 0
2. At least one asset must be added

### ❌ Problem: Redirects to login page
**Solution:**
1. You need to be logged in
2. Go to: http://localhost:5173/login
3. Login with your credentials
4. Navigate back to: http://localhost:5173/zakat-calculator

---

## 📱 Features Available

### ✅ Asset Management:
- ➕ Add unlimited assets
- 🗑️ Remove assets
- 📝 Edit asset values
- 💰 6 asset types: Crypto, Cash, Gold, Silver, Stocks, Other

### ✅ Nisab Calculation:
- 🥇 Gold Nisab: 85 grams
- 🥈 Silver Nisab: 595 grams
- 💵 Real-time USD values
- ⭐ Silver recommended (lower threshold)

### ✅ Zakat Calculation:
- 📊 2.5% rate (0.025)
- ✅ Nisab check
- 🌙 Hawl (lunar year) tracking
- 💰 Accurate results

### ✅ History Tracking:
- 📜 View past calculations
- 💳 Mark as paid
- 📅 Date tracking
- 📊 Statistics

### ✅ Islamic Guidelines:
- 📖 Quranic references
- 📚 Islamic rules
- 🕌 Shariah compliance
- ℹ️ Educational tips

---

## 🎓 Islamic Guidelines (Quick Reference)

### What is Zakat?
- **Meaning:** Purification of wealth
- **Rate:** 2.5% (one-fortieth)
- **Pillar:** 3rd Pillar of Islam
- **Purpose:** Help the poor and needy

### Who Must Pay?
1. ✅ Muslim
2. ✅ Adult (reached maturity)
3. ✅ Sane
4. ✅ Owns wealth above Nisab
5. ✅ Held for one lunar year (Hawl)

### What to Include?
- ✅ Cash (savings, bank accounts)
- ✅ Gold & Silver (not for personal use)
- ✅ Crypto & Digital Assets
- ✅ Stocks & Investments
- ✅ Business Inventory
- ❌ Personal home
- ❌ Personal car
- ❌ Work tools

### Who Can Receive Zakat?
**8 Categories (Quran 9:60):**
1. The Poor (Al-Fuqara)
2. The Needy (Al-Masakin)
3. Zakat Administrators
4. New Muslims (to strengthen faith)
5. To Free Slaves (historical)
6. Debtors (Al-Gharimin)
7. In the Path of Allah
8. Travelers (Ibn Al-Sabil)

---

## 📊 Backend API Reference

### Get Nisab Values:
```http
GET http://localhost:5000/api/zakat/nisab
```

### Calculate Zakat:
```http
POST http://localhost:5000/api/zakat/calculate
Authorization: Bearer <token>
Content-Type: application/json

{
  "assets": [
    {
      "type": "crypto",
      "name": "Bitcoin",
      "amount": 0.5,
      "valueUSD": 25000
    }
  ],
  "nisabType": "silver",
  "hawlCompleted": true
}
```

### Get History:
```http
GET http://localhost:5000/api/zakat/history?limit=10
Authorization: Bearer <token>
```

---

## ✅ Checklist

Before using Zakat Calculator, verify:

- [ ] Backend running (port 5000)
- [ ] MongoDB connected
- [ ] Frontend running (port 5173)
- [ ] User logged in
- [ ] Browser: http://localhost:5173/zakat-calculator
- [ ] Nisab values displayed
- [ ] Can add assets
- [ ] Can calculate Zakat
- [ ] Results show correctly

---

## 🆘 Need More Help?

### Documentation:
- 📄 **ZAKAT_CALCULATOR_SYSTEM.md** - Complete system documentation
- 📄 **ZAKAT_CALCULATOR_TROUBLESHOOTING.md** - Detailed troubleshooting
- 📄 **test-zakat-api.js** - API testing script

### Test Backend API:
```bash
node test-zakat-api.js
```

### Check Backend Logs:
```bash
cd backend
npm run dev

# Watch for:
# ✅ MongoDB Connected: localhost
# ✅ POST /api/zakat/calculate 200
```

### Check Frontend Console:
1. Open browser (Chrome/Edge)
2. Press F12
3. Go to Console tab
4. Look for errors (red text)
5. Go to Network tab
6. Try to calculate Zakat
7. Check API calls

---

## 🎯 Success Indicators

### ✅ System Working When:
1. Nisab card shows Gold/Silver prices
2. Can add multiple assets
3. Calculate button clickable
4. Results appear within 2 seconds
5. History shows calculations
6. No console errors

### ❌ System Not Working When:
1. Nisab shows $0.00
2. Calculate button disabled
3. Page redirects to login
4. Console shows errors
5. Network calls fail
6. MongoDB disconnected

---

## 📞 Quick Commands

### Start Backend:
```bash
cd backend
npm run dev
```

### Start Frontend:
```bash
npm run dev
```

### Test API:
```bash
node test-zakat-api.js
```

### Open Calculator:
```
http://localhost:5173/zakat-calculator
```

### Check API:
```
http://localhost:5000/api/zakat/nisab
```

---

## 🕌 Islamic Reminder

**"خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا"**

*"Take from their wealth a charity to purify and sanctify them with it"*

**- Quran 9:103**

---

**Last Updated:** January 2025  
**Status:** ✅ **100% WORKING**  
**Support:** Check troubleshooting guide if issues arise

**النظام يعمل بشكل كامل! May your Zakat be accepted! 🕌💰✨**

