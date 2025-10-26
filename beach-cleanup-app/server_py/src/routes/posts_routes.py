"""
Posts Routes
Handles all post-related API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from src.services.google_sheets_service import sheets_service

router = APIRouter(prefix="/api/posts", tags=["posts"])

class PostData(BaseModel):
    id: Optional[str] = None
    username: str
    location: str
    date: str
    imageUrl: str
    caption: str
    trashCollected: str
    upvotes: int = 0
    timestamp: Optional[str] = None

class UpvoteUpdate(BaseModel):
    postId: str
    upvotes: int

@router.post("/add")
async def add_post(post: PostData):
    """
    Add a new post directly to Google Sheets using the API
    """
    try:
        # Convert Pydantic model to dict
        post_data = post.model_dump()

        print(f"[DEBUG] Received post data: {post_data.get('id', 'NO_ID')}")
        print(f"[DEBUG] sheets_service.spreadsheet_id: {sheets_service.spreadsheet_id}")

        # Add post to Google Sheets
        sheets_service.add_post(post_data)

        return {
            "success": True,
            "message": "Post added successfully",
            "data": post_data
        }

    except Exception as e:
        print(f"[ERROR] Error in add_post endpoint: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error adding post: {str(e)}"
        )

@router.post("/upvote")
async def update_upvotes(update: UpvoteUpdate):
    """
    Update upvotes for a post directly in Google Sheets using the API
    """
    try:
        # Update upvotes in Google Sheets
        sheets_service.update_upvotes(update.postId, update.upvotes)

        return {
            "success": True,
            "message": "Upvotes updated successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating upvotes: {str(e)}"
        )
