@echo off
echo ========================================
echo    MongoDB Windows Quick Install
echo ========================================
echo.
echo This will install MongoDB locally using Chocolatey
echo.
pause

echo.
echo [1/4] Checking if Chocolatey is installed...
where choco >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey not found. Installing Chocolatey...
    echo Please run this script as Administrator!
    pause
    powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
) else (
    echo Chocolatey is already installed!
)

echo.
echo [2/4] Installing MongoDB...
choco install mongodb -y

echo.
echo [3/4] Creating data directory...
if not exist "C:\data\db" mkdir C:\data\db

echo.
echo [4/4] Starting MongoDB service...
net start MongoDB

echo.
echo ========================================
echo    MongoDB Installation Complete!
echo ========================================
echo.
echo Connection String: mongodb://localhost:27017/regs-global
echo.
echo Next steps:
echo 1. Update backend/.env with: MONGODB_URI=mongodb://localhost:27017/regs-global
echo 2. Restart backend: cd backend && npm run dev
echo.
pause

