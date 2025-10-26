"""
Authentication controller for user registration and login
"""
from fastapi import HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_IN_DAYS = 7

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def generate_token(user: dict) -> str:
    """Generate JWT token for a user"""
    expires = datetime.utcnow() + timedelta(days=JWT_EXPIRES_IN_DAYS)
    payload = {
        "userId": user["id"],
        "email": user["email"],
        "username": user["username"],
        "exp": expires
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def register(db, username: str, email: str, password: str):
    """Register a new user"""
    # Validation
    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )

    # Check if user already exists
    cursor = await db.execute(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        (email, username)
    )
    existing_user = await cursor.fetchone()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email or username already exists"
        )

    # Hash password
    hashed_password = hash_password(password)

    # Create user
    user_id = str(uuid.uuid4())
    now = datetime.now().isoformat()

    await db.execute(
        """
        INSERT INTO users (id, username, email, password, bio, profilePictureUrl, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (user_id, username, email, hashed_password, None, None, now, now)
    )
    await db.commit()

    # Get created user (without password)
    cursor = await db.execute(
        "SELECT id, username, email, bio, profilePictureUrl, createdAt FROM users WHERE id = ?",
        (user_id,)
    )
    row = await cursor.fetchone()
    user = dict(row)

    # Generate token
    token = generate_token(user)

    return {
        "token": token,
        "user": user
    }

async def login(db, email: str, password: str):
    """Login existing user"""
    # Get user by email
    cursor = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )
    row = await cursor.fetchone()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user = dict(row)

    # Verify password
    if not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Remove password from response
    del user["password"]

    # Generate token
    token = generate_token(user)

    return {
        "token": token,
        "user": user
    }
