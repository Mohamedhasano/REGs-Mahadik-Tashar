@echo off
echo.
echo ================================================
echo    Restarting Backend Server...
echo ================================================
echo.

cd backend

echo Starting backend with MongoDB connection...
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

