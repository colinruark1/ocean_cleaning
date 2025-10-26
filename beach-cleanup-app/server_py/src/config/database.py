"""
Database configuration and connection management for Beach Cleanup API
"""
import aiosqlite
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Get database path from environment or use default
DB_PATH = Path(__file__).parent.parent.parent / (os.getenv("DATABASE_PATH", "database.db"))

class DatabaseManager:
    """Manages SQLite database connection"""

    def __init__(self):
        self.db_path = str(DB_PATH)
        self._conn = None

    async def get_connection(self):
        """Get database connection"""
        if self._conn is None:
            self._conn = await aiosqlite.connect(self.db_path)
            self._conn.row_factory = aiosqlite.Row  # Return rows as dictionaries
            # Enable foreign keys
            await self._conn.execute("PRAGMA foreign_keys = ON")
            await self._conn.commit()
            print(f"Database connected: {self.db_path}")
        return self._conn

    async def close(self):
        """Close database connection"""
        if self._conn:
            await self._conn.close()
            self._conn = None
            print("Database connection closed")

# Global database manager instance
db_manager = DatabaseManager()

async def get_db():
    """Dependency for getting database connection in routes"""
    return await db_manager.get_connection()
