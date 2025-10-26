"""
Google Sheets Service
Handles direct interaction with Google Sheets API using service account credentials
Falls back to Google Apps Script if API is not available
"""
import os
import httpx
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import List, Dict, Any, Optional

class GoogleSheetsService:
    def __init__(self):
        """Initialize Google Sheets service with credentials from environment"""
        self.spreadsheet_id = os.getenv("VITE_GOOGLE_SHEETS_SPREADSHEET_ID")
        self.sheet_name = os.getenv("VITE_GOOGLE_SHEETS_SHEET_NAME", "Posts")
        self.apps_script_url = os.getenv("VITE_GOOGLE_APPS_SCRIPT_URL")
        self.service = None
        self._initialize_service()

    def _initialize_service(self):
        """Initialize the Google Sheets API service"""
        try:
            # Option 1: Try to load from JSON file first
            service_account_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE")
            if not service_account_file:
                # Default location in server_py directory
                service_account_file = os.path.join(
                    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                    "ocean-cleanup-service-account.json"
                )

            if os.path.exists(service_account_file):
                print(f"📄 Loading service account from: {service_account_file}")
                credentials = service_account.Credentials.from_service_account_file(
                    service_account_file,
                    scopes=['https://www.googleapis.com/auth/spreadsheets']
                )
                self.service = build('sheets', 'v4', credentials=credentials)
                print("✅ Google Sheets service initialized successfully (from JSON file)")
                return

            # Option 2: Fall back to environment variables
            project_id = os.getenv("FIREBASE_PROJECT_ID")
            private_key = os.getenv("FIREBASE_PRIVATE_KEY")
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL")

            if not all([project_id, private_key, client_email]):
                print("⚠️ Warning: Google service account credentials not fully configured")
                return

            # Create credentials object from env vars
            credentials_info = {
                "type": "service_account",
                "project_id": project_id,
                "private_key": private_key.replace('\\n', '\n'),  # Fix newlines in key
                "client_email": client_email,
                "token_uri": "https://oauth2.googleapis.com/token",
            }

            credentials = service_account.Credentials.from_service_account_info(
                credentials_info,
                scopes=['https://www.googleapis.com/auth/spreadsheets']
            )

            # Build the service
            self.service = build('sheets', 'v4', credentials=credentials)
            print("✅ Google Sheets service initialized successfully (from env vars)")

        except Exception as e:
            print(f"❌ Error initializing Google Sheets service: {e}")
            self.service = None

    def add_post(self, post_data: Dict[str, Any]) -> bool:
        """
        Add a new post to Google Sheets
        Falls back to Google Apps Script if direct API fails

        Args:
            post_data: Dictionary containing post information

        Returns:
            bool: True if successful, False otherwise
        """
        # Try Google Sheets API first if available
        if self.service:
            try:
                # Prepare the row data in the correct order
                # Columns: id, username, location, date, imageUrl, caption, trashCollected, upvotes, timestamp
                row = [
                    post_data.get('id', ''),
                    post_data.get('username', ''),
                    post_data.get('location', ''),
                    post_data.get('date', ''),
                    post_data.get('imageUrl', ''),
                    post_data.get('caption', ''),
                    post_data.get('trashCollected', ''),
                    post_data.get('upvotes', 0),
                    post_data.get('timestamp', ''),
                ]

                # Append to the sheet
                range_name = f"{self.sheet_name}!A:I"
                body = {
                    'values': [row]
                }

                result = self.service.spreadsheets().values().append(
                    spreadsheetId=self.spreadsheet_id,
                    range=range_name,
                    valueInputOption='RAW',
                    insertDataOption='INSERT_ROWS',
                    body=body
                ).execute()

                print(f"✅ Added post to Google Sheets via API: {result.get('updates', {}).get('updatedRows', 0)} row(s) added")
                return True

            except HttpError as error:
                error_str = str(error)
                # Check if it's a SERVICE_DISABLED error (API not enabled)
                if "SERVICE_DISABLED" in error_str or "API has not been used" in error_str:
                    print(f"⚠️ Google Sheets API is disabled, falling back to Apps Script...")
                    return self._add_post_via_apps_script(post_data)
                else:
                    print(f"❌ Google Sheets API error: {error}")
                    raise Exception(f"Failed to add post to Google Sheets: {error}")
            except Exception as e:
                print(f"❌ Error adding post via API: {e}")
                raise
        else:
            # No service available, try Apps Script
            print("ℹ️ Google Sheets API service not initialized, using Apps Script...")
            return self._add_post_via_apps_script(post_data)

    def _add_post_via_apps_script(self, post_data: Dict[str, Any]) -> bool:
        """
        Add a post using Google Apps Script Web App

        Args:
            post_data: Dictionary containing post information

        Returns:
            bool: True if successful, False otherwise
        """
        if not self.apps_script_url:
            raise Exception("Google Apps Script URL not configured")

        try:
            # Use httpx to make the request (follow redirects for Google Apps Script)
            with httpx.Client(follow_redirects=True) as client:
                response = client.post(
                    self.apps_script_url,
                    json={
                        "action": "addPost",
                        "data": post_data
                    },
                    timeout=30.0
                )

                if response.status_code != 200:
                    raise Exception(f"Apps Script returned status {response.status_code}: {response.text}")

                result = response.json()
                if result.get("success"):
                    print(f"✅ Added post to Google Sheets via Apps Script")
                    return True
                else:
                    raise Exception(f"Apps Script error: {result.get('error', 'Unknown error')}")

        except Exception as e:
            print(f"❌ Error adding post via Apps Script: {e}")
            raise Exception(f"Failed to add post via Apps Script: {e}")

    def update_upvotes(self, post_id: str, upvotes: int) -> bool:
        """
        Update the upvotes for a specific post
        Falls back to Google Apps Script if direct API fails

        Args:
            post_id: The unique ID of the post
            upvotes: The new upvote count

        Returns:
            bool: True if successful, False otherwise
        """
        # Try Google Sheets API first if available
        if self.service:
            try:
                # First, find the row with this post_id
                range_name = f"{self.sheet_name}!A:I"
                result = self.service.spreadsheets().values().get(
                    spreadsheetId=self.spreadsheet_id,
                    range=range_name
                ).execute()

                values = result.get('values', [])

                # Find the row index (skip header row)
                row_index = None
                for i, row in enumerate(values):
                    if i == 0:  # Skip header
                        continue
                    if len(row) > 0 and row[0] == post_id:
                        row_index = i + 1  # +1 because sheets are 1-indexed
                        break

                if row_index is None:
                    raise Exception(f"Post with ID {post_id} not found")

                # Update the upvotes column (column H, index 7)
                update_range = f"{self.sheet_name}!H{row_index}"
                body = {
                    'values': [[upvotes]]
                }

                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=update_range,
                    valueInputOption='RAW',
                    body=body
                ).execute()

                print(f"✅ Updated upvotes for post {post_id} to {upvotes}")
                return True

            except HttpError as error:
                error_str = str(error)
                # Check if it's a SERVICE_DISABLED error (API not enabled)
                if "SERVICE_DISABLED" in error_str or "API has not been used" in error_str:
                    print(f"⚠️ Google Sheets API is disabled, falling back to Apps Script...")
                    return self._update_upvotes_via_apps_script(post_id, upvotes)
                else:
                    print(f"❌ Google Sheets API error: {error}")
                    raise Exception(f"Failed to update upvotes: {error}")
            except Exception as e:
                print(f"❌ Error updating upvotes via API: {e}")
                raise
        else:
            # No service available, try Apps Script
            print("ℹ️ Google Sheets API service not initialized, using Apps Script...")
            return self._update_upvotes_via_apps_script(post_id, upvotes)

    def _update_upvotes_via_apps_script(self, post_id: str, upvotes: int) -> bool:
        """
        Update upvotes using Google Apps Script Web App

        Args:
            post_id: The unique ID of the post
            upvotes: The new upvote count

        Returns:
            bool: True if successful, False otherwise
        """
        if not self.apps_script_url:
            raise Exception("Google Apps Script URL not configured")

        try:
            # Use httpx to make the request (follow redirects for Google Apps Script)
            with httpx.Client(follow_redirects=True) as client:
                response = client.post(
                    self.apps_script_url,
                    json={
                        "action": "updateUpvotes",
                        "postId": post_id,
                        "upvotes": upvotes
                    },
                    timeout=30.0
                )

                if response.status_code != 200:
                    raise Exception(f"Apps Script returned status {response.status_code}: {response.text}")

                result = response.json()
                if result.get("success"):
                    print(f"✅ Updated upvotes for post {post_id} to {upvotes} via Apps Script")
                    return True
                else:
                    raise Exception(f"Apps Script error: {result.get('error', 'Unknown error')}")

        except Exception as e:
            print(f"❌ Error updating upvotes via Apps Script: {e}")
            raise Exception(f"Failed to update upvotes via Apps Script: {e}")

    def get_all_posts(self) -> List[Dict[str, Any]]:
        """
        Fetch all posts from Google Sheets

        Returns:
            List of post dictionaries
        """
        if not self.service:
            raise Exception("Google Sheets service not initialized")

        try:
            range_name = f"{self.sheet_name}!A2:I1000"  # Skip header row
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_name
            ).execute()

            values = result.get('values', [])

            posts = []
            for row in values:
                if len(row) > 0:  # Skip empty rows
                    post = {
                        'id': row[0] if len(row) > 0 else '',
                        'username': row[1] if len(row) > 1 else 'Anonymous',
                        'location': row[2] if len(row) > 2 else 'Unknown',
                        'date': row[3] if len(row) > 3 else 'Recently',
                        'imageUrl': row[4] if len(row) > 4 else '',
                        'caption': row[5] if len(row) > 5 else '',
                        'trashCollected': row[6] if len(row) > 6 else '0 lbs',
                        'upvotes': int(row[7]) if len(row) > 7 and row[7] else 0,
                        'timestamp': row[8] if len(row) > 8 else '',
                    }
                    posts.append(post)

            print(f"✅ Fetched {len(posts)} posts from Google Sheets")
            return posts

        except HttpError as error:
            print(f"❌ Google Sheets API error: {error}")
            raise Exception(f"Failed to fetch posts: {error}")
        except Exception as e:
            print(f"❌ Error fetching posts: {e}")
            raise


# Create a singleton instance
sheets_service = GoogleSheetsService()
