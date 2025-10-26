/**
 * Google Apps Script for Beach Cleanup App
 * This script acts as a backend API for the React app to interact with Google Sheets
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Copy this code into Code.gs
 * 4. Update SPREADSHEET_ID with your Google Sheet ID
 * 5. Deploy as Web App:
 *    - Click Deploy > New deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and add it to your .env as VITE_GOOGLE_APPS_SCRIPT_URL
 */

// Your Google Sheet ID (found in the sheet URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Posts';

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const action = request.action;

    let result;

    switch (action) {
      case 'addPost':
        result = addPost(request.data);
        break;
      case 'updateUpvotes':
        result = updateUpvotes(request.postId, request.upvotes);
        break;
      default:
        result = { error: 'Invalid action' };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (optional - for testing)
 */
function doGet(e) {
  const posts = getAllPosts();

  return ContentService
    .createTextOutput(JSON.stringify({ posts }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Add a new post to the sheet
 */
function addPost(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  // If sheet doesn't exist, create it with headers
  if (!sheet) {
    const newSheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(SHEET_NAME);
    newSheet.appendRow(['ID', 'Username', 'Location', 'Date', 'Image URL', 'Caption', 'Trash Collected', 'Upvotes', 'Timestamp']);
  }

  const postSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  // Append the new row
  postSheet.appendRow([
    data.id,
    data.username,
    data.location,
    data.date,
    data.imageUrl,
    data.caption,
    data.trashCollected,
    data.upvotes || 0,
    data.timestamp
  ]);

  return {
    success: true,
    post: data
  };
}

/**
 * Update upvotes for a post
 */
function updateUpvotes(postId, upvotes) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // Find the row with matching post ID (column A)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === postId) {
      // Update upvotes (column H, index 7)
      sheet.getRange(i + 1, 8).setValue(upvotes);
      return {
        success: true,
        postId: postId,
        upvotes: upvotes
      };
    }
  }

  return {
    success: false,
    error: 'Post not found'
  };
}

/**
 * Get all posts (for testing)
 */
function getAllPosts() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  if (!sheet) {
    return [];
  }

  const data = sheet.getDataRange().getValues();
  const posts = [];

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    posts.push({
      id: data[i][0],
      username: data[i][1],
      location: data[i][2],
      date: data[i][3],
      imageUrl: data[i][4],
      caption: data[i][5],
      trashCollected: data[i][6],
      upvotes: data[i][7],
      timestamp: data[i][8]
    });
  }

  return posts;
}
