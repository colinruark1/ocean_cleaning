"""
Authentication routes
"""
from fastapi import APIRouter, Depends, HTTPException
from src.config.database import get_db
from src.models.schemas import UserRegister, UserLogin, TokenResponse
from src.controllers import auth_controller

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=201)
async def register_user(user_data: UserRegister, db=Depends(get_db)):
    """Register a new user"""
    result = await auth_controller.register(
        db,
        username=user_data.username,
        email=user_data.email,
        password=user_data.password
    )
    return result

@router.post("/login", response_model=TokenResponse)
async def login_user(login_data: UserLogin, db=Depends(get_db)):
    """Login existing user"""
    result = await auth_controller.login(
        db,
        email=login_data.email,
        password=login_data.password
    )
    return result
