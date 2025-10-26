"""
Google Sheets Service
Handles direct interaction with Google Sheets API using service account credentials
"""
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import List, Dict, Any, Optional

class GoogleSheetsService:
    def __init__(self):
        """Initialize Google Sheets service with credentials from environment"""
        self.spreadsheet_id = os.getenv("VITE_GOOGLE_SHEETS_SPREADSHEET_ID")
        self.sheet_name = os.getenv("VITE_GOOGLE_SHEETS_SHEET_NAME", "Posts")
        self.service = None
        self._initialize_service()

    def _initialize_service(self):
        """Initialize the Google Sheets API service"""
        try:
            # Get service account credentials from environment
            project_id = os.getenv("FIREBASE_PROJECT_ID")
            private_key = os.getenv("FIREBASE_PRIVATE_KEY")
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL")

            if not all([project_id, private_key, client_email]):
                print("⚠️ Warning: Google service account credentials not fully configured")
                return

            # Create credentials object
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
            print("✅ Google Sheets service initialized successfully")

        except Exception as e:
            print(f"❌ Error initializing Google Sheets service: {e}")
            self.service = None

    def add_post(self, post_data: Dict[str, Any]) -> bool:
        """
        Add a new post to Google Sheets

        Args:
            post_data: Dictionary containing post information

        Returns:
            bool: True if successful, False otherwise
        """
        if not self.service:
            raise Exception("Google Sheets service not initialized")

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

            print(f"✅ Added post to Google Sheets: {result.get('updates', {}).get('updatedRows', 0)} row(s) added")
            return True

        except HttpError as error:
            print(f"❌ Google Sheets API error: {error}")
            raise Exception(f"Failed to add post to Google Sheets: {error}")
        except Exception as e:
            print(f"❌ Error adding post: {e}")
            raise

    def update_upvotes(self, post_id: str, upvotes: int) -> bool:
        """
        Update the upvotes for a specific post

        Args:
            post_id: The unique ID of the post
            upvotes: The new upvote count

        Returns:
            bool: True if successful, False otherwise
        """
        if not self.service:
            raise Exception("Google Sheets service not initialized")

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
            print(f"❌ Google Sheets API error: {error}")
            raise Exception(f"Failed to update upvotes: {error}")
        except Exception as e:
            print(f"❌ Error updating upvotes: {e}")
            raise

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
