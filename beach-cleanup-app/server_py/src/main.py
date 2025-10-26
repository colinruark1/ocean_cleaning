"""
Beach Cleanup API Server - FastAPI
Main application entry point
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from datetime import datetime
import os
from dotenv import load_dotenv

# Import routes
from src.routes import auth_routes, posts_routes
from src.config.database import db_manager

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Beach Cleanup API",
    description="API for organizing and tracking beach cleanup events",
    version="1.0.0"
)

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Exception Handlers
# ============================================================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Validation Error",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": str(exc),
            "detail": "Internal server error"
        }
    )

# ============================================================================
# Startup/Shutdown Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    await db_manager.get_connection()
    print("""
==============================================================
  Beach Cleanup API Server (Python/FastAPI)
  Running on: http://localhost:8000
  Environment: """ + os.getenv("ENV", "development") + """
  API Docs: http://localhost:8000/docs
  Health Check: http://localhost:8000/health
==============================================================
    """)

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    await db_manager.close()
    print("\nShutting down gracefully...")

# ============================================================================
# Health Check Endpoint
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# API Routes
# ============================================================================

# Include all route modules
app.include_router(auth_routes.router)
app.include_router(posts_routes.router)

# 404 handler for undefined routes
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    """Catch all undefined routes"""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"error": "Route not found"}
    )
