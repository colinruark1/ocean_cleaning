/**
 * Application constants
 */

// App configuration
export const APP_NAME = 'OceanClean';
export const APP_DESCRIPTION = 'Join the movement to protect our oceans through community beach cleanups';

// API configuration
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Event difficulty levels
export const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard'];

// Group categories
export const GROUP_CATEGORIES = [
  'Local Community',
  'Environmental',
  'Youth',
  'Corporate',
  'Educational',
];

// Achievement types
export const ACHIEVEMENT_TYPES = {
  CLEANUP_COUNT: 'cleanup_count',
  TRASH_COLLECTED: 'trash_collected',
  DISTANCE_COVERED: 'distance_covered',
  EVENTS_ORGANIZED: 'events_organized',
  GROUPS_JOINED: 'groups_joined',
};

// Activity types
export const ACTIVITY_TYPES = {
  CLEANUP: 'cleanup',
  EVENT_JOIN: 'event_join',
  EVENT_CREATE: 'event_create',
  GROUP_JOIN: 'group_join',
  GROUP_CREATE: 'group_create',
  ACHIEVEMENT: 'achievement',
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Date formats
export const DATE_FORMATS = {
  FULL: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  SHORT: { year: 'numeric', month: 'short', day: 'numeric' },
  TIME: { hour: '2-digit', minute: '2-digit' },
};

// Color gradients for groups
export const GROUP_GRADIENTS = {
  ocean: 'from-ocean-400 to-ocean-600',
  beach: 'from-yellow-400 to-orange-500',
  youth: 'from-purple-400 to-pink-500',
  corporate: 'from-blue-500 to-indigo-600',
  default: 'from-ocean-400 to-ocean-600',
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  EVENTS: '/events',
  GROUPS: '/groups',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Event created successfully!',
  EVENT_JOINED: 'You have joined the event!',
  GROUP_CREATED: 'Group created successfully!',
  GROUP_JOINED: 'You have joined the group!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Validation rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_EVENT_TITLE_LENGTH: 5,
  MAX_EVENT_TITLE_LENGTH: 100,
};
