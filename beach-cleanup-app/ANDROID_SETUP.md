# Android Build Setup Guide

This guide will help you build and install the OceanClean Android app.

## Prerequisites

Before building the Android app, make sure you have:

### 1. Android Studio
Download and install from: https://developer.android.com/studio

### 2. Java Development Kit (JDK)
- JDK 17 or higher is required
- Android Studio usually includes this, but you can download from: https://www.oracle.com/java/technologies/downloads/

### 3. Android SDK
- Installed automatically with Android Studio
- Make sure Android SDK Platform 33 or higher is installed

## Quick Build Process

### Option 1: Using the Build Script (Easiest)

**Windows:**
```bash
build-android.bat
```

**Mac/Linux:**
```bash
./build-android.sh
```

This script will:
1. Build the web application
2. Sync files to the Android project
3. Tell you the next steps

### Option 2: Manual Build

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync with Android:**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Build the APK in Android Studio:**
   - Wait for Gradle sync to complete
   - Click `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Wait for the build to complete (2-5 minutes)
   - Click "locate" in the notification to find your APK

## Installing on Your Android Device

### Method 1: Direct Install (USB)
1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect your device to your computer via USB

3. In Android Studio, click the "Run" button (green play icon)

4. Select your device from the list

### Method 2: APK Transfer
1. Find the APK file at: `android/app/build/outputs/apk/debug/app-debug.apk`

2. Transfer it to your Android device (via USB, email, cloud storage, etc.)

3. On your Android device:
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Install Unknown Apps"
   - Open the APK file using a file manager
   - Tap "Install"

## Testing on Android Emulator

If you don't have a physical Android device:

1. In Android Studio, click "Device Manager" (phone icon in toolbar)

2. Click "Create Device"

3. Select a device (e.g., Pixel 7)

4. Select a system image (e.g., API 33 - Android 13)

5. Click "Finish"

6. Click the play button next to your virtual device

7. Once the emulator starts, click the "Run" button in Android Studio

## Common Issues

### Issue: Gradle Build Failed
**Solution:**
- Make sure Android SDK is properly installed
- Check that `ANDROID_HOME` environment variable is set
- Try `File` → `Invalidate Caches` in Android Studio

### Issue: App Won't Install on Device
**Solution:**
- Make sure USB Debugging is enabled
- Check that your device is authorized (check for popup on device)
- Try uninstalling any previous version of the app

### Issue: Build Takes Too Long
**Solution:**
- First build can take 5-10 minutes
- Subsequent builds are much faster
- Make sure you have good internet connection (downloads dependencies)

## App Permissions

The app currently requests these permissions:
- Internet access (for future API integration)

## Building a Release APK

For a production-ready APK (smaller size, better performance):

1. In Android Studio, click `Build` → `Generate Signed Bundle / APK`

2. Select "APK"

3. Create a new keystore or use an existing one

4. Fill in the keystore information

5. Select "release" build variant

6. Click "Finish"

The release APK will be in: `android/app/build/outputs/apk/release/`

## Next Steps

Once the app is installed:
- Test all features (Dashboard, Events, Groups, Profile)
- Check responsive design on different screen sizes
- Test navigation between pages
- Verify all buttons and interactions work

## Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio Guide: https://developer.android.com/studio/intro
- React Docs: https://react.dev

---

**Happy Building!**
