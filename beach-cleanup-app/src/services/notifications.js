import { LocalNotifications } from '@capacitor/local-notifications';
import { findNearbyEvents, formatDistance } from '../utils/helpers';

/**
 * Notification Service
 * Handles local notifications for nearby cleanup events
 */

/**
 * Check if notification permissions are granted
 * @returns {Promise<boolean>} Whether permission is granted
 */
export const checkNotificationPermission = async () => {
  try {
    const permission = await LocalNotifications.checkPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error checking notification permission:', error);
    return false;
  }
};

/**
 * Request notification permissions from the user
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestNotificationPermission = async () => {
  try {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Schedule a notification
 * @param {Object} options - Notification options
 * @returns {Promise<void>}
 */
export const scheduleNotification = async ({ id, title, body, extra = {} }) => {
  try {
    const hasPermission = await checkNotificationPermission();

    if (!hasPermission) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        console.log('Notification permission denied');
        return;
      }
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          extra,
          schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
        },
      ],
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

/**
 * Send notification about nearby cleanup events
 * @param {Array} events - All events
 * @param {Object} userLocation - User's current location {lat, lng}
 * @param {number} radiusKm - Notification radius in kilometers
 * @returns {Promise<void>}
 */
export const notifyNearbyCleanups = async (events, userLocation, radiusKm = 5) => {
  if (!userLocation) return;

  const nearbyEvents = findNearbyEvents(events, userLocation, radiusKm);

  if (nearbyEvents.length === 0) return;

  // Get the closest event
  const closestEvent = nearbyEvents[0];
  const distanceText = formatDistance(closestEvent.distance);

  await scheduleNotification({
    id: closestEvent.id,
    title: 'Cleanup Event Nearby!',
    body: `${closestEvent.title} is ${distanceText} away at ${closestEvent.location}`,
    extra: {
      eventId: closestEvent.id,
      type: 'nearby_event',
    },
  });

  // Notify if there are multiple nearby events
  if (nearbyEvents.length > 1) {
    await scheduleNotification({
      id: 99999,
      title: `${nearbyEvents.length} Cleanups Near You!`,
      body: `There are ${nearbyEvents.length} cleanup events happening within ${radiusKm}km of your location.`,
      extra: {
        type: 'multiple_events',
        count: nearbyEvents.length,
      },
    });
  }
};

/**
 * Cancel all scheduled notifications
 * @returns {Promise<void>}
 */
export const cancelAllNotifications = async () => {
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

/**
 * Listen for notification actions
 * @param {Function} callback - Called when user taps notification
 */
export const addNotificationListener = (callback) => {
  LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
    callback(notification);
  });
};

/**
 * Remove notification listeners
 */
export const removeNotificationListeners = async () => {
  await LocalNotifications.removeAllListeners();
};
