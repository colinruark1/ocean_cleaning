import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

/**
 * Global Application Context Provider
 * Manages global app state like notifications, theme, etc.
 */
export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('light');

  /**
   * Add a notification
   * @param {Object} notification - Notification object
   */
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  /**
   * Remove a notification
   * @param {string} id - Notification ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Show success notification
   */
  const showSuccess = useCallback((message) => {
    return addNotification({
      type: 'success',
      message,
    });
  }, [addNotification]);

  /**
   * Show error notification
   */
  const showError = useCallback((message) => {
    return addNotification({
      type: 'error',
      message,
    });
  }, [addNotification]);

  /**
   * Show info notification
   */
  const showInfo = useCallback((message) => {
    return addNotification({
      type: 'info',
      message,
    });
  }, [addNotification]);

  /**
   * Show warning notification
   */
  const showWarning = useCallback((message) => {
    return addNotification({
      type: 'warning',
      message,
    });
  }, [addNotification]);

  /**
   * Toggle theme
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use app context
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
