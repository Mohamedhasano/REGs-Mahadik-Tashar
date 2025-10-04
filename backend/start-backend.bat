@echo off
echo ================================================
echo    Starting REGs Global Backend Server
echo ================================================
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Starting backend server...
echo.
call npm run dev

