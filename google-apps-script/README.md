# Google Apps Script Setup Guide

This Google Apps Script acts as a backend API for the Beach Cleanup App to write data to Google Sheets.

## Why Google Apps Script?

- **Avoids CORS issues**: Apps Script runs on Google's servers, not in the browser
- **Simplified authentication**: No need for complex OAuth flows in the frontend
- **Free**: No server costs, runs on Google's infrastructure
- **Secure**: Your API key isn't exposed in the frontend code

## Setup Instructions

### 1. Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Beach Cleanup Posts" (or any name you prefer)
4. Create a sheet named **"Posts"** (must match the `SHEET_NAME` in Code.gs)
5. Add these column headers in **row 1**:
   - Column A: `ID`
   - Column B: `Username`
   - Column C: `Location`
   - Column D: `Date`
   - Column E: `Image URL`
   - Column F: `Caption`
   - Column G: `Trash Collected`
   - Column H: `Upvotes`
   - Column I: `Timestamp`

6. Copy your spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit
   ```

### 2. Create the Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New project"**
3. Name your project (e.g., "Beach Cleanup API")
4. Delete the default code
5. Copy and paste the contents of `Code.gs` from this folder
6. **Important**: Update line 16 with your spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```

### 3. Deploy as Web App

1. Click **"Deploy"** > **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure the deployment:
   - **Description**: "Beach Cleanup API v1"
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone**
5. Click **"Deploy"**
6. **Authorize the script**:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to [Your Project Name] (unsafe)"
   - Click "Allow"
7. Copy the **Web App URL** (it will look like):
   ```
   https://script.google.com/macros/s/SOME_LONG_ID/exec
   ```

### 4. Add the URL to Your App

1. Open your Beach Cleanup App project
2. Create a `.env` file (copy from `.env.example`)
3. Add the Web App URL:
   ```
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```
4. Restart your development server

### 5. Test Your Setup

1. Open your Beach Cleanup App
2. Click the "Share Post" button
3. Fill out the form and submit
4. Check your Google Sheet - the new post should appear!

## API Endpoints

The Apps Script provides these endpoints:

### Add a Post (POST)
```javascript
{
  "action": "addPost",
  "data": {
    "id": "post-123",
    "username": "John Doe",
    "location": "Santa Monica Beach",
    "date": "Oct 25",
    "imageUrl": "https://...",
    "caption": "Great cleanup today!",
    "trashCollected": "45 lbs",
    "upvotes": 0,
    "timestamp": "2025-10-25T12:00:00Z"
  }
}
```

### Update Upvotes (POST)
```javascript
{
  "action": "updateUpvotes",
  "postId": "post-123",
  "upvotes": 42
}
```

### Get All Posts (GET)
Simply make a GET request to the Web App URL (for testing):
```
https://script.google.com/macros/s/YOUR_ID/exec
```

## Troubleshooting

### "Authorization required" error
- Make sure you've authorized the script during deployment
- Redeploy if needed and authorize again

### Posts not appearing in Google Sheet
- Check that your `SPREADSHEET_ID` in Code.gs matches your actual sheet
- Verify the sheet is named "Posts" (case-sensitive)
- Check the Apps Script execution log: Run > Executions

### CORS errors
- Make sure you're using the Web App URL, not the script URL
- The Web App URL should end with `/exec`, not `/edit`

### Permission denied
- Make sure "Who has access" is set to "Anyone"
- Try creating a new deployment

## Security Notes

- The "Anyone" access level means anyone with the URL can write to your sheet
- This is acceptable for a public community app
- For production, consider:
  - Adding rate limiting
  - Implementing spam detection
  - Using OAuth 2.0 for authenticated writes

## Updating Your Script

If you need to make changes:
1. Edit the code in Apps Script
2. Click **"Deploy"** > **"Manage deployments"**
3. Click the pencil icon ✏️ next to your deployment
4. Change "Version" to "New version"
5. Click **"Deploy"**

The URL stays the same, so no need to update your `.env` file!
