@echo off
echo ========================================
echo    Update .env for MongoDB Atlas
echo ========================================
echo.
echo This will help you update the .env file
echo.

set /p CLUSTER_URL="Enter your Cluster URL (e.g., cluster0.ab1cd.mongodb.net): "
set /p PASSWORD="Enter your MongoDB Atlas password: "

echo.
echo Creating backup of .env...
copy backend\.env backend\.env.backup

echo.
echo Updating .env file...
(
echo MONGODB_URI=mongodb+srv://regs_admin:%PASSWORD%@%CLUSTER_URL%/regs-global?retryWrites=true^&w=majority
echo JWT_SECRET=super-secret-key-change-in-production-12345
echo JWT_EXPIRE=7d
echo PORT=5000
echo NODE_ENV=development
echo CORS_ORIGIN=http://localhost:5173
echo FRONTEND_URL=http://localhost:5173
) > backend\.env

echo.
echo ========================================
echo    .env file updated successfully!
echo ========================================
echo.
echo Connection String:
type backend\.env | findstr "MONGODB_URI"
echo.
echo Backup saved to: backend\.env.backup
echo.
echo Next step: Restart backend
pause

