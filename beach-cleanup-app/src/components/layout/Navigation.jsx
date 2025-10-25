import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, User, Waves, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Main navigation component
 * Industry-standard responsive navigation with active states
 */
const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/groups', label: 'Groups', icon: Users },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Waves className="h-8 w-8 text-ocean-600" />
              <span className="ml-2 text-2xl font-bold text-ocean-600">OceanClean</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'border-ocean-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-ocean-600 hover:bg-ocean-700 transition-colors"
              >
                <User className="h-4 w-4 mr-1" />
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-ocean-600 text-sm font-medium rounded-full text-ocean-600 hover:bg-ocean-50 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-ocean-600 hover:bg-ocean-700 transition-colors"
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
      <div className="sm:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                isActive(path)
                  ? 'text-ocean-600'
                  : 'text-gray-500'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                isActive('/profile')
                  ? 'text-ocean-600'
                  : 'text-gray-500'
              }`}
            >
              <User className="h-5 w-5 mb-1" />
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive('/login')
                    ? 'text-ocean-600'
                    : 'text-gray-500'
                }`}
              >
                <LogIn className="h-5 w-5 mb-1" />
                Log In
              </Link>
              <Link
                to="/register"
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium transition-colors ${
                  isActive('/register')
                    ? 'text-ocean-600'
                    : 'text-gray-500'
                }`}
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
