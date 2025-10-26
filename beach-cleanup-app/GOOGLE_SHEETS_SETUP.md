# Google Sheets Integration Setup Guide

This guide will walk you through setting up the Google Sheets integration for your Beach Cleanup App, allowing you to automatically export user activity and data to a Google Spreadsheet.

## What Data Gets Exported?

The app automatically exports the following data to Google Sheets:

1. **User Registrations** - New user signups with profile information
2. **Events** - Cleanup event creations
3. **Event Participation** - When users join or leave events
4. **Groups** - Group creations
5. **Group Membership** - When users join or leave groups
6. **User Activities** - General user activities and stats
7. **Profile Updates** - User profile changes

## Step-by-Step Setup

### Step 1: Open Your Google Sheet

1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1Ac3belSC_McKYTwEZVIqVcbVNcDiP36em5i7E1qlb2s/edit
2. Make sure you have edit access to this sheet

### Step 2: Create the Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a code editor with a default `function myFunction() {}`
3. **Delete all existing code** in the editor
4. Open the file `google-apps-script/Code.gs` in your project
5. **Copy all the code** from `Code.gs`
6. **Paste it** into the Apps Script editor
7. Click the **Save** icon (or Ctrl+S / Cmd+S)
8. Name your project something like "Beach Cleanup Data Export"

### Step 3: Initialize the Sheet Tabs

Before deploying, let's set up all the sheet tabs with proper headers:

1. In the Apps Script editor, find the function dropdown at the top (it probably says "doPost")
2. Select **`initializeSheets`** from the dropdown
3. Click the **Run** button (▶️ play icon)
4. You'll be prompted to authorize the script:
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to Beach Cleanup Data Export (unsafe)**
   - Click **Allow**
5. Wait for the script to finish (you'll see "Execution completed" in the logs)
6. Go back to your Google Sheet and refresh - you should now see 7 new tabs with headers!

### Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Beach Cleanup Data Export API" (or any description)
   - **Execute as**: Select **Me** (your email)
   - **Who has access**: Select **Anyone** (this allows your app to send data)
     - *Note: The script will only write to YOUR specific sheet, so this is safe*
5. Click **Deploy**
6. Click **Authorize access** and allow permissions again if prompted
7. **IMPORTANT**: Copy the **Web app URL** that appears
   - It will look like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - Save this URL - you'll need it in the next step!

### Step 5: Configure Your App

1. Open your `.env` file in the beach-cleanup-app folder
2. Find the line that says:
   ```
   # VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
3. Uncomment it (remove the `#`) and replace with your actual Web App URL:
   ```
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz.../exec
   ```
4. Save the `.env` file
5. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 6: Test the Integration

1. Go to your running app
2. Try creating a test user registration
3. Check your Google Sheet - you should see a new row in the "User Registrations" tab!

If you see the data, congratulations! Your integration is working! 🎉

## Troubleshooting

### Data Not Appearing in Sheet

**Problem**: You completed an action but nothing shows in Google Sheets

**Solutions**:
1. Check your browser console (F12) for any errors
2. Verify the `VITE_GOOGLE_APPS_SCRIPT_URL` is set correctly in `.env`
3. Make sure you restarted your dev server after changing `.env`
4. Try running the `testAppendData` function in Apps Script to verify it's working

### "Script Unavailable" Error

**Problem**: Getting an error about script unavailable

**Solutions**:
1. Make sure you deployed as "Anyone" can access
2. Verify your Web App URL is correct
3. Try creating a new deployment

### Permission Denied

**Problem**: Apps Script says permission denied

**Solutions**:
1. Make sure you clicked "Advanced" → "Go to Beach Cleanup Data Export (unsafe)"
2. Verify you're using the same Google account that owns the sheet
3. Try removing permissions and re-authorizing

### Data Shows in Console But Not Sheet

**Problem**: Console logs show data being sent but sheet is empty

**Solutions**:
1. Check if the sheet tabs exist and have the correct names
2. Run `initializeSheets()` function again
3. Verify the Sheet ID in Code.gs matches your actual sheet ID

## Sheet Tab Structure

After initialization, your sheet will have these tabs:

### User Registrations
- Timestamp, User ID, Username, Email, Name, Location, Bio

### Events
- Timestamp, Event ID, Title, Location, Date, Time, Max Participants, Current Participants, Description, Organizer

### Event Participation
- Timestamp, Event ID, Event Title, User ID, Username, Action

### Groups
- Timestamp, Group ID, Name, Category, Location, Description, Members

### Group Membership
- Timestamp, Group ID, Group Name, User ID, Username, Action

### User Activities
- Timestamp, User ID, Username, Activity Type, Location, Distance, Trash Collected, Description

### Profile Updates
- Timestamp, User ID, Username, Location, Bio, Profile Picture URL

## Advanced Configuration

### Changing the Sheet ID

If you want to use a different Google Sheet:

1. Get the Sheet ID from the URL (the long string between `/d/` and `/edit`)
2. Update `SHEET_ID` in `google-apps-script/Code.gs`
3. Also update `SHEET_ID` in `src/services/googleSheets.js`
4. Create a new deployment and update your `.env` with the new URL

### Customizing Export Data

To add or modify what data gets exported:

1. Edit the export functions in `src/services/googleSheets.js`
2. Update the corresponding sheet headers in `google-apps-script/Code.gs` (in the `initializeSheets` function)
3. Run `initializeSheets()` again or manually update the sheet headers

### Disabling Exports

To temporarily disable exports without removing code:

1. Comment out or remove `VITE_GOOGLE_APPS_SCRIPT_URL` from `.env`
2. The app will log to console instead of sending to Google Sheets
3. Your app will continue to function normally

## Security Considerations

- The Apps Script Web App URL can be used by anyone who has it to write to your sheet
- Keep your Web App URL private (don't commit it to public repositories)
- The script only writes data; it cannot read or modify existing data
- Consider using Google Apps Script quotas and rate limiting for production use
- For production, consider implementing authentication/API keys

## Getting Help

If you run into issues:

1. Check the browser console for error messages
2. Check the Apps Script execution logs (View → Logs in Apps Script editor)
3. Verify all setup steps were completed
4. Test with the `testAppendData()` function in Apps Script

## Next Steps

Once your integration is working:

- Set up automated reports using Google Sheets formulas and charts
- Create pivot tables to analyze user behavior
- Export data to other tools for further analysis
- Set up email notifications for new signups or events using Apps Script triggers
