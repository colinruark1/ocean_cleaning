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
- **Create Events**: Organize your own cleanup events with customizable details
- **Join Events**: RSVP and connect with other participants
- **Event Details**: View location, date, time, participant count, and difficulty level

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

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173`

## Building for Android

The app is configured to run as a native Android application using Capacitor.

### Prerequisites
- Android Studio installed on your computer
- Java Development Kit (JDK) 17 or higher

### Build Steps

1. **Build the web app**:
   ```bash
   npm run build
   ```

2. **Sync with Android**:
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Build APK in Android Studio**:
   - Click on `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Once complete, find your APK in `android/app/build/outputs/apk/debug/app-debug.apk`

5. **Install on Android device**:
   - Enable "Install from Unknown Sources" on your Android device
   - Transfer the APK file to your device
   - Open the APK file to install

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

## Future Enhancements

- [x] **Android mobile app** (using Capacitor)
- [ ] Backend API with Express and database integration
- [ ] User authentication and authorization
- [ ] Real-time location tracking during cleanups
- [ ] Map integration for visualizing cleanup locations
- [ ] Photo uploads for cleanup documentation
- [ ] Leaderboards and competitive features
- [ ] iOS app version
- [ ] Integration with environmental organizations
- [ ] Trash categorization and recycling tracking
- [ ] Social sharing features
- [ ] Push notifications for nearby events
- [ ] Offline mode support

## Contributing

This project was created for a hackathon. Feel free to fork and improve!

## License

MIT

---

**Built with care for our oceans**
