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
          const parsedUser = JSON.parse(storedUser);

          // Migrate old 'avatar' field to 'profilePictureUrl'
          if (parsedUser.avatar !== undefined && parsedUser.profilePictureUrl === undefined) {
            parsedUser.profilePictureUrl = parsedUser.avatar;
            delete parsedUser.avatar;
            localStorage.setItem('user', JSON.stringify(parsedUser));
            console.log('Migrated avatar field to profilePictureUrl');
          }

          // Migrate old 'name' field to 'displayName'
          if (parsedUser.name !== undefined && parsedUser.displayName === undefined) {
            parsedUser.displayName = parsedUser.name;
            delete parsedUser.name;
            localStorage.setItem('user', JSON.stringify(parsedUser));
            console.log('Migrated name field to displayName');
          }

          setUser(parsedUser);
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
        displayName: 'Alex Rivera',
        email: credentials.email,
        location: 'Santa Monica, CA',
        joined: 'January 2024',
        bio: 'Ocean lover and environmental advocate committed to protecting our beaches',
        profilePictureUrl: null,
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
        displayName: userData.username, // Use username as display name initially
        email: userData.email,
        bio: userData.bio || '',
        location: userData.location || '',
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        profilePictureUrl: null,
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

      console.log('Updating user profile with:', Object.keys(updates));
      if (updates.profilePictureUrl) {
        console.log('Profile picture URL length:', updates.profilePictureUrl.length);
      }

      setUser(updatedUser);

      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User saved to localStorage successfully');

        // Verify the save
        const saved = localStorage.getItem('user');
        const parsed = JSON.parse(saved);
        console.log('Verified - stored user has profilePictureUrl:', !!parsed.profilePictureUrl);
        if (parsed.profilePictureUrl) {
          console.log('Stored profilePictureUrl length:', parsed.profilePictureUrl.length);
        }
      } catch (storageError) {
        console.error('LocalStorage error:', storageError);
        throw new Error('Failed to save to localStorage: ' + storageError.message);
      }

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
