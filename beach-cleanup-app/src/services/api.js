/**
 * API Service Layer
 * Centralized API calls following industry-standard patterns
 */

// Base API URL - should be in environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * API service object with all endpoints
 */
const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    register: (userData) => fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
    verifyToken: () => fetchAPI('/auth/verify'),
  },

  // User endpoints
  users: {
    // Get current user's profile
    getMe: () => fetchAPI('/users/me'),
    // Update current user's profile
    updateMe: (updates) => fetchAPI('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
    // Get any user's public profile
    getProfile: (userId) => fetchAPI(`/users/${userId}`),
    // Legacy endpoints - may need backend implementation
    updateProfile: (userId, updates) => fetchAPI(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
    getStats: (userId) => fetchAPI(`/users/${userId}/stats`),
    getActivities: (userId) => fetchAPI(`/users/${userId}/activities`),
    getAchievements: (userId) => fetchAPI(`/users/${userId}/achievements`),
  },

  // Events endpoints
  events: {
    getAll: (params) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchAPI(`/events?${queryString}`);
    },
    getById: (eventId) => fetchAPI(`/events/${eventId}`),
    create: (eventData) => fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
    update: (eventId, updates) => fetchAPI(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
    delete: (eventId) => fetchAPI(`/events/${eventId}`, {
      method: 'DELETE',
    }),
    join: (eventId) => fetchAPI(`/events/${eventId}/join`, {
      method: 'POST',
    }),
    leave: (eventId) => fetchAPI(`/events/${eventId}/leave`, {
      method: 'POST',
    }),
  },

  // Groups endpoints
  groups: {
    getAll: (params) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchAPI(`/groups?${queryString}`);
    },
    getById: (groupId) => fetchAPI(`/groups/${groupId}`),
    create: (groupData) => fetchAPI('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    }),
    update: (groupId, updates) => fetchAPI(`/groups/${groupId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
    delete: (groupId) => fetchAPI(`/groups/${groupId}`, {
      method: 'DELETE',
    }),
    join: (groupId) => fetchAPI(`/groups/${groupId}/join`, {
      method: 'POST',
    }),
    leave: (groupId) => fetchAPI(`/groups/${groupId}/leave`, {
      method: 'POST',
    }),
    getMembers: (groupId) => fetchAPI(`/groups/${groupId}/members`),
  },

  // Activity feed endpoints
  activities: {
    getFeed: (params) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchAPI(`/activities?${queryString}`);
    },
    create: (activityData) => fetchAPI('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    }),
  },

  // Leaderboard endpoints
  leaderboard: {
    getGlobal: (params) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchAPI(`/leaderboard/global?${queryString}`);
    },
    getLocal: (params) => {
      const queryString = new URLSearchParams(params).toString();
      return fetchAPI(`/leaderboard/local?${queryString}`);
    },
  },
};

export default api;
