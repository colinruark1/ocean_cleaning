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
    <nav className="sticky top-0 z-50 shadow-sm transition-colors" style={{backgroundColor: isDarkMode ? '#183B4E' : '#33A1E0', borderBottom: '1px solid #27548A'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Waves className="h-8 w-8" style={{color: '#DDA853'}} />
              <span className="ml-2 text-2xl font-bold italic" style={{color: '#F3F3E0'}}>Clean Wave</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'text-white'
                      : 'border-transparent hover:border-gray-600'
                  }`}
                  style={{
                    borderBottomColor: isActive(path) ? '#DDA853' : 'transparent',
                    color: isActive(path) ? '#F3F3E0' : '#9CA3AF'
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
              className="inline-flex items-center p-2 border text-sm font-medium rounded-full transition-all hover:opacity-80"
              style={{borderColor: '#27548A', color: '#F3F3E0'}}
              aria-label="Toggle dark mode"
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full transition-all hover:opacity-90"
                style={{backgroundColor: '#DDA853', color: '#183B4E'}}
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full transition-all hover:opacity-80"
                  style={{borderColor: '#DDA853', color: '#F3F3E0'}}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full transition-all hover:opacity-90"
                  style={{backgroundColor: '#DDA853', color: '#183B4E'}}
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
      <div className="sm:hidden" style={{borderTop: '1px solid #27548A'}}>
        <div className="flex justify-around py-2">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors"
              style={{color: isActive(path) ? '#DDA853' : '#9CA3AF'}}
            >
              <Icon className="h-5 w-5 mb-1" />
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors"
              style={{color: isActive('/profile') ? '#DDA853' : '#9CA3AF'}}
            >
              <User className="h-5 w-5 mb-1" />
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors"
                style={{color: isActive('/login') ? '#DDA853' : '#9CA3AF'}}
              >
                <LogIn className="h-5 w-5 mb-1" />
                Log In
              </Link>
              <Link
                to="/register"
                className="flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors"
                style={{color: isActive('/register') ? '#DDA853' : '#9CA3AF'}}
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
