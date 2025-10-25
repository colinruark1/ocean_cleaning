import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { mockActivities } from '../services/mockData';

/**
 * Custom hook for managing activity feed
 */
export const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch activities
   */
  const fetchActivities = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with real API call
      // const data = await api.activities.getFeed(params);

      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
      setActivities(mockActivities);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new activity
   */
  const createActivity = useCallback(async (activityData) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with real API call
      // const newActivity = await api.activities.create(activityData);

      const newActivity = {
        id: Date.now(),
        ...activityData,
        time: 'just now',
      };

      setActivities(prev => [newActivity, ...prev]);
      return { success: true, activity: newActivity };
    } catch (err) {
      setError(err.message);
      console.error('Error creating activity:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch activities on mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    fetchActivities,
    createActivity,
  };
};
