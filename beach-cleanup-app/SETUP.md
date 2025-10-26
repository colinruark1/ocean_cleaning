# Complete Setup Guide - Beach Cleanup App

## Overview

This application has **TWO backend options**:

1. **Python/FastAPI Backend** (NEW) - in `server_py/` folder
   - Uses virtual environment with pip
   - Automatic API documentation at `/docs`
   - Runs on port 8000

2. **Node.js/Express Backend** (ORIGINAL) - in `server/` folder
   - Uses npm/Node.js
   - Runs on port 3000

Choose the one you prefer! Both provide the same functionality.

---

## Quick Start - Python Backend (Recommended)

### Easy Way - Use the Starter Script

**Windows:**
```bash
start-python-backend.bat
```

**Mac/Linux:**
```bash
./start-python-backend.sh
```

This script automatically:
- Activates virtual environment
- Installs dependencies if needed
- Initializes database if needed
- Starts the server

### Manual Way

1. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate

   # Mac/Linux
   source venv/bin/activate
   ```

2. **Install Python dependencies** (already installed):
   ```bash
   pip install -r requirements.txt
   ```

3. **Initialize database:**
   ```bash
   cd server_py
   python init_database.py
   cd ..
   ```

4. **Run backend:**
   ```bash
   cd server_py
   python run.py
   # Runs on http://localhost:8000
   ```

5. **Run frontend** (separate terminal):
   ```bash
   npm install  # If not already done
   npm run dev
   # Runs on http://localhost:5173
   ```

### API Documentation

Visit http://localhost:8000/docs for interactive API documentation!

---

## Quick Start - Node.js Backend (Original)

### 1. Install Node.js Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend/server dependencies
cd server
npm install
cd ..
```

### 2. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Add your Google Maps API key to .env
# VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Run the Application

```bash
# Frontend (web interface)
npm run dev

# Backend server (in a separate terminal)
cd server
npm start
```

## Detailed Setup Instructions

### Prerequisites

Required software:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)

For Android development (optional):
- **Android Studio**: Latest version
- **JDK**: v17 or higher
- **Android SDK**: API Level 24 or higher

Verify your environment:
```bash
node --version    # Should be v18.0.0+
npm --version     # Should be v9.0.0+
```

### Frontend Dependencies

All frontend dependencies are listed in `package.json`:

**Production Dependencies:**
- React 19.1.1 (UI framework)
- React Router 7.9.4 (routing)
- Capacitor 7.4.4 (mobile platform)
- Google Maps API integration
- Tailwind CSS 4.1.16 (styling)
- Lucide React (icons)

**Development Dependencies:**
- Vite 7.1.7 (build tool)
- ESLint 9.36.0 (linting)
- TypeScript types

Install with:
```bash
npm install
```

### Backend/Server Dependencies

Located in `server/package.json`:

**Production Dependencies:**
- Express 4.18.2 (web framework)
- better-sqlite3 9.2.2 (database)
- bcryptjs 2.4.3 (password hashing)
- jsonwebtoken 9.0.2 (authentication)
- cors 2.8.5 (CORS handling)
- dotenv 16.3.1 (environment variables)
- helmet 7.1.0 (security)
- morgan 1.10.0 (logging)

**Development Dependencies:**
- nodemon 3.0.3 (auto-restart)

Install with:
```bash
cd server
npm install
```

### Database Setup

Initialize the SQLite database:
```bash
cd server
npm run init-db
```

## Python Virtual Environment (Optional)

A Python virtual environment exists in the `venv` folder, but **Python is not required** for the main application.

If you want to use Python for development utilities:

```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install optional Python packages
pip install -r requirements.txt
```

## Running the Full Stack

### Development Mode

Terminal 1 (Frontend):
```bash
npm run dev
# Runs on http://localhost:5173
```

Terminal 2 (Backend):
```bash
cd server
npm run dev
# Runs on http://localhost:3000
```

### Production Build

```bash
# Build frontend
npm run build

# Start backend
cd server
npm start
```

## Android Development

### Build for Android

1. Build the web app:
```bash
npm run build
```

2. Sync with Capacitor:
```bash
npx cap sync android
```

3. Open in Android Studio:
```bash
npx cap open android
```

4. Build APK in Android Studio:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

See `ANDROID_SETUP.md` for detailed Android instructions.

## Troubleshooting

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

Frontend (Vite):
```bash
# Change port in vite.config.js or:
npm run dev -- --port 3001
```

Backend (Express):
```bash
# Change PORT in server/.env
```

### Capacitor Sync Failures

```bash
# Remove and re-add Android platform
npx cap remove android
npx cap add android
npx cap sync android
```

## Environment Variables

### Frontend (.env)
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=http://localhost:3000
```

### Backend (server/.env)
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
DATABASE_PATH=./database.sqlite
```

## Project Structure

```
beach-cleanup-app/
├── src/                    # Frontend React source code
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── server/                # Backend Express server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── config/       # Configuration
│   └── package.json      # Server dependencies
├── android/              # Native Android project
├── public/               # Static assets
├── dist/                 # Production build output
├── venv/                 # Python virtual environment (optional)
├── package.json          # Frontend dependencies
├── requirements.txt      # Optional Python packages
└── README.md            # Project overview
```

## Additional Documentation

- `README.md` - Project overview and features
- `DEPENDENCIES.txt` - Detailed dependency information
- `ANDROID_SETUP.md` - Android build instructions
- `ARCHITECTURE.md` - System architecture details
- `MAPS_SETUP.md` - Google Maps API setup
- `QUICKSTART.md` - Quick start guide

## Getting Help

1. Check the documentation files listed above
2. Verify Node.js and npm versions
3. Try a clean reinstall of node_modules
4. Check the `.env` files are properly configured
5. Review error messages in the console

## Tech Stack Summary

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **Mobile**: Capacitor (Android)
- **Maps**: Google Maps JavaScript API
- **Authentication**: JWT
- **Database**: SQLite (better-sqlite3)

## License

MIT
