# OceanClean - Beach Cleanup Community App

A Strava-inspired mobile and web application for organizing and tracking beach cleanup events, connecting with environmental groups, and making a positive impact on our oceans.

**Now available as a native Android app!**

## Features

### Dashboard
- **Activity Feed**: See recent cleanups and events from the community
- **Personal Stats**: Track your cleanup count, trash collected, distance covered, and global ranking
- **Achievements System**: Earn badges and unlock milestones as you participate

### Events
- **Browse Events**: Discover upcoming beach cleanup events near you
- **Map View**: See all events on an interactive Google Maps interface with your current location
- **Location Tracking**: Automatically detect your location and calculate distances to nearby events
- **Nearby Notifications**: Get push notifications about cleanup events happening near you
- **Create Events**: Organize your own cleanup events with customizable details
- **Join Events**: RSVP and connect with other participants
- **Event Details**: View location, date, time, participant count, and difficulty level
- **Distance Display**: See how far each event is from your current location

### Groups
- **Community Groups**: Join local and interest-based cleanup groups
- **Create Groups**: Start your own community of ocean cleaners
- **Group Stats**: Track member count, total cleanups, and trash collected
- **Group Categories**: Local Community, Environmental, Youth, Corporate, and Educational groups

### Profile
- **Personal Dashboard**: View your complete cleanup history and achievements
- **Activity Timeline**: Track all your past cleanups and events
- **Progress Tracking**: Monitor your journey toward the next milestone
- **Achievement Badges**: Showcase your earned accomplishments

## Tech Stack

- **Frontend**: React 18 with Vite
- **Mobile**: Capacitor (native Android support)
- **Styling**: Tailwind CSS with custom ocean-themed color palette
- **Routing**: React Router v6
- **Icons**: Lucide React
- **UI/UX**: Inspired by Strava's clean, activity-focused design

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Enable these APIs:
     - Maps JavaScript API
     - Geocoding API
   - Add your API key to `.env`:
     ```
     VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## Building for Android

The app is configured to run as a native Android application using Capacitor with full support for:
- **Geolocation**: Native GPS access to track your location
- **Local Notifications**: Push notifications for nearby cleanup events

### Prerequisites
- Android Studio installed on your computer
- Java Development Kit (JDK) 17 or higher

### Build Steps

1. **Build the web app**:
   ```bash
   npm run build
   ```

2. **Sync Capacitor plugins with Android**:
   ```bash
   npx cap sync android
   ```
   This will:
   - Copy web assets to Android project
   - Install native Geolocation and Local Notifications plugins
   - Configure Android permissions

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Configure Android Permissions** (already done via capacitor.config.json):
   The app requests these permissions:
   - `ACCESS_FINE_LOCATION`: For precise GPS location
   - `ACCESS_COARSE_LOCATION`: For approximate location
   - `POST_NOTIFICATIONS`: For local notifications (Android 13+)

5. **Build APK in Android Studio**:
   - Click on `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Once complete, find your APK in `android/app/build/outputs/apk/debug/app-debug.apk`

6. **Install on Android device**:
   - Enable "Install from Unknown Sources" on your Android device
   - Transfer the APK file to your device
   - Open the APK file to install
   - Grant location and notification permissions when prompted

### Quick Development Workflow

When making changes to the web code:

```bash
npm run build
npx cap sync android
npx cap open android
```

Then rebuild in Android Studio or run on an emulator/device.

## Project Structure

```
beach-cleanup-app/
├── android/                  # Native Android project (Capacitor)
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx    # Main activity feed and stats
│   │   ├── Events.jsx        # Event browsing and creation
│   │   ├── Groups.jsx        # Group discovery and management
│   │   └── Profile.jsx       # User profile and achievements
│   ├── App.jsx              # Main app component with routing
│   ├── App.css              # Custom styles
│   ├── index.css            # Tailwind imports and global styles
│   └── main.jsx             # App entry point
├── dist/                     # Production build (web assets)
├── capacitor.config.json     # Capacitor configuration
├── tailwind.config.js        # Tailwind configuration with ocean theme
└── package.json
```

## Color Scheme

The app uses a custom ocean-themed color palette:
- Primary: Ocean Blue (#0ea5e9 to #0c4a6e)
- Accents: Green, Orange, Blue, Purple (for different stat categories)
- Background: Light Gray (#f9fafb)

## Features Implemented

- [x] **Android mobile app** (using Capacitor)
- [x] **Google Maps integration** with interactive event markers
- [x] **Real-time location tracking** with native GPS
- [x] **Distance calculation** to nearby cleanup events
- [x] **Local push notifications** for nearby cleanups
- [x] **Map and list view toggle** for events
- [x] **Location permissions** handling

## Future Enhancements

- [ ] Backend API with Express and database integration
- [ ] User authentication and authorization
- [ ] Real-time location tracking during cleanups
- [ ] Photo uploads for cleanup documentation
- [ ] Leaderboards and competitive features
- [ ] iOS app version
- [ ] Integration with environmental organizations
- [ ] Trash categorization and recycling tracking
- [ ] Social sharing features
- [ ] Background location tracking for automatic event detection
- [ ] Offline mode support
- [ ] Route optimization for multi-location cleanups

## Contributing

This project was created for a hackathon. Feel free to fork and improve!

## License

MIT

---

**Built with care for our oceans**
