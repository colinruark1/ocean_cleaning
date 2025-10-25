#!/bin/bash

echo "==================================="
echo "Building OceanClean for Android"
echo "==================================="
echo ""

echo "Step 1: Building web application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Web build failed!"
    exit 1
fi
echo ""

echo "Step 2: Syncing with Android..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "Error: Capacitor sync failed!"
    exit 1
fi
echo ""

echo "==================================="
echo "Build Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Run: npx cap open android"
echo "2. In Android Studio, click Build -> Build Bundle(s) / APK(s) -> Build APK(s)"
echo "3. Find your APK in: android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
