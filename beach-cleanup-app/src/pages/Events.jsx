import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Search, Map, List, Bell, BellOff } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useApp } from '../contexts/AppContext';
import { formatDate, formatDistance, findNearbyEvents } from '../utils/helpers';
import { getCurrentPosition } from '../services/geolocation';
import { notifyNearbyCleanups } from '../services/notifications';
import EventsMap from '../components/EventsMap';
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Badge,
  LoadingSpinner,
  EmptyState,
} from '../components/ui';
import PageHeader from '../components/layout/PageHeader';

/**
 * Events Page
 * Browse, search, create, and join cleanup events
 * Refactored with industry-standard patterns
 */
const Events = () => {
  const { events, isLoading, error, createEvent, joinEvent } = useEvents();
  const { showSuccess, showError } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    maxParticipants: '',
    description: '',
  });

  // Get user's location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Check for nearby events when location changes
  useEffect(() => {
    if (userLocation && notificationsEnabled && events.length > 0) {
      checkNearbyEvents();
    }
  }, [userLocation, notificationsEnabled, events]);

  const getUserLocation = async () => {
    setIsLoadingLocation(true);
    const location = await getCurrentPosition();
    if (location) {
      setUserLocation(location);
      showSuccess('Location detected!');
    } else {
      showError('Could not get your location. Please enable location permissions.');
    }
    setIsLoadingLocation(false);
  };

  const checkNearbyEvents = async () => {
    if (!userLocation) return;

    const nearbyEvents = findNearbyEvents(events, userLocation, 10);
    if (nearbyEvents.length > 0) {
      await notifyNearbyCleanups(events, userLocation, 5);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      showSuccess('Notifications enabled for nearby cleanups!');
      if (userLocation) {
        checkNearbyEvents();
      }
    } else {
      showSuccess('Notifications disabled');
    }
  };

  // Filter events based on search query and add distance if user location exists
  const filteredEvents = events
    .filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map(event => {
      if (userLocation && event.coordinates) {
        const eventsWithDistance = findNearbyEvents([event], userLocation, 1000);
        return eventsWithDistance[0] || event;
      }
      return event;
    });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const result = await createEvent(newEvent);

    if (result.success) {
      showSuccess('Event created successfully!');
      setNewEvent({
        title: '',
        location: '',
        date: '',
        time: '',
        maxParticipants: '',
        description: '',
      });
      setShowCreateModal(false);
    } else {
      showError(result.error || 'Failed to create event');
    }

    setIsCreating(false);
  };

  const handleJoinEvent = async (eventId) => {
    const result = await joinEvent(eventId);
    if (result.success) {
      showSuccess('You have joined the event!');
    } else {
      showError(result.error || 'Failed to join event');
    }
  };

  const handleInputChange = (field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading events: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Cleanup Events"
        description="Find and join beach cleanup events near you"
        action={
          <Button
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => setShowCreateModal(true)}
          >
            Create Event
          </Button>
        }
      />

      {/* Controls Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search events by location or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="md"
            leftIcon={<List className="h-5 w-5" />}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'primary' : 'outline'}
            size="md"
            leftIcon={<Map className="h-5 w-5" />}
            onClick={() => setViewMode('map')}
          >
            Map
          </Button>
        </div>

        {/* Notifications Toggle */}
        <Button
          variant={notificationsEnabled ? 'primary' : 'outline'}
          size="md"
          leftIcon={notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          onClick={toggleNotifications}
          disabled={!userLocation}
        >
          {notificationsEnabled ? 'Notifications On' : 'Notifications Off'}
        </Button>
      </div>

      {/* Location Status */}
      {isLoadingLocation && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-blue-800">Detecting your location...</span>
        </div>
      )}

      {!userLocation && !isLoadingLocation && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Location not detected. Enable location to see nearby events and get notifications.
            </span>
          </div>
          <Button size="sm" onClick={getUserLocation}>
            Enable Location
          </Button>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="mb-6">
          <EventsMap
            events={filteredEvents}
            userLocation={userLocation}
            onJoinEvent={handleJoinEvent}
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          />
        </div>
      )}

      {/* Events List */}
      {viewMode === 'list' && (
        <>
          {isLoading ? (
            <LoadingSpinner message="Loading events..." />
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-12 w-12" />}
              title={searchQuery ? 'No events found' : 'No events available'}
              description={
                searchQuery
                  ? 'Try adjusting your search query'
                  : 'Be the first to create a cleanup event in your area!'
              }
              action={
                !searchQuery && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    Create First Event
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} hoverable className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-ocean-400 to-ocean-600 relative">
                    {event.distance && (
                      <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                        <span className="text-sm font-semibold text-ocean-600">
                          {formatDistance(event.distance)} away
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        {event.participants}/{event.maxParticipants} participants
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="primary" size="md">
                        {event.difficulty}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={event.participants >= event.maxParticipants}
                      >
                        {event.participants >= event.maxParticipants ? 'Full' : 'Join Event'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
        size="md"
      >
        <form onSubmit={handleCreateEvent}>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Event Title"
                type="text"
                required
                value={newEvent.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Saturday Beach Cleanup"
              />

              <Input
                label="Location"
                type="text"
                required
                value={newEvent.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Venice Beach, CA"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
                <Input
                  label="Time"
                  type="time"
                  required
                  value={newEvent.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </div>

              <Input
                label="Max Participants"
                type="number"
                required
                min="1"
                value={newEvent.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                placeholder="e.g., 50"
              />

              <Textarea
                label="Description"
                required
                value={newEvent.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your event..."
                rows={4}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isCreating}
              disabled={isCreating}
            >
              Create Event
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
