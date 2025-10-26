/**
 * Google Apps Script for Beach Cleanup App Data Export
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Ac3belSC_McKYTwEZVIqVcbVNcDiP36em5i7E1qlb2s/edit
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Save the project (name it something like "Beach Cleanup Data Export")
 * 5. Click Deploy > New Deployment
 * 6. Select "Web app" as deployment type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone" (or restrict as needed)
 * 9. Click Deploy and authorize the app
 * 10. Copy the Web App URL and add it to your .env file as VITE_GOOGLE_APPS_SCRIPT_URL
 */

/**
 * Handle POST requests from the web app
 */
function doPost(e) {
  try {
    // Parse the request body
    const data = JSON.parse(e.postData.contents);
    const sheetId = data.sheetId;
    const sheetName = data.sheetName;
    const rows = data.data;

    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(sheetId);

    // Get or create the sheet
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    // Append the rows
    if (rows && rows.length > 0) {
      rows.forEach(row => {
        sheet.appendRow(row);
      });
    }

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: `Successfully added ${rows.length} row(s) to ${sheetName}`,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'Beach Cleanup App Data Export API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Initialize all sheet tabs with headers
 * Run this function manually once to set up your sheets
 */
function initializeSheets() {
  const sheetId = '1Ac3belSC_McKYTwEZVIqVcbVNcDiP36em5i7E1qlb2s';
  const spreadsheet = SpreadsheetApp.openById(sheetId);

  const sheets = {
    'User Registrations': [
      'Timestamp',
      'User ID',
      'Username',
      'Email',
      'Name',
      'Location',
      'Bio'
    ],
    'Events': [
      'Timestamp',
      'Event ID',
      'Title',
      'Location',
      'Date',
      'Time',
      'Max Participants',
      'Current Participants',
      'Description',
      'Organizer'
    ],
    'Event Participation': [
      'Timestamp',
      'Event ID',
      'Event Title',
      'User ID',
      'Username',
      'Action'
    ],
    'Groups': [
      'Timestamp',
      'Group ID',
      'Name',
      'Category',
      'Location',
      'Description',
      'Members'
    ],
    'Group Membership': [
      'Timestamp',
      'Group ID',
      'Group Name',
      'User ID',
      'Username',
      'Action'
    ],
    'User Activities': [
      'Timestamp',
      'User ID',
      'Username',
      'Activity Type',
      'Location',
      'Distance',
      'Trash Collected',
      'Description'
    ],
    'Profile Updates': [
      'Timestamp',
      'User ID',
      'Username',
      'Location',
      'Bio',
      'Profile Picture URL'
    ]
  };

  // Create each sheet with headers
  for (const [sheetName, headers] of Object.entries(sheets)) {
    let sheet = spreadsheet.getSheetByName(sheetName);

    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    // Check if sheet is empty before adding headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);

      // Format the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');

      // Auto-resize columns
      for (let i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
      }

      // Freeze header row
      sheet.setFrozenRows(1);
    }
  }

  Logger.log('Sheets initialized successfully!');
}

/**
 * Test function to verify the script works
 * Run this manually to test
 */
function testAppendData() {
  const testData = {
    sheetId: '1Ac3belSC_McKYTwEZVIqVcbVNcDiP36em5i7E1qlb2s',
    sheetName: 'User Registrations',
    data: [[
      new Date().toISOString(),
      'test-user-id',
      'testuser',
      'test@example.com',
      'Test User',
      'Test Location',
      'This is a test bio'
    ]]
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
