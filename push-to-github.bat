@echo off
echo ==========================================
echo  GitHub-ға жіберу скрипті
echo ==========================================
echo.

cd /d C:\Users\nurka\Downloads\LMS

echo [1/5] Git статус тексерілуде...
git status
echo.

echo [2/5] Барлық файлдар қосылуда...
git add .
echo ✅ Файлдар қосылды
echo.

echo [3/5] Commit жасалуда...
git commit -m "✨ Major improvements: Landing Page, Notifications, Skeleton Loaders, Admin scripts, Demo data"
echo ✅ Commit жасалды
echo.

echo [4/5] GitHub-қа жіберілуде...
git push origin main
echo ✅ Push аяқталды
echo.

echo ==========================================
echo  ДАЙЫН! Барлық өзгерістер GitHub-та
echo ==========================================
echo.
echo Сілтеме: https://github.com/nurzh07/library-management-system.git
echo.

pause
