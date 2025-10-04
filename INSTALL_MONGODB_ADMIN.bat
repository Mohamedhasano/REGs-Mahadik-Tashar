@echo off
:: This script must run as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ========================================
    echo    ADMIN RIGHTS REQUIRED
    echo ========================================
    echo.
    echo Please right-click this file and select:
    echo "Run as Administrator"
    echo.
    pause
    exit
)

echo.
echo ========================================
echo    Installing MongoDB via Chocolatey
echo ========================================
echo.

choco install mongodb -y

echo.
echo Creating data directory...
if not exist "C:\data\db" mkdir "C:\data\db"

echo.
echo Starting MongoDB service...
net start MongoDB

echo.
echo Testing MongoDB...
timeout /t 3 /nobreak >nul
mongod --version

echo.
echo ========================================
echo    MongoDB Installation Complete!
echo ========================================
echo.
echo MongoDB is now running!
echo Connection: mongodb://localhost:27017
echo.
echo Next steps:
echo 1. Backend .env is already configured
echo 2. Restart backend: cd backend ^&^& npm run dev
echo.
pause

