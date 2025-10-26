import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { mockEvents } from '../services/mockData';
import { fetchEvents, addEvent as addEventToSheets, updateEventParticipants } from '../services/googleSheets';

/**
 * Custom hook for managing events
 * Provides events data and operations (CRUD)
 */
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedEventIds, setJoinedEventIds] = useState(() => {
    // Load joined events from localStorage on init
    const stored = localStorage.getItem('joinedEventIds');
    return stored ? JSON.parse(stored) : [];
  });

  /**
   * Fetch all events
   */
  const fetchEventsData = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch events from Google Sheets via backend
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
      // Fallback to mock data on error
      setEvents(mockEvents);
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

      // Add event to Google Sheets via backend
      const newEvent = await addEventToSheets(eventData);

      // Add to local state
      setEvents(prev => [newEvent, ...prev]);

      // Automatically join the event you created
      setJoinedEventIds(prev => [...prev, newEvent.id]);

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
      // Check if already joined
      if (joinedEventIds.includes(eventId)) {
        return { success: false, error: 'You have already joined this event' };
      }

      // Find the event
      const event = events.find(e => e.id === eventId);
      if (!event) {
        return { success: false, error: 'Event not found' };
      }

      const newParticipantCount = event.participants + 1;

      // Update in Google Sheets via backend
      await updateEventParticipants(eventId, newParticipantCount);

      // Update local state
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId
            ? { ...e, participants: newParticipantCount }
            : e
        )
      );

      // Track this event as joined
      setJoinedEventIds(prev => [...prev, eventId]);

      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error joining event:', err);
      return { success: false, error: err.message };
    }
  }, [joinedEventIds, events]);

  /**
   * Leave an event
   */
  const leaveEvent = useCallback(async (eventId) => {
    try {
      // Check if actually joined
      if (!joinedEventIds.includes(eventId)) {
        return { success: false, error: 'You have not joined this event' };
      }

      // Find the event
      const event = events.find(e => e.id === eventId);
      if (!event) {
        return { success: false, error: 'Event not found' };
      }

      const newParticipantCount = Math.max(0, event.participants - 1);

      // Update in Google Sheets via backend
      await updateEventParticipants(eventId, newParticipantCount);

      // Update local state
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId
            ? { ...e, participants: newParticipantCount }
            : e
        )
      );

      // Remove from joined events
      setJoinedEventIds(prev => prev.filter(id => id !== eventId));

      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error leaving event:', err);
      return { success: false, error: err.message };
    }
  }, [joinedEventIds, events]);

  // Fetch events on mount
  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  // Save joined events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('joinedEventIds', JSON.stringify(joinedEventIds));
  }, [joinedEventIds]);

  return {
    events,
    isLoading,
    error,
    joinedEventIds,
    fetchEvents: fetchEventsData,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
  };
};
