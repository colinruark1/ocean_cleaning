"""
Quick test script to verify events endpoint is working
"""
import requests
import json
from datetime import datetime

# Test data
test_event = {
    "id": f"test-event-{datetime.now().timestamp()}",
    "title": "Test Beach Cleanup Event",
    "location": "Test Beach",
    "coordinates": {
        "lat": 40.7128,
        "lng": -74.0060
    },
    "date": "2025-11-01",
    "time": "10:00 AM",
    "participants": 1,
    "maxParticipants": 20,
    "description": "This is a test event to verify the API is working",
    "organizer": "Test User",
    "difficulty": "Easy",
    "imageUrl": "https://example.com/test.jpg",
    "timestamp": datetime.now().isoformat()
}

# Make the request
url = "http://localhost:8000/api/events/add"
print(f"Sending POST request to {url}")
print(f"Data: {json.dumps(test_event, indent=2)}")

try:
    response = requests.post(url, json=test_event)
    print(f"\nResponse Status Code: {response.status_code}")
    print(f"Response Body: {json.dumps(response.json(), indent=2)}")

    if response.status_code == 200:
        print("\n✓ SUCCESS! Event was added successfully!")
        print("Check your Google Sheets to verify the event was logged.")
    else:
        print("\n✗ FAILED! Event was not added.")

except Exception as e:
    print(f"\n✗ ERROR: {e}")
