"""
Initialize the SQLite database with tables and sample data
Run this script once to set up the database
"""
import asyncio
import aiosqlite
from pathlib import Path
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Get database path
DB_PATH = Path(__file__).parent / (os.getenv("DATABASE_PATH", "database.db"))

async def init_database():
    """Initialize database tables and sample data"""
    print(f"Initializing database at: {DB_PATH}")

    async with aiosqlite.connect(DB_PATH) as db:
        # Enable foreign keys
        await db.execute("PRAGMA foreign_keys = ON")

        # Create tables
        await db.executescript("""
            -- Users table
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                displayName TEXT,
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
        """)

        print("Database tables created successfully!")

        # Insert sample debris hotspots
        sample_hotspots = [
            {
                "id": "hotspot-1",
                "location": "Santa Monica Beach, CA",
                "debrisScore": 8.5,
                "lat": 34.0195,
                "lon": -118.4912,
                "description": "High concentration of plastic bottles and food wrappers",
                "createdAt": datetime.now().isoformat()
            },
            {
                "id": "hotspot-2",
                "location": "Miami Beach, FL",
                "debrisScore": 7.2,
                "lat": 25.7907,
                "lon": -80.1300,
                "description": "Frequent microplastic accumulation",
                "createdAt": datetime.now().isoformat()
            },
            {
                "id": "hotspot-3",
                "location": "Coney Island, NY",
                "debrisScore": 6.8,
                "lat": 40.5755,
                "lon": -73.9707,
                "description": "Urban beach with high visitor traffic",
                "createdAt": datetime.now().isoformat()
            },
            {
                "id": "hotspot-4",
                "location": "Ocean Beach, San Francisco, CA",
                "debrisScore": 7.9,
                "lat": 37.7594,
                "lon": -122.5107,
                "description": "Accumulated debris from ocean currents",
                "createdAt": datetime.now().isoformat()
            }
        ]

        for hotspot in sample_hotspots:
            await db.execute("""
                INSERT OR IGNORE INTO debris_hotspots
                (id, location, debrisScore, lat, lon, description, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                hotspot["id"],
                hotspot["location"],
                hotspot["debrisScore"],
                hotspot["lat"],
                hotspot["lon"],
                hotspot["description"],
                hotspot["createdAt"]
            ))

        await db.commit()
        print("Sample debris hotspots inserted!")

    print("Database initialization complete!")

if __name__ == "__main__":
    asyncio.run(init_database())
