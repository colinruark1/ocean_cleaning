# OceanClean Architecture Documentation

## Overview

This document describes the refactored architecture of the OceanClean beach cleanup application, following industry-standard patterns for modern React applications.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Code Organization](#code-organization)
- [Best Practices](#best-practices)
- [Future Improvements](#future-improvements)

## Technology Stack

### Core Technologies
- **React 19** - Latest React with Hooks and Suspense
- **Vite 7** - Fast build tool and dev server
- **React Router DOM v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework

### Build & Deployment
- **Capacitor 7** - Cross-platform mobile deployment
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing

## Project Structure

```
beach-cleanup-app/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Core UI components (Button, Card, Modal, etc.)
│   │   ├── layout/          # Layout components (Navigation, PageHeader)
│   │   └── ErrorBoundary.jsx
│   │
│   ├── pages/               # Page components (Dashboard, Events, Groups, Profile)
│   │
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── AppContext.jsx   # Global app state (notifications, theme)
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useActivities.js
│   │   ├── useEvents.js
│   │   └── useGroups.js
│   │
│   ├── services/            # API and data services
│   │   ├── api.js          # API client with all endpoints
│   │   └── mockData.js     # Mock data for development
│   │
│   ├── utils/               # Utility functions
│   │   └── helpers.js      # Date formatting, validation, etc.
│   │
│   ├── constants/           # App constants
│   │   └── index.js        # Routes, categories, error messages
│   │
│   ├── App.jsx             # Root component with providers
│   ├── App.css             # Global styles and animations
│   ├── main.jsx            # Application entry point
│   └── index.css           # Tailwind directives
│
├── public/                  # Static assets
├── android/                 # Native Android app (Capacitor)
├── dist/                    # Production build output
└── [config files]          # Vite, Tailwind, ESLint configs
```

## Architecture Patterns

### 1. Component Architecture

#### UI Component Library
Centralized, reusable UI components with consistent API:

```javascript
// Example: Button component with variants, sizes, loading states
<Button
  variant="primary"
  size="lg"
  leftIcon={<Plus />}
  isLoading={false}
  onClick={handleClick}
>
  Create Event
</Button>
```

**UI Components:**
- `Button` - Multiple variants, sizes, loading states, icon support
- `Card` - Container with Header, Body, Footer subcomponents
- `Modal` - Accessible modal with backdrop, animations, keyboard support
- `Input/Textarea` - Form inputs with labels, errors, icons
- `Badge` - Labels and tags with color variants
- `Avatar` - User avatars with fallback initials
- `Spinner` - Loading indicators
- `StatCard` - Statistics display cards
- `EmptyState` - Empty state placeholders
- `LoadingSpinner` - Page-level loading indicator

#### Layout Components
- `Navigation` - Responsive navigation with active state
- `PageHeader` - Reusable page header with title, description, actions

### 2. State Management

#### Context API Pattern
Global state management without external libraries:

```javascript
// AuthContext - User authentication state
const { user, isAuthenticated, login, logout, register } = useAuth();

// AppContext - App-wide state (notifications, theme)
const { showSuccess, showError, notifications } = useApp();
```

**Context Providers:**
- `AuthProvider` - Authentication state and operations
- `AppProvider` - Global app state (notifications, theme)

All contexts are wrapped in `App.jsx` at the root level.

### 3. Custom Hooks Pattern

Business logic and data fetching abstracted into reusable hooks:

```javascript
// useEvents hook
const { events, isLoading, error, createEvent, joinEvent } = useEvents();

// useGroups hook
const { groups, isLoading, error, createGroup, joinGroup } = useGroups();

// useActivities hook
const { activities, isLoading, error, fetchActivities } = useActivities();
```

**Benefits:**
- Separation of concerns
- Reusable business logic
- Consistent data fetching patterns
- Easy testing and mocking

### 4. Service Layer Pattern

Centralized API service with organized endpoints:

```javascript
// API service structure
api.events.getAll(params)
api.events.create(eventData)
api.events.join(eventId)

api.groups.getAll(params)
api.groups.create(groupData)

api.users.getProfile(userId)
api.users.updateProfile(userId, updates)
```

**Features:**
- Single source of truth for API calls
- Consistent error handling
- Easy to mock for testing
- Token management built-in

### 5. Error Handling

#### Error Boundaries
React Error Boundary catches JavaScript errors in component tree:

```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

Displays user-friendly error UI with:
- Error message
- Stack trace (development only)
- Refresh and retry options

#### API Error Handling
All API calls return consistent error format:

```javascript
const result = await createEvent(eventData);
if (result.success) {
  showSuccess('Event created successfully!');
} else {
  showError(result.error || 'Failed to create event');
}
```

### 6. Code Splitting & Lazy Loading

Pages are lazy-loaded for optimal performance:

```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Events = lazy(() => import('./pages/Events'));
const Groups = lazy(() => import('./pages/Groups'));
const Profile = lazy(() => import('./pages/Profile'));

// Wrapped in Suspense
<Suspense fallback={<LoadingScreen />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    ...
  </Routes>
</Suspense>
```

**Benefits:**
- Smaller initial bundle size
- Faster initial page load
- Pages loaded on-demand
- Better caching

**Build Output:**
```
dist/assets/Dashboard-*.js    3.58 kB
dist/assets/Events-*.js        6.67 kB
dist/assets/Groups-*.js        6.82 kB
dist/assets/Profile-*.js       5.96 kB
dist/assets/index-*.js       243.52 kB (main bundle)
```

### 7. Utility Functions

Common utility functions for:
- **Date formatting:** `formatDate()`, `formatRelativeTime()`
- **Validation:** `isValidEmail()`, `isEmpty()`
- **Data manipulation:** `sortBy()`, `searchFilter()`
- **Performance:** `debounce()`, `throttle()`
- **Calculations:** `calculatePercentage()`

### 8. Constants Management

Centralized constants for:
- Routes (`ROUTES.HOME`, `ROUTES.EVENTS`)
- Categories (`GROUP_CATEGORIES`, `DIFFICULTY_LEVELS`)
- Messages (`SUCCESS_MESSAGES`, `ERROR_MESSAGES`)
- Colors (`GROUP_GRADIENTS`)
- Validation rules (`VALIDATION`)

## Code Organization

### Component Structure

Each component follows this pattern:

```javascript
import { dependencies } from 'packages';
import { customHooks } from '../hooks';
import { contexts } from '../contexts';
import { components } from '../components/ui';

/**
 * Component documentation
 * @param {Object} props - Component props
 */
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const { data, loading } = useCustomHook();
  const { user } = useAuth();

  // State
  const [localState, setLocalState] = useState(initial);

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleAction = () => {
    // Handler logic
  };

  // Early returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  // Main render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Page Structure

Pages are feature-focused components that:
1. Use custom hooks for data
2. Handle user interactions
3. Compose UI components
4. Manage local UI state (modals, forms)

### Import Organization

Imports are organized in this order:
1. React and third-party libraries
2. Router dependencies
3. Custom hooks
4. Contexts
5. UI components
6. Layout components
7. Utilities and constants
8. Styles

## Best Practices

### 1. Component Design
- **Single Responsibility:** Each component has one clear purpose
- **Composition over Inheritance:** Build complex UIs from simple components
- **Props Destructuring:** Clear prop definitions at component level
- **PropTypes/JSDoc:** Document component props and usage

### 2. State Management
- **Lift State Up:** Share state at lowest common ancestor
- **Context for Global State:** Use Context for truly global state
- **Local State for UI:** Keep UI-specific state local
- **Derived State:** Calculate from existing state, don't duplicate

### 3. Performance
- **Lazy Loading:** Code split routes and heavy components
- **Memoization:** Use `useMemo` and `useCallback` for expensive operations
- **Debouncing:** Debounce search inputs and API calls
- **Virtualization:** For long lists (future improvement)

### 4. Accessibility
- **Semantic HTML:** Use appropriate HTML elements
- **ARIA Labels:** Add labels for screen readers
- **Keyboard Navigation:** Support keyboard interactions
- **Focus Management:** Manage focus in modals and forms

### 5. Code Quality
- **ESLint:** Enforce code quality rules
- **Consistent Naming:** camelCase for functions, PascalCase for components
- **File Organization:** Group related files together
- **Comments:** Document complex logic, not obvious code

### 6. Git Practices
- **Atomic Commits:** One logical change per commit
- **Clear Messages:** Descriptive commit messages
- **Feature Branches:** Develop features in separate branches
- **Pull Requests:** Review code before merging

## Future Improvements

### Short Term
1. **TypeScript Migration** - Add type safety
2. **Unit Tests** - Jest + React Testing Library
3. **E2E Tests** - Playwright or Cypress
4. **Storybook** - Component documentation and development

### Medium Term
1. **Real API Integration** - Connect to backend API
2. **Authentication** - Implement real auth flow
3. **State Persistence** - localStorage/sessionStorage
4. **Offline Support** - Service workers and caching

### Long Term
1. **GraphQL** - Replace REST API
2. **Real-time Updates** - WebSockets for live data
3. **Analytics** - Track user behavior
4. **PWA Features** - Push notifications, offline mode
5. **Internationalization** - Multi-language support
6. **Advanced Animations** - Framer Motion or React Spring

## Development Workflow

### Getting Started
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Adding New Features

1. **Create UI Components** (if needed)
   - Add to `src/components/ui/`
   - Export from `index.js`

2. **Create Custom Hook** (if needed)
   - Add to `src/hooks/`
   - Handle data fetching and business logic

3. **Create API Methods** (if needed)
   - Add to `src/services/api.js`
   - Add mock data to `src/services/mockData.js`

4. **Create/Update Page**
   - Use custom hooks for data
   - Compose UI components
   - Handle user interactions

5. **Add Constants** (if needed)
   - Add to `src/constants/index.js`

### Code Review Checklist

- [ ] Follows project structure and patterns
- [ ] Components are properly documented
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design works on all screen sizes
- [ ] Accessibility requirements met
- [ ] No console errors or warnings
- [ ] Code is formatted and linted
- [ ] Build succeeds without errors

## Deployment

### Web Deployment
```bash
npm run build           # Build for production
# Deploy dist/ folder to hosting service
```

### Android Deployment
```bash
npm run build           # Build web app
npx cap sync android    # Sync to Android project
npx cap open android    # Open in Android Studio
# Build APK in Android Studio
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Capacitor](https://capacitorjs.com)

## Support

For questions or issues, please:
1. Check this documentation
2. Review the code examples
3. Consult the official library documentation
4. Open an issue on GitHub (if applicable)

---

**Last Updated:** October 2025
**Version:** 2.0.0 (Refactored)
