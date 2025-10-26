import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * Theme Context Provider
 * Manages dark mode / light mode state across the application
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  /**
   * Toggle between dark and light mode
   */
  const toggleTheme = () => {
    console.log('Toggle theme called, current isDarkMode:', isDarkMode);
    setIsDarkMode((prev) => {
      const newMode = !prev;
      console.log('Setting dark mode to:', newMode);
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        console.log('Added dark class to html element');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        console.log('Removed dark class from html element');
      }
      console.log('HTML classes:', document.documentElement.className);
      return newMode;
    });
  };

  /**
   * Set theme explicitly
   * @param {boolean} dark - Whether to enable dark mode
   */
  const setTheme = (dark) => {
    setIsDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to use theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
