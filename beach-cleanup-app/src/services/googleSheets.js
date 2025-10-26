/**
 * Google Sheets Integration Service
 *
 * This service handles exporting data from the beach cleanup app to Google Sheets.
 * Uses Google Sheets API v4 via Apps Script Web App deployment.
 *
 * Setup Instructions:
 * 1. Create a Google Apps Script project
 * 2. Deploy as web app with appropriate permissions
 * 3. Set the SCRIPT_URL in your environment variables
 */

// Your Google Sheet ID from the URL
const SHEET_ID = '1Ac3belSC_McKYTwEZVIqVcbVNcDiP36em5i7E1qlb2s';

// You'll need to create a Google Apps Script Web App and deploy it
// The script will handle writing to your sheet
const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

/**
 * Send data to Google Sheets via Apps Script Web App
 * @param {string} sheetName - Name of the sheet tab to write to
 * @param {Array} data - Array of row data to append
 */
const appendToSheet = async (sheetName, data) => {
  if (!APPS_SCRIPT_URL) {
    console.warn('Google Apps Script URL not configured. Data will be logged instead.');
    console.log(`Would append to sheet "${sheetName}":`, data);
    return { success: false, message: 'Apps Script URL not configured' };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheetId: SHEET_ID,
        sheetName: sheetName,
        data: data,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    throw error;
  }
};

/**
 * Export user registration data to Google Sheets
 * @param {Object} userData - User registration data
 */
export const exportUserRegistration = async (userData) => {
  const row = [
    new Date().toISOString(),
    userData.id,
    userData.username,
    userData.email,
    userData.name || '',
    userData.location || '',
    userData.bio || '',
  ];

  return await appendToSheet('User Registrations', [row]);
};

/**
 * Export event creation data to Google Sheets
 * @param {Object} eventData - Event data
 */
export const exportEventCreation = async (eventData) => {
  const row = [
    new Date().toISOString(),
    eventData.id,
    eventData.title,
    eventData.location,
    eventData.date,
    eventData.time,
    eventData.maxParticipants,
    eventData.participants || 0,
    eventData.description,
    eventData.organizer,
  ];

  return await appendToSheet('Events', [row]);
};

/**
 * Export event participation data (when users join/leave events)
 * @param {Object} participationData - Participation data
 */
export const exportEventParticipation = async (participationData) => {
  const row = [
    new Date().toISOString(),
    participationData.eventId,
    participationData.eventTitle,
    participationData.userId,
    participationData.username,
    participationData.action, // 'joined' or 'left'
  ];

  return await appendToSheet('Event Participation', [row]);
};

/**
 * Export group creation data to Google Sheets
 * @param {Object} groupData - Group data
 */
export const exportGroupCreation = async (groupData) => {
  const row = [
    new Date().toISOString(),
    groupData.id,
    groupData.name,
    groupData.category,
    groupData.location || '',
    groupData.description,
    groupData.members || 1,
  ];

  return await appendToSheet('Groups', [row]);
};

/**
 * Export group membership data (when users join/leave groups)
 * @param {Object} membershipData - Membership data
 */
export const exportGroupMembership = async (membershipData) => {
  const row = [
    new Date().toISOString(),
    membershipData.groupId,
    membershipData.groupName,
    membershipData.userId,
    membershipData.username,
    membershipData.action, // 'joined' or 'left'
  ];

  return await appendToSheet('Group Membership', [row]);
};

/**
 * Export user activity/stats data
 * @param {Object} activityData - Activity data
 */
export const exportUserActivity = async (activityData) => {
  const row = [
    new Date().toISOString(),
    activityData.userId,
    activityData.username,
    activityData.activityType,
    activityData.location || '',
    activityData.distance || '',
    activityData.trashCollected || '',
    activityData.description,
  ];

  return await appendToSheet('User Activities', [row]);
};

/**
 * Export user profile updates
 * @param {Object} profileData - Updated profile data
 */
export const exportProfileUpdate = async (profileData) => {
  const row = [
    new Date().toISOString(),
    profileData.userId,
    profileData.username,
    profileData.location || '',
    profileData.bio || '',
    profileData.profilePictureUrl || '',
  ];

  return await appendToSheet('Profile Updates', [row]);
};

/**
 * Batch export multiple records at once
 * @param {string} sheetName - Sheet name
 * @param {Array} records - Array of records to export
 */
export const batchExport = async (sheetName, records) => {
  return await appendToSheet(sheetName, records);
};

/**
 * Initialize sheet headers (call once to set up column headers)
 */
export const initializeSheetHeaders = async () => {
  const headers = {
    'User Registrations': [
      'Timestamp',
      'User ID',
      'Username',
      'Email',
      'Name',
      'Location',
      'Bio',
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
      'Organizer',
    ],
    'Event Participation': [
      'Timestamp',
      'Event ID',
      'Event Title',
      'User ID',
      'Username',
      'Action',
    ],
    'Groups': [
      'Timestamp',
      'Group ID',
      'Name',
      'Category',
      'Location',
      'Description',
      'Members',
    ],
    'Group Membership': [
      'Timestamp',
      'Group ID',
      'Group Name',
      'User ID',
      'Username',
      'Action',
    ],
    'User Activities': [
      'Timestamp',
      'User ID',
      'Username',
      'Activity Type',
      'Location',
      'Distance',
      'Trash Collected',
      'Description',
    ],
    'Profile Updates': [
      'Timestamp',
      'User ID',
      'Username',
      'Location',
      'Bio',
      'Profile Picture URL',
    ],
  };

  const results = {};
  for (const [sheetName, headerRow] of Object.entries(headers)) {
    results[sheetName] = await appendToSheet(sheetName, [headerRow]);
  }
  return results;
};

export default {
  exportUserRegistration,
  exportEventCreation,
  exportEventParticipation,
  exportGroupCreation,
  exportGroupMembership,
  exportUserActivity,
  exportProfileUpdate,
  batchExport,
  initializeSheetHeaders,
};
