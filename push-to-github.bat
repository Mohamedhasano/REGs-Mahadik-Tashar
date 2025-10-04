@echo off
echo.
echo ================================================
echo    🚀 PUSHING TO GITHUB
echo ================================================
echo.

REM Check if there are any changes
git status

echo.
echo Do you want to continue? (Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    echo.
    echo Enter commit message:
    set /p message=
    
    echo.
    echo 📦 Adding files...
    git add .
    
    echo.
    echo 💾 Creating commit...
    git commit -m "%message%"
    
    echo.
    echo ☁️  Pushing to GitHub...
    git push origin main
    
    echo.
    echo ================================================
    echo    ✅ PUSH COMPLETED!
    echo ================================================
    echo.
    echo Your changes are now on GitHub:
    echo https://github.com/Mohamedhasano/REGs-Mahadik-Tashar
    echo.
) else (
    echo.
    echo ❌ Push cancelled.
    echo.
)

pause

