@echo off
echo ===================================
echo Building OceanClean for Android
echo ===================================
echo.

echo Step 1: Building web application...
call npm run build
if errorlevel 1 (
    echo Error: Web build failed!
    pause
    exit /b 1
)
echo.

echo Step 2: Syncing with Android...
call npx cap sync android
if errorlevel 1 (
    echo Error: Capacitor sync failed!
    pause
    exit /b 1
)
echo.

echo ===================================
echo Build Complete!
echo ===================================
echo.
echo Next steps:
echo 1. Run: npx cap open android
echo 2. In Android Studio, click Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo 3. Find your APK in: android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
