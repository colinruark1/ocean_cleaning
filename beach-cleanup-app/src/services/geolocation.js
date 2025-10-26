import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

/**
 * Geolocation Service
 * Handles device location tracking with Capacitor for both web and mobile
 */

/**
 * Check if we're running in a native mobile environment
 * @returns {boolean}
 */
const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Check if location permissions are granted
 * @returns {Promise<boolean>} Whether permission is granted
 */
export const checkLocationPermission = async () => {
  try {
    if (isNativePlatform()) {
      const permission = await Geolocation.checkPermissions();
      return permission.location === 'granted';
    } else {
      // In browser, we can't check permissions directly
      // The permission prompt will appear when we request location
      return true;
    }
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

/**
 * Request location permissions from the user
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestLocationPermission = async () => {
  try {
    if (isNativePlatform()) {
      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    } else {
      // In browser, permissions are requested automatically when calling getCurrentPosition
      return true;
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get the user's current position
 * @returns {Promise<{lat: number, lng: number} | null>} Current coordinates or null if failed
 */
export const getCurrentPosition = async () => {
  try {
    // Use browser's native Geolocation API on web (it handles permissions automatically)
    if (!isNativePlatform() && 'geolocation' in navigator) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Browser geolocation error:', error);
            let errorMessage = 'Unable to get location';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Please allow location access in your browser settings.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out.';
                break;
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    }

    // Use Capacitor for native platforms
    // Check permission first
    const hasPermission = await checkLocationPermission();

    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) {
        throw new Error('Location permission denied');
      }
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current position:', error);
    throw error;
  }
};

/**
 * Watch the user's position for continuous updates
 * @param {Function} callback - Called with new position on each update
 * @returns {string} Watch ID to use for clearing the watch
 */
export const watchPosition = async (callback) => {
  try {
    const hasPermission = await checkLocationPermission();

    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) {
        throw new Error('Location permission denied');
      }
    }

    const watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      (position, error) => {
        if (error) {
          console.error('Error watching position:', error);
          return;
        }

        if (position) {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      }
    );

    return watchId;
  } catch (error) {
    console.error('Error starting position watch:', error);
    return null;
  }
};

/**
 * Stop watching the user's position
 * @param {string} watchId - The watch ID returned from watchPosition
 */
export const clearWatch = async (watchId) => {
  try {
    await Geolocation.clearWatch({ id: watchId });
  } catch (error) {
    console.error('Error clearing position watch:', error);
  }
};
