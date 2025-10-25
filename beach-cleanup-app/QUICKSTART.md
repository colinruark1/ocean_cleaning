# OceanClean - Quick Start Guide

Your beach cleanup app is ready! Here's everything you need to know to get started.

## What's Been Built

**OceanClean** is a fully functional mobile and web app inspired by Strava, designed to help people organize and track beach cleanup events.

### ✅ Completed Features

1. **Dashboard** - Activity feed with stats (cleanups, trash collected, distance, rank)
2. **Events Page** - Browse, create, and join cleanup events
3. **Groups Page** - Discover and create cleanup community groups
4. **Profile Page** - Personal stats, achievements, and activity timeline
5. **Android App** - Native Android support via Capacitor
6. **Responsive Design** - Works on all screen sizes

## File Locations

```
ocean_cleaning/
└── beach-cleanup-app/          # Main project folder
    ├── src/                     # Source code
    ├── android/                 # Android project
    ├── dist/                    # Production build
    ├── build-android.bat        # Windows build script
    ├── build-android.sh         # Mac/Linux build script
    ├── README.md                # Full documentation
    └── ANDROID_SETUP.md         # Android build guide
```

## How to Use

### Running the Web App (Easiest Way to Test)

1. Open terminal in `beach-cleanup-app` folder
2. Run:
   ```bash
   npm run dev
   ```
3. Open browser to: http://localhost:5173

### Building for Android

**Prerequisites:**
- Install Android Studio from: https://developer.android.com/studio
- Install JDK 17+ (usually included with Android Studio)

**Quick Build:**

Windows:
```bash
cd beach-cleanup-app
build-android.bat
```

Mac/Linux:
```bash
cd beach-cleanup-app
./build-android.sh
```

Then follow the instructions to open in Android Studio.

**Full instructions:** See `ANDROID_SETUP.md`

## Testing the App

### In the Web Browser:
1. Navigate through all pages using the top navigation
2. Try creating an event (Events page → Create Event button)
3. Try creating a group (Groups page → Create Group button)
4. Check the profile page to see stats and achievements
5. Test on mobile by opening in Chrome mobile or using responsive mode (F12)

### On Android Device:
1. Build the APK using Android Studio
2. Transfer APK to your device
3. Enable "Install from Unknown Sources" in Settings
4. Install and test all features

## App Features Demo

### Dashboard
- Shows recent community activity
- Displays your personal stats in colorful cards
- Call-to-action banner to join events

### Events
- **Browse events** in a beautiful card layout
- **Create new events** with modal form
  - Set location, date, time
  - Set max participants
  - Add description
- **Join events** - click "Join Event" button
- Search functionality (UI ready)

### Groups
- **Discover groups** by category
  - Local Community
  - Environmental
  - Youth
  - Corporate
  - Educational
- **Create groups** with custom details
- View group stats (members, cleanups, trash collected)
- **Join groups** with one click

### Profile
- View your 6 key metrics
- See recent activity timeline
- Track achievements (locked/unlocked badges)
- Progress bar to next milestone

## Customization Ideas

### Colors
Edit `tailwind.config.js` to change the ocean theme colors

### Add More Features
- Backend API connection
- Real GPS tracking
- Camera integration
- Social sharing
- Maps integration

### Branding
- Update app name in `capacitor.config.json`
- Change app icon (in `android/app/src/main/res/`)
- Modify splash screen

## Hackathon Demo Tips

1. **Start with web version** - fastest way to show features
2. **Have APK ready** - build it beforehand if possible
3. **Showcase the flow:**
   - Dashboard → See community activity
   - Events → Create a new cleanup event
   - Groups → Join a community group
   - Profile → Show achievements and stats

4. **Emphasize:**
   - Strava-inspired design
   - Native Android app capability
   - Community-focused features
   - Environmental impact tracking

## Troubleshooting

### Web App Won't Start
```bash
cd beach-cleanup-app
npm install
npm run dev
```

### Android Build Issues
- Check that Android Studio is installed
- Make sure JDK 17+ is installed
- Read `ANDROID_SETUP.md` for detailed help

### Styling Issues
```bash
cd beach-cleanup-app
npm install -D @tailwindcss/postcss
npm run build
```

## Tech Stack Summary

- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Capacitor** - Native Android
- **React Router** - Navigation
- **Lucide React** - Icons

## Project Status

✅ **Web App**: Fully functional
✅ **Android Setup**: Complete
✅ **UI/UX**: Strava-inspired design implemented
✅ **Core Features**: Events, Groups, Profile, Dashboard

⏳ **Not Yet Implemented:**
- Backend API
- User authentication
- Real GPS tracking
- Database integration
- Photo uploads

## Next Steps

1. **Test the web app** → `npm run dev`
2. **Install Android Studio** (if building Android)
3. **Build Android APK** → Run `build-android.bat` or `build-android.sh`
4. **Prepare demo** → Practice showing the features
5. **Consider backend** → Add Express + MongoDB if time permits

## Resources

- **Full README**: `beach-cleanup-app/README.md`
- **Android Guide**: `beach-cleanup-app/ANDROID_SETUP.md`
- **React Docs**: https://react.dev
- **Capacitor Docs**: https://capacitorjs.com
- **Tailwind CSS**: https://tailwindcss.com

---

**Good luck with your hackathon! 🌊**

Built with care for our oceans 💙
