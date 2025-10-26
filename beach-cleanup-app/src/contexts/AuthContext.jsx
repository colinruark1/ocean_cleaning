import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Authentication Context Provider
 * Manages user authentication state across the application
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state (check localStorage, token, etc.)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // TODO: Check for stored token and validate
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login function
   * @param {Object} credentials - User credentials
   */
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockUser = {
        id: '1',
        username: 'alexrivera',
        name: 'Alex Rivera',
        email: credentials.email,
        location: 'Santa Monica, CA',
        joined: 'January 2024',
        bio: 'Ocean lover and environmental advocate committed to protecting our beaches',
        avatar: null,
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function
   * @param {Object} userData - New user data (username, email, password, bio, location)
   */
  const register = async (userData) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        name: userData.username, // Use username as display name for now
        email: userData.email,
        bio: userData.bio || '',
        location: userData.location || '',
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        avatar: null,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   */
  const updateProfile = async (updates) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call when backend is ready
      // For now, just update local state directly
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
