# Google Maps Integration Setup Guide

This guide will help you set up Google Maps for the OceanClean app to work on **all devices**.

## Understanding the "For Development Purposes Only" Issue

The dark map with watermark appears when:
1. Your API key has restrictions that don't match the requesting device/domain
2. Your API key has exceeded its quota
3. Your API key doesn't have the right APIs enabled

## Solution: Platform-Specific API Keys

You need **different API keys** for different platforms (Web vs Android) OR a single unrestricted key.

---

## Option 1: Multiple API Keys (Most Secure - RECOMMENDED)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Name your project (e.g., "OceanClean App")
5. Click "Create"

### Step 2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for and enable the following APIs:
   - **Maps JavaScript API** (required for map display)
   - **Geocoding API** (optional, for address lookups)

### Step 3: Create API Key for Web

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the API key (save it as "Web Key")
4. Click **Edit API key** to configure:

**API Restrictions:**
- Select **Restrict key**
- Check: **Maps JavaScript API**

**Application Restrictions:**
- Select **HTTP referrers (web sites)**
- Add these referrers:
  ```
  http://localhost:5173/*
  http://localhost:*/*
  http://127.0.0.1:*/*
  https://yourdomain.com/*
  ```

5. Click **Save**

### Step 4: Create API Key for Android

1. Click **+ CREATE CREDENTIALS** → **API key** (again)
2. Copy the API key (save it as "Android Key")
3. Click **Edit API key** to configure:

**API Restrictions:**
- Select **Restrict key**
- Check: **Maps JavaScript API**

**Application Restrictions:**
- Select **Android apps**
- Click **+ Add an item**
- Package name: `com.oceanclean.app` (or your actual package name)
- SHA-1 certificate fingerprint: See below for how to get this

5. Click **Save**

#### Getting Your Android SHA-1 Fingerprint:

For **debug builds** (development):
```bash
cd beach-cleanup-app/android
./gradlew signingReport
```

Look for the **SHA-1** under `Variant: debug`

For **release builds** (production):
```bash
keytool -list -v -keystore path/to/your-release-key.keystore -alias your-key-alias
```

### Step 5: Configure the App

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add **BOTH** API keys:
   ```
   # Web API Key (with HTTP referrer restrictions)
   VITE_GOOGLE_MAPS_API_KEY_WEB=AIzaSy...your_web_key_here

   # Android API Key (with Android app restrictions)
   VITE_GOOGLE_MAPS_API_KEY_ANDROID=AIzaSy...your_android_key_here
   ```

3. **Important**: Never commit `.env` to version control!

The app will automatically use the correct key based on the platform it's running on.

---

## Option 2: Single Unrestricted Key (Quick but Less Secure)

**Use this for quick testing only. Not recommended for production!**

### Step 1-2: Same as Option 1

Follow steps 1-2 from Option 1 above.

### Step 3: Create Unrestricted API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the API key
4. Click **Edit API key**

**API Restrictions:**
- Select **Restrict key**
- Check: **Maps JavaScript API** (still restrict to only Maps API)

**Application Restrictions:**
- Select **None** (⚠️ Not recommended for production)

5. Click **Save**

### Step 4: Configure the App

1. Open your `.env` file
2. Add the unrestricted key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...your_key_here
   ```

This key will work everywhere but has security risks:
- Anyone can use your key if they find it
- You may exceed your quota faster
- Google may flag it as insecure

**IMPORTANT**: Set up billing alerts and usage quotas to prevent unexpected charges!

## Testing the Integration

### Web Browser (Development)

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:5173` in your browser

3. Navigate to the **Events** page

4. Click the **Map** button to switch to map view

5. Allow location permissions when prompted

6. You should see:
   - Your blue location marker
   - Event markers for nearby cleanups
   - Interactive info windows when clicking markers

### Android App

1. Build and sync:
   ```bash
   npm run build
   npx cap sync android
   ```

2. Open in Android Studio:
   ```bash
   npx cap open android
   ```

3. Run on emulator or device

4. Grant location permissions when prompted

5. Grant notification permissions when prompted

6. Navigate to Events → enable Map view

## Troubleshooting

### Map Not Loading

**Problem**: Gray box instead of map

**Solutions**:
- Check that your API key is correct in `.env`
- Verify Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for specific error messages
- Make sure you've restarted the dev server after adding `.env`

### Location Not Working

**Problem**: "Location not detected" message

**Solutions**:
- Check that you've granted location permissions
- Try on HTTPS (required for geolocation on web)
- On Android, verify location services are enabled
- Check that Geolocation API permissions are correct in `capacitor.config.json`

### Notifications Not Showing

**Problem**: No notifications for nearby events

**Solutions**:
- Enable the notifications toggle in the Events page
- Grant notification permissions when prompted
- Check that you're within 5km of a cleanup event
- On Android 13+, verify notification permissions in Settings

### API Key Quota Exceeded

**Problem**: Map stops working after many requests

**Solutions**:
- Go to Google Cloud Console → Billing
- Enable billing (Google provides $200/month free credit)
- Set up usage quotas and alerts

## Testing Notifications

To test notifications:

1. Enable location permissions
2. Click the **Notifications** toggle button
3. The app will check for events within 5km
4. If nearby events exist, you'll receive a notification

**Note**: In development with mock data, you may need to manually adjust coordinates in `src/services/mockData.js` to be near your current location for testing.

## Cost Considerations

Google Maps pricing:
- **Free tier**: $200 credit per month (~28,000 map loads)
- Maps JavaScript API: $7 per 1,000 loads (after free tier)
- For a small app, you'll likely stay within the free tier

## Security Best Practices

1. **Never commit** your `.env` file
2. **Restrict** your API key to specific domains/apps
3. **Set quotas** to prevent unexpected charges
4. **Rotate keys** periodically
5. **Monitor usage** in Google Cloud Console

## Next Steps

Once maps are working, you can:
- Add more event locations to `mockData.js`
- Customize map styles
- Add clustering for many events
- Implement search by location
- Add directions to events

For questions or issues, check the [Google Maps Platform documentation](https://developers.google.com/maps/documentation/javascript).
