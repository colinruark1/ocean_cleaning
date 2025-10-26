"""
Events Routes
Handles all event-related API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
from src.services.google_sheets_service import sheets_service

router = APIRouter(prefix="/api/events", tags=["events"])

class Coordinates(BaseModel):
    lat: float
    lng: float

class EventData(BaseModel):
    id: Optional[str] = None
    title: str
    location: str
    coordinates: Optional[Coordinates] = None
    date: str
    time: str
    participants: int = 1
    maxParticipants: int
    description: str
    organizer: str = "You"
    difficulty: str = "Easy"
    imageUrl: str = ""
    timestamp: Optional[str] = None

class ParticipantsUpdate(BaseModel):
    eventId: str
    participants: int

@router.post("/add")
async def add_event(event: EventData):
    """
    Add a new event directly to Google Sheets using the API
    """
    try:
        # Convert Pydantic model to dict
        event_data = event.model_dump()

        # Convert coordinates model to dict if present
        if event_data.get('coordinates') and hasattr(event_data['coordinates'], 'model_dump'):
            event_data['coordinates'] = event_data['coordinates'].model_dump()

        # Add event to Google Sheets
        sheets_service.add_event(event_data)

        return {
            "success": True,
            "message": "Event added successfully",
            "data": event_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error adding event: {str(e)}"
        )

@router.post("/update-participants")
async def update_participants(update: ParticipantsUpdate):
    """
    Update participant count for an event directly in Google Sheets using the API
    """
    try:
        # Update participants in Google Sheets
        sheets_service.update_event_participants(update.eventId, update.participants)

        return {
            "success": True,
            "message": "Participants updated successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating participants: {str(e)}"
        )

@router.get("/all")
async def get_all_events():
    """
    Fetch all events from Google Sheets
    """
    try:
        events = sheets_service.get_all_events()

        return {
            "success": True,
            "data": events
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching events: {str(e)}"
        )
