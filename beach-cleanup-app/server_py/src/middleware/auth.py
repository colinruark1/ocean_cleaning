"""
Authentication middleware using JWT tokens
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_IN = os.getenv("JWT_EXPIRES_IN", "7d")

security = HTTPBearer()

class TokenData:
    """Data extracted from JWT token"""
    def __init__(self, user_id: str, email: str, username: str):
        self.user_id = user_id
        self.email = email
        self.username = username

async def authenticate_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenData:
    """
    Dependency that requires a valid JWT token
    Raises 401 if no token, 403 if invalid/expired
    """
    token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token required"
        )

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("userId")
        email: str = payload.get("email")
        username: str = payload.get("username")

        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid token"
            )

        return TokenData(user_id=user_id, email=email, username=username)

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired token"
        )

async def optional_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[TokenData]:
    """
    Optional authentication - returns TokenData if valid token, None otherwise
    Does not raise exceptions
    """
    if not credentials:
        return None

    token = credentials.credentials

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("userId")
        email: str = payload.get("email")
        username: str = payload.get("username")

        if user_id and email:
            return TokenData(user_id=user_id, email=email, username=username)
    except JWTError:
        pass

    return None
