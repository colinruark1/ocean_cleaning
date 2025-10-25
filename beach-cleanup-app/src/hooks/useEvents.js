import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { mockEvents } from '../services/mockData';

/**
 * Custom hook for managing events
 * Provides events data and operations (CRUD)
 */
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all events
   */
  const fetchEvents = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with real API call
      // const data = await api.events.getAll(params);

      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setEvents(mockEvents);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new event
   */
  const createEvent = useCallback(async (eventData) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with real API call
      // const newEvent = await api.events.create(eventData);

      const newEvent = {
        id: Date.now(),
        ...eventData,
        participants: 1,
        organizer: 'You',
        difficulty: eventData.difficulty || 'Easy',
      };

      setEvents(prev => [newEvent, ...prev]);
      return { success: true, event: newEvent };
    } catch (err) {
      setError(err.message);
      console.error('Error creating event:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an event
   */
  const updateEvent = useCallback(async (eventId, updates) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with real API call
      // const updatedEvent = await api.events.update(eventId, updates);

      setEvents(prev =>
        prev.map(event =>
          event.id === eventId ? { ...event, ...updates } : event
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error updating event:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete an event
   */
  const deleteEvent = useCallback(async (eventId) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with real API call
      // await api.events.delete(eventId);

      setEvents(prev => prev.filter(event => event.id !== eventId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error deleting event:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Join an event
   */
  const joinEvent = useCallback(async (eventId) => {
    try {
      // TODO: Replace with real API call
      // await api.events.join(eventId);

      setEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? { ...event, participants: event.participants + 1 }
            : event
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error joining event:', err);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Leave an event
   */
  const leaveEvent = useCallback(async (eventId) => {
    try {
      // TODO: Replace with real API call
      // await api.events.leave(eventId);

      setEvents(prev =>
        prev.map(event =>
          event.id === eventId
            ? { ...event, participants: Math.max(0, event.participants - 1) }
            : event
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error leaving event:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
  };
};
