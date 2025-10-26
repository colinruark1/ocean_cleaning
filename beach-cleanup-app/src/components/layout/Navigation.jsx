import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, User, Waves, LogIn, UserPlus, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Main navigation component
 * Industry-standard responsive navigation with active states
 */
const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/groups', label: 'Groups', icon: Users },
  ];

  return (
    <nav className="sticky top-0 z-50 shadow-lg transition-colors duration-300 w-full" style={{
      backgroundColor: isDarkMode ? 'var(--color-bg-secondary)' : 'var(--color-secondary)',
      borderBottom: `1px solid var(--color-border)`
    }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Waves className="h-8 w-8" style={{color: isDarkMode ? 'var(--color-accent)' : '#DDA853'}} />
              <span className="ml-2 text-2xl font-bold" style={{color: isDarkMode ? 'var(--color-text-primary)' : '#FFFFFF'}}>OceanClean</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 hover:opacity-75`}
                  style={{
                    borderBottomColor: isActive(path) ? (isDarkMode ? 'var(--color-accent)' : '#DDA853') : 'transparent',
                    color: isActive(path) ? (isDarkMode ? 'var(--color-accent)' : 'white') : (isDarkMode ? '#FFFFFF' : 'rgba(255,255,255,0.7)')
                  }}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Theme toggle and Auth buttons */}
          <div className="flex items-center space-x-2">
            {/* Dark mode toggle button */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center p-2 border text-sm font-medium rounded-full transition-all duration-200 hover:opacity-80 hover:scale-110"
              style={{
                borderColor: isDarkMode ? '#FFFFFF' : '#DDA853',
                color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 168, 83, 0.1)'
              }}
              aria-label="Toggle dark mode"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <Link
                to="/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{
                  backgroundColor: isDarkMode ? 'var(--color-accent)' : '#DDA853',
                  color: isDarkMode ? '#0F1419' : '#183B4E'
                }}
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full transition-all duration-200 hover:opacity-80"
                  style={{
                    borderColor: isDarkMode ? '#FFFFFF' : '#DDA853',
                    color: isDarkMode ? '#FFFFFF' : 'white'
                  }}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105"
                  style={{
                    backgroundColor: isDarkMode ? '#FFFFFF' : '#DDA853',
                    color: isDarkMode ? '#FFFFFF' : '#183B4E'
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden" style={{borderTop: `1px solid var(--color-border)`}}>
        <div className="flex justify-around py-2" style={{backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'}}>
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors duration-200 hover:opacity-75"
              style={{color: isActive(path) ? (isDarkMode ? 'var(--color-accent)' : '#DDA853') : (isDarkMode ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.7)')}}
            >
              <Icon className="h-5 w-5 mb-1" />
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors duration-200 hover:opacity-75"
              style={{color: isActive('/profile') ? (isDarkMode ? 'var(--color-accent)' : '#DDA853') : (isDarkMode ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.7)')}}
            >
              <User className="h-5 w-5 mb-1" />
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors duration-200 hover:opacity-75"
                style={{color: isActive('/login') ? (isDarkMode ? 'var(--color-accent)' : '#DDA853') : (isDarkMode ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.7)')}}
              >
                <LogIn className="h-5 w-5 mb-1" />
                Log In
              </Link>
              <Link
                to="/register"
                className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors duration-200 hover:opacity-75"
                style={{color: isActive('/register') ? (isDarkMode ? 'var(--color-accent)' : '#DDA853') : (isDarkMode ? 'var(--color-text-secondary)' : 'rgba(255,255,255,0.7)')}}
              >
                <UserPlus className="h-5 w-5 mb-1" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
