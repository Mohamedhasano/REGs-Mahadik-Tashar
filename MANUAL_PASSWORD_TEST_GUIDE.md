# 🧪 Manual Testing Guide - Password System

## Quick Test Guide (5 Minutes)

Follow these steps to manually test the password system:

---

## 🎯 Prerequisites

1. ✅ Backend running on `http://localhost:5000`
2. ✅ Frontend running on `http://localhost:5173`
3. ✅ MongoDB connected
4. ✅ User account logged in

---

## 📋 Test Steps

### Test 1: View Password Info
**Time**: 30 seconds

1. Open browser: `http://localhost:5173/verifications`
2. Look for **"Security"** card
3. Find **"Password"** section
4. Check: Shows "Last changed: X days ago" ✅

**Expected**: Real number (not "Loading...")

---

### Test 2: Change Password (Success)
**Time**: 1 minute

1. Click **"Change"** button next to Password
2. Dialog opens with 3 input fields
3. Enter:
   - **Current Password**: Your actual current password
   - **New Password**: `newpassword123` (min 6 chars)
   - **Confirm Password**: `newpassword123` (must match)
4. Click **"Change Password"** button
5. Wait for loading spinner
6. Check for success toast: "✅ Password changed successfully!"
7. Dialog should close automatically
8. Check "Last changed" → should say "0 days ago"

**Expected**: ✅ Success toast, dialog closes, date updates

---

### Test 3: Wrong Current Password
**Time**: 30 seconds

1. Click **"Change"** button again
2. Enter:
   - **Current Password**: `wrongpassword`
   - **New Password**: `anotherpass123`
   - **Confirm Password**: `anotherpass123`
3. Click **"Change Password"**
4. Check for error toast

**Expected**: ❌ "Current password is incorrect"

---

### Test 4: Passwords Don't Match
**Time**: 30 seconds

1. In the change dialog, enter:
   - **Current Password**: `newpassword123` (your actual password)
   - **New Password**: `testpass123`
   - **Confirm Password**: `testpass999` (different!)
2. Look for red error message below confirm field
3. Button should be disabled

**Expected**: ❌ "Passwords do not match" (red text)

---

### Test 5: Password Too Short
**Time**: 30 seconds

1. In the change dialog, enter:
   - **Current Password**: `newpassword123`
   - **New Password**: `short` (only 5 chars)
   - **Confirm Password**: `short`
2. Look for warning message below new password field
3. Button should be disabled

**Expected**: ⚠️ "Password must be at least 6 characters" (yellow text)

---

### Test 6: Same As Current
**Time**: 30 seconds

1. In the change dialog, enter:
   - **Current Password**: `newpassword123`
   - **New Password**: `newpassword123` (same!)
   - **Confirm Password**: `newpassword123`
2. Click **"Change Password"**
3. Check for error toast

**Expected**: ❌ "New password must be different from current password"

---

### Test 7: Verify New Password Works
**Time**: 1 minute

1. Click **"Logout"** button (top right)
2. Go to login page
3. Enter email and your **NEW** password (`newpassword123`)
4. Click **"Login"**

**Expected**: ✅ Successfully logged in with new password

---

## 🎨 UI/UX Checks

While testing, verify these visual elements:

### Dialog Design:
- ✅ Blue gradient border
- ✅ Lock icon with blue gradient background
- ✅ Close button (✕) top right
- ✅ Three password input fields
- ✅ Security tips card (blue background)
- ✅ Cancel and Change Password buttons

### Real-time Validation:
- ✅ Red error text for mismatched passwords
- ✅ Yellow warning for short passwords
- ✅ Button disabled when inputs invalid
- ✅ Button enabled when all valid
- ✅ Loading spinner during API call

### Toast Notifications:
- ✅ Success toast (green)
- ✅ Error toast (red)
- ✅ Toast auto-dismisses after 3 seconds

---

## 🔍 Backend API Tests (Optional)

### Using Browser DevTools:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Perform password change
4. Look for these requests:

```
GET /api/password/info
Status: 200
Response: { "lastChanged": "...", "daysSinceChange": 0 }

POST /api/password/change
Status: 200
Response: { "message": "✅ Password changed successfully!" }
```

---

## 📊 Test Checklist

Use this checklist while testing:

- [ ] Password info displays correctly
- [ ] Change password (success) works
- [ ] Wrong current password rejected
- [ ] Passwords don't match validation
- [ ] Too short password validation
- [ ] Same password validation
- [ ] Login with new password works
- [ ] Dialog opens/closes correctly
- [ ] Real-time validation works
- [ ] Loading states show
- [ ] Toast notifications appear
- [ ] "Last changed" updates

---

## 🐛 Common Issues

### Issue: "Loading..." never changes
**Fix**: Check backend is running on port 5000

### Issue: "401 Unauthorized"
**Fix**: Login again, token may have expired

### Issue: Changes not saving
**Fix**: Check MongoDB is connected

### Issue: Dialog not opening
**Fix**: Refresh page, clear cache

---

## ✅ Expected Results Summary

| Test | Expected Behavior |
|------|-------------------|
| **View Info** | Shows "Last changed: X days ago" |
| **Change Success** | Toast + Dialog closes + Date updates |
| **Wrong Current** | Error toast |
| **Don't Match** | Red error text + Button disabled |
| **Too Short** | Yellow warning + Button disabled |
| **Same Password** | Error toast |
| **Login New** | Successfully logs in |

---

## 🎯 Success Criteria

**All Tests Pass** = ✅ Password System Working!

If any test fails, check:
1. Backend running? (`npm run dev` in backend folder)
2. Frontend running? (`npm run dev` in root folder)
3. MongoDB connected? (Check backend console)
4. Logged in? (Check if you have auth token)

---

## 📸 Screenshots Guide

### Step 1: Verifications Page
```
┌─────────────────────────────────────┐
│ Security                            │
│ ┌─────────────────────────────────┐ │
│ │ 🔒 Password                     │ │
│ │ Last changed: 0 days ago [Change]│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Step 2: Change Password Dialog
```
┌──────────────────────────────────────┐
│ 🔒 Change Password              ✕   │
│ Last changed 0 days ago              │
│                                      │
│ Current Password:                    │
│ [••••••••••]                        │
│                                      │
│ New Password:                        │
│ [••••••••••]                        │
│ ⚠️ Password must be at least 6 chars│
│                                      │
│ Confirm New Password:                │
│ [••••••••••]                        │
│ ❌ Passwords do not match           │
│                                      │
│ 🔒 Security Tips:                   │
│ • Use at least 8 characters          │
│ • Mix uppercase & lowercase          │
│ • Include numbers & special chars    │
│                                      │
│ [Cancel]         [Change Password]  │
└──────────────────────────────────────┘
```

### Step 3: Success Toast
```
┌────────────────────────────────┐
│ ✅ Password changed successfully!│
└────────────────────────────────┘
```

---

## ⏱️ Total Test Time

- **Quick Test** (3 core tests): ~2 minutes
- **Full Test** (all 7 tests): ~5 minutes
- **With API Testing**: ~7 minutes

---

**Ready to test? Start with Test 1! 🚀**


