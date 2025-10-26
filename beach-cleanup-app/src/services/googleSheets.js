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
    console.log('📡 Fetching posts from Google Sheets...');
    console.log('Config:', {
      SPREADSHEET_ID,
      SHEET_NAME,
      API_KEY_SET: !!GOOGLE_SHEETS_API_KEY,
    });

    if (!GOOGLE_SHEETS_API_KEY) {
      console.error('❌ Google Sheets API Key not configured!');
      return [];
    }

    if (!SPREADSHEET_ID) {
      console.error('❌ Spreadsheet ID not configured!');
      return [];
    }

    // For now, we'll use a simple GET request with API key
    // In production, you might want to use OAuth 2.0 for better security
    const range = `${SHEET_NAME}!A2:I1000`; // Assuming headers in row 1, data from row 2
    const url = `${SHEETS_API_BASE}/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;

    console.log('🔗 Request URL:', url.replace(GOOGLE_SHEETS_API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url);

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📊 Raw data from Google Sheets:', data);

    if (!data.values || data.values.length === 0) {
      console.log('ℹ️ No posts found in Google Sheet');
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

    console.log(`✅ Successfully fetched ${posts.length} posts from database`);

    // Sort by timestamp (newest first)
    return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('❌ Error fetching posts from Google Sheets:', error);
    console.error('Error details:', error.message);
    // Return empty array to allow graceful fallback
    return [];
  }
};

/**
 * Add a new post to Google Sheets
 * Routes through Python backend to avoid CORS issues
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

    console.log('📝 Attempting to add post to Google Sheets via backend...');
    console.log('Post data:', newPost);

    // Use backend API endpoint (proxied through Vite)
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('❌ Backend API Error:', errorData);
      throw new Error(errorData.detail || 'Failed to add post');
    }

    const result = await response.json();
    console.log('✅ Backend response:', result);

    // Also save to localStorage as backup
    addPostLocalStorage(newPost);

    console.log('✅ Post added successfully! Check your Google Sheet.');
    return newPost;
  } catch (error) {
    console.error('❌ Error adding post to Google Sheets:', error);
    console.log('📦 Falling back to localStorage...');
    // Fallback to local storage
    const savedPost = addPostLocalStorage(postData);
    return savedPost;
  }
};

/**
 * Update upvotes for a post
 * Routes through Python backend to avoid CORS issues
 */
export const updateUpvotes = async (postId, newUpvoteCount) => {
  try {
    // Use backend API endpoint (proxied through Vite)
    const response = await fetch('/api/posts/upvote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        upvotes: newUpvoteCount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to update upvotes');
    }

    const result = await response.json();

    // Also update localStorage
    updateUpvotesLocalStorage(postId, newUpvoteCount);

    return result;
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

// ============================================================================
// EVENTS - Google Sheets Integration
// ============================================================================

/**
 * Fetch all events from Google Sheets
 * Routes through Python backend
 */
export const fetchEvents = async () => {
  try {
    console.log('📡 Fetching events from Google Sheets via backend...');

    const response = await fetch('/api/events/all');

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('❌ Backend API Error:', errorData);
      throw new Error(errorData.detail || 'Failed to fetch events');
    }

    const result = await response.json();
    console.log('📊 Events data:', result);

    const events = result.data || [];
    console.log(`✅ Successfully fetched ${events.length} events from database`);

    // Sort by date (newest first)
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('❌ Error fetching events from Google Sheets:', error);
    console.log('📦 Falling back to localStorage...');
    return fetchEventsLocalStorage();
  }
};

/**
 * Add a new event to Google Sheets
 * Routes through Python backend to avoid CORS issues
 */
export const addEvent = async (eventData) => {
  try {
    // Generate unique ID
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newEvent = {
      id,
      title: eventData.title,
      location: eventData.location,
      coordinates: eventData.coordinates || null,
      date: eventData.date,
      time: eventData.time,
      participants: eventData.participants || 1,
      maxParticipants: eventData.maxParticipants,
      description: eventData.description,
      organizer: eventData.organizer || 'You',
      difficulty: eventData.difficulty || 'Easy',
      imageUrl: eventData.imageUrl || '',
      timestamp: eventData.timestamp || new Date().toISOString(),
    };

    console.log('📝 Attempting to add event to Google Sheets via backend...');
    console.log('Event data:', newEvent);

    // Use backend API endpoint (proxied through Vite)
    const response = await fetch('/api/events/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('❌ Backend API Error:', errorData);
      throw new Error(errorData.detail || 'Failed to add event');
    }

    const result = await response.json();
    console.log('✅ Backend response:', result);

    // Also save to localStorage as backup
    addEventLocalStorage(newEvent);

    console.log('✅ Event added successfully! Check your Google Sheet.');
    return newEvent;
  } catch (error) {
    console.error('❌ Error adding event to Google Sheets:', error);
    console.log('📦 Falling back to localStorage...');
    // Fallback to local storage
    const savedEvent = addEventLocalStorage(eventData);
    return savedEvent;
  }
};

/**
 * Update participant count for an event
 * Routes through Python backend to avoid CORS issues
 */
export const updateEventParticipants = async (eventId, newParticipantCount) => {
  try {
    // Use backend API endpoint (proxied through Vite)
    const response = await fetch('/api/events/update-participants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        participants: newParticipantCount,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to update participants');
    }

    const result = await response.json();

    // Also update localStorage
    updateEventParticipantsLocalStorage(eventId, newParticipantCount);

    return result;
  } catch (error) {
    console.error('Error updating event participants:', error);
    return updateEventParticipantsLocalStorage(eventId, newParticipantCount);
  }
};

// Local storage fallback functions for events
const addEventLocalStorage = (eventData) => {
  const events = JSON.parse(localStorage.getItem('cleanupEvents') || '[]');
  const newEvent = {
    ...eventData,
    id: eventData.id || `event-${Date.now()}`,
  };
  events.unshift(newEvent);
  localStorage.setItem('cleanupEvents', JSON.stringify(events));
  return newEvent;
};

const updateEventParticipantsLocalStorage = (eventId, participants) => {
  const events = JSON.parse(localStorage.getItem('cleanupEvents') || '[]');
  const eventIndex = events.findIndex(e => e.id === eventId);

  if (eventIndex !== -1) {
    events[eventIndex].participants = participants;
    localStorage.setItem('cleanupEvents', JSON.stringify(events));
  }

  return { success: true };
};

/**
 * Fetch events from local storage (fallback when Google Sheets is unavailable)
 */
export const fetchEventsLocalStorage = () => {
  try {
    const events = JSON.parse(localStorage.getItem('cleanupEvents') || '[]');
    return events;
  } catch (error) {
    console.error('Error fetching events from local storage:', error);
    return [];
  }
};
