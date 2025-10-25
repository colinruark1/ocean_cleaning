import { Geolocation } from '@capacitor/geolocation';

/**
 * Geolocation Service
 * Handles device location tracking with Capacitor for both web and mobile
 */

/**
 * Check if location permissions are granted
 * @returns {Promise<boolean>} Whether permission is granted
 */
export const checkLocationPermission = async () => {
  try {
    const permission = await Geolocation.checkPermissions();
    return permission.location === 'granted';
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
    const permission = await Geolocation.requestPermissions();
    return permission.location === 'granted';
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
    return null;
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
