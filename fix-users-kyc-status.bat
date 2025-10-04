@echo off
echo.
echo ================================================
echo    Fix Existing Users KYC Status
echo ================================================
echo.
echo This script will update all users to have
echo correct KYC verification status:
echo.
echo   - isVerified: false (for pending KYC)
echo   - isVerified: true (only for approved KYC)
echo.
echo Press Ctrl+C to cancel, or
pause

cd backend

echo.
echo Running fix script...
echo.

node scripts/fix-existing-users-kyc.js

echo.
pause

