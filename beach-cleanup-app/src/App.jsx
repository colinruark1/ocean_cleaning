import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/layout/Navigation';
import { LoadingScreen } from './components/ui';
import './App.css';

// Lazy load pages for better performance (code splitting)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Events = lazy(() => import('./pages/Events'));
const Posts = lazy(() => import('./pages/Posts'));
const Groups = lazy(() => import('./pages/Groups'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

/**
 * Main App Component
 * Industry-standard architecture with:
 * - Context providers for global state
 * - Error boundaries for error handling
 * - Lazy loading for code splitting
 * - Suspense for loading states
 */
function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <Suspense fallback={<LoadingScreen message="Loading page..." />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
