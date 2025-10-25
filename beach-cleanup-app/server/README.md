# Beach Cleanup API Server

Backend API server for the Beach Cleanup social media application. Built with Node.js, Express, and SQLite.

## Features

- RESTful API following industry best practices
- JWT-based authentication
- User management and profiles
- Cleanup event creation and management
- Social feed with posts, likes, and comments
- External data integration (NOAA tides, EPA water quality, debris hotspots)
- SQLite database with proper relationships and indexes
- CORS support for frontend integration
- Security middleware (Helmet)
- Request logging (Morgan)

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** SQLite3 (better-sqlite3)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **HTTP Client:** Axios (for external APIs)
- **Security:** Helmet
- **Logging:** Morgan

## Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy the example environment file and update as needed:

```bash
cp .env.example .env
```

Edit `.env` to configure:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens (CHANGE IN PRODUCTION!)
- `CORS_ORIGINS` - Allowed frontend origins

### 3. Initialize Database

Create the database and tables:

```bash
npm run init-db
```

This will:
- Create a SQLite database file
- Set up all required tables (users, events, posts, comments, etc.)
- Insert sample debris hotspot data

### 4. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Documentation

All endpoints are prefixed with `/api/v1`.

### Authentication (`/auth`)

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": null,
    "profilePictureUrl": null,
    "createdAt": "2025-01-15T..."
  }
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "jwt.token.here",
  "user": { ... }
}
```

### Users (`/users`)

#### Get Current User Profile
```http
GET /api/v1/users/me
Authorization: Bearer {token}
```

#### Update Current User Profile
```http
PATCH /api/v1/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "bio": "Ocean conservation enthusiast!",
  "profilePictureUrl": "https://example.com/photo.jpg"
}
```

#### Get Public User Profile
```http
GET /api/v1/users/{userId}
```

### Cleanup Events (`/events`)

#### Get All Events
```http
GET /api/v1/events
# Optional query params:
# ?lat=40.7128&lon=-74.0060&radius_km=25
# ?organizer_id={userId}
```

#### Create Event
```http
POST /api/v1/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventName": "Santa Monica Beach Cleanup",
  "description": "Join us for a morning cleanup!",
  "date": "2025-02-15T09:00:00Z",
  "lat": 34.0195,
  "lon": -118.4912,
  "address": "Santa Monica Beach, CA"
}
```

#### Get Event Details
```http
GET /api/v1/events/{eventId}
```

#### Join Event
```http
POST /api/v1/events/{eventId}/join
Authorization: Bearer {token}
```

#### Leave Event
```http
DELETE /api/v1/events/{eventId}/leave
Authorization: Bearer {token}
```

#### Delete Event (Organizer Only)
```http
DELETE /api/v1/events/{eventId}
Authorization: Bearer {token}
```

### Social Feed & Posts (`/feed`, `/posts`)

#### Get Personalized Feed
```http
GET /api/v1/feed
Authorization: Bearer {token}
```

Returns posts from:
- Users you follow
- Events you're attending or organizing
- Your own posts

#### Create Post
```http
POST /api/v1/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "We collected 20 bags of trash today!",
  "imageUrl": "https://example.com/cleanup.jpg",
  "eventId": "event-id-here" // optional
}
```

#### Get Posts for Event
```http
GET /api/v1/events/{eventId}/posts
```

#### Like/Unlike Post
```http
POST /api/v1/posts/{postId}/like
Authorization: Bearer {token}
```

#### Get Comments
```http
GET /api/v1/posts/{postId}/comments
```

#### Add Comment
```http
POST /api/v1/posts/{postId}/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Great work everyone!"
}
```

### External Data (`/data`)

These endpoints proxy external APIs to protect API keys and simplify responses.

#### Get Tide Predictions
```http
GET /api/v1/data/tides?lat=34.0195&lon=-118.4912&date=2025-02-15
```

**Response:**
```json
{
  "date": "2025-02-15",
  "station": "8454000",
  "predictions": [
    { "type": "Low", "time": "6:42 AM", "height": "0.3 ft" },
    { "type": "High", "time": "12:28 PM", "height": "4.2 ft" }
  ]
}
```

#### Get Water Quality Advisory
```http
GET /api/v1/data/water-quality?lat=34.0195&lon=-118.4912
```

**Response:**
```json
{
  "status": "SAFE|CAUTION|ADVISORY",
  "message": "No advisories at this time. Water quality is good.",
  "source": "EPA BEACON",
  "coordinates": { "lat": 34.0195, "lon": -118.4912 },
  "lastUpdated": "2025-01-15T..."
}
```

#### Get Debris Hotspots
```http
GET /api/v1/data/debris-hotspots?lat=34.0195&lon=-118.4912&radius_km=50
```

**Response:**
```json
[
  {
    "location": "Santa Monica Beach, CA",
    "debrisScore": 8.5,
    "lat": 34.0195,
    "lon": -118.4912,
    "description": "High concentration of plastic bottles",
    "distanceKm": 0.5
  }
]
```

## Database Schema

The SQLite database includes the following tables:

- **users** - User accounts and profiles
- **events** - Cleanup events
- **event_attendees** - Many-to-many relationship for event RSVPs
- **posts** - Social media posts
- **post_likes** - Post likes
- **comments** - Post comments
- **user_follows** - User follow relationships
- **debris_hotspots** - Pre-loaded debris concentration data

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   └── initDatabase.js      # Database initialization script
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── eventController.js   # Event CRUD
│   │   ├── postController.js    # Social feed & posts
│   │   └── dataController.js    # External API proxies
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── eventRoutes.js       # Event endpoints
│   │   ├── postRoutes.js        # Post & feed endpoints
│   │   └── dataRoutes.js        # External data endpoints
│   └── server.js                # Main application entry point
├── .env                         # Environment configuration
├── .env.example                 # Example environment file
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload (nodemon)
- `npm run init-db` - Initialize/reset the database

### Testing with curl

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get user profile (replace TOKEN):**
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Integration with Frontend

Update your frontend's API base URL to point to this server:

**In your React app's `.env` file:**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

The frontend should send the JWT token in the Authorization header:
```javascript
Authorization: Bearer {token}
```

## External API Integration

### NOAA Tides & Currents

- **Documentation:** https://api.tidesandcurrents.noaa.gov/api/prod/
- **API Key:** Not required (public API)
- **Note:** Currently uses a sample station. For production, implement station lookup by lat/lon.

### EPA Water Quality (BEACON)

- **Documentation:** https://watersgeo.epa.gov/BEACON2/
- **API Key:** May not be required (check current documentation)
- **Note:** Current implementation returns sample data. Integrate with actual EPA API for production.

### Marine Debris Data

- **Source:** NOAA Marine Debris Monitoring (MDMAP)
- **Note:** Pre-load data into the `debris_hotspots` table. Sample data is included.

## Security Considerations

- **JWT Secret:** Change `JWT_SECRET` in production to a strong, random value
- **Password Hashing:** Uses bcrypt with salt rounds
- **SQL Injection:** Uses prepared statements (parameterized queries)
- **CORS:** Configure `CORS_ORIGINS` to only allow your frontend domain
- **Helmet:** Adds security headers automatically
- **Environment Variables:** Never commit `.env` to version control

## Production Deployment

### Recommended Steps:

1. **Use a production database** (PostgreSQL, MySQL) instead of SQLite
2. **Set strong JWT_SECRET** (use a random generator)
3. **Configure CORS** to only allow your production frontend domain
4. **Use HTTPS** (SSL/TLS certificates)
5. **Add rate limiting** (e.g., express-rate-limit)
6. **Set up logging** (Winston, Bunyan)
7. **Use environment-based config** (different .env files)
8. **Add monitoring** (PM2, New Relic, Datadog)
9. **Implement API key management** for external APIs

### Deployment Platforms:

- **Heroku** - Easy deployment with Git
- **Railway** - Modern platform with auto-deploy
- **Render** - Free tier available
- **AWS/Google Cloud/Azure** - Full control
- **DigitalOcean** - Simple VPS

## Troubleshooting

### Database locked error
SQLite doesn't handle high concurrency well. For production, use PostgreSQL or MySQL.

### CORS errors
Make sure your frontend origin is listed in `CORS_ORIGINS` in `.env`.

### Token expired
JWT tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`). Users need to log in again.

### External API errors
NOAA and EPA APIs may have rate limits or availability issues. The server returns sample data as fallback.

## License

MIT

## Support

For issues or questions, please contact the development team.
