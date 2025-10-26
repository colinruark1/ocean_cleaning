/**
 * Google Maps Configuration
 * Handles API key selection based on platform
 */

import { Capacitor } from '@capacitor/core';

/**
 * Get the appropriate Google Maps API key for the current platform
 * @returns {string} The API key for the current platform
 */
export const getGoogleMapsApiKey = () => {
  const platform = Capacitor.getPlatform();

  // On Android app, use the Android-specific key
  if (platform === 'android') {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY_ANDROID || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  }

  // On iOS app, use iOS-specific key (if you create one later)
  if (platform === 'ios') {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY_IOS || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  }

  // On web (localhost or deployed), use web key
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY_WEB || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
};

/**
 * Check if Google Maps API key is configured
 * @returns {boolean} True if API key exists
 */
export const hasGoogleMapsApiKey = () => {
  const apiKey = getGoogleMapsApiKey();
  return Boolean(apiKey && apiKey.length > 0);
};

/**
 * Map configuration options
 */
export const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  gestureHandling: 'cooperative',
};

/**
 * Default map center (Santa Monica Pier)
 */
export const defaultCenter = {
  lat: 34.0195,
  lng: -118.4912,
};

export default {
  getGoogleMapsApiKey,
  hasGoogleMapsApiKey,
  mapOptions,
  defaultCenter,
};
