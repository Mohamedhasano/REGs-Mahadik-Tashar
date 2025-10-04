@echo off
echo.
echo ========================================
echo    Restarting REGs Global Backend
echo ========================================
echo.
cd backend
echo Stopping current backend...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo.
echo Starting backend with MongoDB...
start cmd /k "npm run dev"
echo.
echo ========================================
echo    Backend should start in new window!
echo ========================================
echo.
pause

