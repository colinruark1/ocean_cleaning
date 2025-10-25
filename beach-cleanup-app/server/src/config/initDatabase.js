import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../', process.env.DATABASE_PATH || 'database.db');
const db = new Database(dbPath);

console.log('Initializing database at:', dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    profilePictureUrl TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  -- Events table
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    eventName TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    address TEXT,
    organizerId TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (organizerId) REFERENCES users (id) ON DELETE CASCADE
  );

  -- Event attendees (many-to-many relationship)
  CREATE TABLE IF NOT EXISTS event_attendees (
    eventId TEXT NOT NULL,
    userId TEXT NOT NULL,
    joinedAt TEXT NOT NULL,
    PRIMARY KEY (eventId, userId),
    FOREIGN KEY (eventId) REFERENCES events (id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
  );

  -- Posts table
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    imageUrl TEXT,
    authorId TEXT NOT NULL,
    eventId TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES events (id) ON DELETE SET NULL
  );

  -- Post likes (many-to-many relationship)
  CREATE TABLE IF NOT EXISTS post_likes (
    postId TEXT NOT NULL,
    userId TEXT NOT NULL,
    likedAt TEXT NOT NULL,
    PRIMARY KEY (postId, userId),
    FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
  );

  -- Comments table
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    postId TEXT NOT NULL,
    authorId TEXT NOT NULL,
    text TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES users (id) ON DELETE CASCADE
  );

  -- User follows (many-to-many relationship)
  CREATE TABLE IF NOT EXISTS user_follows (
    followerId TEXT NOT NULL,
    followingId TEXT NOT NULL,
    followedAt TEXT NOT NULL,
    PRIMARY KEY (followerId, followingId),
    FOREIGN KEY (followerId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (followingId) REFERENCES users (id) ON DELETE CASCADE
  );

  -- Debris hotspots (pre-loaded from MDMAP data)
  CREATE TABLE IF NOT EXISTS debris_hotspots (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    debrisScore REAL NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL
  );

  -- Create indexes for better query performance
  CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizerId);
  CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
  CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(authorId);
  CREATE INDEX IF NOT EXISTS idx_posts_event ON posts(eventId);
  CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(postId);
  CREATE INDEX IF NOT EXISTS idx_event_attendees_user ON event_attendees(userId);
  CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(followerId);
  CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(followingId);
`);

console.log('Database tables created successfully!');

// Insert some sample debris hotspots data
const insertHotspot = db.prepare(`
  INSERT OR IGNORE INTO debris_hotspots (id, location, debrisScore, lat, lon, description, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const sampleHotspots = [
  {
    id: 'hotspot-1',
    location: 'Santa Monica Beach, CA',
    debrisScore: 8.5,
    lat: 34.0195,
    lon: -118.4912,
    description: 'High concentration of plastic bottles and food wrappers',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hotspot-2',
    location: 'Miami Beach, FL',
    debrisScore: 7.2,
    lat: 25.7907,
    lon: -80.1300,
    description: 'Frequent microplastic accumulation',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hotspot-3',
    location: 'Coney Island, NY',
    debrisScore: 6.8,
    lat: 40.5755,
    lon: -73.9707,
    description: 'Urban beach with high visitor traffic',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hotspot-4',
    location: 'Ocean Beach, San Francisco, CA',
    debrisScore: 7.9,
    lat: 37.7594,
    lon: -122.5107,
    description: 'Accumulated debris from ocean currents',
    createdAt: new Date().toISOString()
  }
];

for (const hotspot of sampleHotspots) {
  insertHotspot.run(
    hotspot.id,
    hotspot.location,
    hotspot.debrisScore,
    hotspot.lat,
    hotspot.lon,
    hotspot.description,
    hotspot.createdAt
  );
}

console.log('Sample debris hotspots inserted!');

db.close();
console.log('Database initialization complete!');
