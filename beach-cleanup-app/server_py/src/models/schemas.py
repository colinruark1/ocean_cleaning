"""
Pydantic models/schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ============================================================================
# Authentication Schemas
# ============================================================================

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

# ============================================================================
# User Schemas
# ============================================================================

class UserBase(BaseModel):
    id: str
    username: str
    email: str
    bio: Optional[str] = None
    profilePictureUrl: Optional[str] = None
    createdAt: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    profilePictureUrl: Optional[str] = None

# ============================================================================
# Event Schemas
# ============================================================================

class EventCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    location: str
    latitude: float
    longitude: float
    date: str  # ISO format
    difficulty: Optional[str] = "medium"

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    date: Optional[str] = None
    difficulty: Optional[str] = None

# ============================================================================
# Post Schemas
# ============================================================================

class PostCreate(BaseModel):
    content: str = Field(..., min_length=1)
    imageUrl: Optional[str] = None
    eventId: Optional[str] = None

class PostUpdate(BaseModel):
    content: Optional[str] = None

# ============================================================================
# Response Models
# ============================================================================

class HealthCheckResponse(BaseModel):
    status: str
    timestamp: str

class ErrorResponse(BaseModel):
    error: str
    details: Optional[dict] = None
