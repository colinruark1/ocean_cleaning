/**
 * Google Sheets API Service
 * Handles all interactions with Google Sheets as a database
 *
 * Setup Instructions:
 * 1. Create a Google Sheet with columns: id, username, location, date, imageUrl, caption, trashCollected, upvotes, timestamp
 * 2. Go to Google Cloud Console and create a new project
 * 3. Enable Google Sheets API
 * 4. Create credentials (API Key for public read, or OAuth 2.0 for write access)
 * 5. Share your Google Sheet with the service account email (if using service account)
 * 6. Add your credentials to .env file
 */

const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEETS_SHEET_NAME || 'Posts';

// Google Sheets API base URL
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Fetch all posts from Google Sheets
 */
export const fetchPosts = async () => {
  try {
    // For now, we'll use a simple GET request with API key
    // In production, you might want to use OAuth 2.0 for better security
    const range = `${SHEET_NAME}!A2:I1000`; // Assuming headers in row 1, data from row 2
    const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      return [];
    }

    // Convert rows to post objects
    const posts = data.values.map((row, index) => ({
      id: row[0] || `post-${index}`,
      username: row[1] || 'Anonymous',
      location: row[2] || 'Unknown',
      date: row[3] || 'Recently',
      imageUrl: row[4] || '',
      caption: row[5] || '',
      trashCollected: row[6] || '0 lbs',
      upvotes: parseInt(row[7]) || 0,
      timestamp: row[8] || new Date().toISOString(),
    }));

    // Sort by timestamp (newest first)
    return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error fetching posts from Google Sheets:', error);
    // Return empty array to allow graceful fallback
    return [];
  }
};

/**
 * Add a new post to Google Sheets
 * Note: This requires Apps Script Web App or OAuth 2.0
 */
export const addPost = async (postData) => {
  try {
    // Generate unique ID
    const id = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newPost = {
      id,
      username: postData.username,
      location: postData.location,
      date: postData.date,
      imageUrl: postData.imageUrl,
      caption: postData.caption,
      trashCollected: postData.trashCollected,
      upvotes: postData.upvotes || 0,
      timestamp: postData.timestamp || new Date().toISOString(),
    };

    // We'll use Google Apps Script Web App as a proxy for writing data
    // This avoids CORS issues and simplifies authentication
    const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      console.warn('Google Apps Script URL not configured. Using local storage fallback.');
      return addPostLocalStorage(newPost);
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addPost',
        data: newPost,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add post: ${response.statusText}`);
    }

    const result = await response.json();
    return result.post || newPost;
  } catch (error) {
    console.error('Error adding post to Google Sheets:', error);
    // Fallback to local storage
    return addPostLocalStorage(postData);
  }
};

/**
 * Update upvotes for a post
 */
export const updateUpvotes = async (postId, newUpvoteCount) => {
  try {
    const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {
      return updateUpvotesLocalStorage(postId, newUpvoteCount);
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateUpvotes',
        postId,
        upvotes: newUpvoteCount,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update upvotes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating upvotes:', error);
    return updateUpvotesLocalStorage(postId, newUpvoteCount);
  }
};

// Local storage fallback functions
const addPostLocalStorage = (postData) => {
  const posts = JSON.parse(localStorage.getItem('cleanupPosts') || '[]');
  const newPost = {
    ...postData,
    id: postData.id || `post-${Date.now()}`,
  };
  posts.unshift(newPost);
  localStorage.setItem('cleanupPosts', JSON.stringify(posts));
  return newPost;
};

const updateUpvotesLocalStorage = (postId, upvotes) => {
  const posts = JSON.parse(localStorage.getItem('cleanupPosts') || '[]');
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex !== -1) {
    posts[postIndex].upvotes = upvotes;
    localStorage.setItem('cleanupPosts', JSON.stringify(posts));
  }

  return { success: true };
};

/**
 * Fetch posts from local storage (fallback when Google Sheets is unavailable)
 */
export const fetchPostsLocalStorage = () => {
  try {
    const posts = JSON.parse(localStorage.getItem('cleanupPosts') || '[]');
    return posts;
  } catch (error) {
    console.error('Error fetching posts from local storage:', error);
    return [];
  }
};
