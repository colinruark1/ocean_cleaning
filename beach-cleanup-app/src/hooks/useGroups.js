import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { mockGroups } from '../services/mockData';

/**
 * Custom hook for managing groups
 * Provides groups data and operations (CRUD)
 */
export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all groups
   */
  const fetchGroups = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with real API call
      // const data = await api.groups.getAll(params);

      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setGroups(mockGroups);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new group
   */
  const createGroup = useCallback(async (groupData) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with real API call
      // const newGroup = await api.groups.create(groupData);

      const newGroup = {
        id: Date.now(),
        ...groupData,
        members: 1,
        cleanups: 0,
        trash: '0 lbs',
        category: groupData.category || 'Local Community',
      };

      setGroups(prev => [newGroup, ...prev]);
      return { success: true, group: newGroup };
    } catch (err) {
      setError(err.message);
      console.error('Error creating group:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update a group
   */
  const updateGroup = useCallback(async (groupId, updates) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with real API call
      // const updatedGroup = await api.groups.update(groupId, updates);

      setGroups(prev =>
        prev.map(group =>
          group.id === groupId ? { ...group, ...updates } : group
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error updating group:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a group
   */
  const deleteGroup = useCallback(async (groupId) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with real API call
      // await api.groups.delete(groupId);

      setGroups(prev => prev.filter(group => group.id !== groupId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error deleting group:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Join a group
   */
  const joinGroup = useCallback(async (groupId) => {
    try {
      // TODO: Replace with real API call
      // await api.groups.join(groupId);

      setGroups(prev =>
        prev.map(group =>
          group.id === groupId
            ? { ...group, members: group.members + 1 }
            : group
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error joining group:', err);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Leave a group
   */
  const leaveGroup = useCallback(async (groupId) => {
    try {
      // TODO: Replace with real API call
      // await api.groups.leave(groupId);

      setGroups(prev =>
        prev.map(group =>
          group.id === groupId
            ? { ...group, members: Math.max(0, group.members - 1) }
            : group
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error leaving group:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
  };
};
