import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Search, Map, List, Bell, BellOff, Upload, X, Navigation } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useApp } from '../contexts/AppContext';
import { formatDate, formatDistance, findNearbyEvents } from '../utils/helpers';
import { getCurrentPosition } from '../services/geolocation';
import { notifyNearbyCleanups } from '../services/notifications';
import { uploadImage, validateImage, fileToDataURL } from '../services/imageUpload';
import { geocodeAddress } from '../services/geocoding';
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
  const { events, isLoading, error, createEvent, joinEvent, leaveEvent, joinedEventIds } = useEvents();
  const { showSuccess, showError, currentUser } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [eventTab, setEventTab] = useState('browse'); // 'browse' or 'myevents'
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Image upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    maxParticipants: '',
    description: '',
    imageUrl: '',
    coordinates: null,
  });

  // Geocoding states
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedAddress, setGeocodedAddress] = useState('');

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
    try {
      const location = await getCurrentPosition();
      setUserLocation(location);
      showSuccess('Location detected successfully!');
    } catch (error) {
      console.error('Location error:', error);
      // Use the error message from the geolocation service if available
      const errorMessage = error.message || 'Failed to access location. Please check your browser permissions.';
      showError(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
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

  // Filter events based on search query, tab selection, and add distance if user location exists
  const filteredEvents = events
    .filter(event => {
      // Filter by tab - browse shows events not joined, myevents shows joined events
      const tabMatch = eventTab === 'browse'
        ? !joinedEventIds.includes(event.id)
        : joinedEventIds.includes(event.id);

      // Filter by search query
      const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      return tabMatch && searchMatch;
    })
    .map(event => {
      if (userLocation && event.coordinates) {
        const eventsWithDistance = findNearbyEvents([event], userLocation, 1000);
        return eventsWithDistance[0] || event;
      }
      return event;
    });

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate the file
    const validation = validateImage(file);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    // Store the file
    setSelectedFile(file);

    // Generate preview
    try {
      const dataUrl = await fileToDataURL(file);
      setImagePreview(dataUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
      showError('Failed to generate image preview');
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      let imageUrl = newEvent.imageUrl;

      // If user selected a file, upload it
      if (selectedFile) {
        setUploadProgress(10);
        imageUrl = await uploadImage(
          selectedFile,
          currentUser?.id || 'anonymous',
          'event',
          (progress) => setUploadProgress(progress)
        );
        setUploadProgress(100);
      }

      const eventData = {
        ...newEvent,
        imageUrl: imageUrl || '',
        coordinates: newEvent.coordinates || null,
      };

      const result = await createEvent(eventData);

      if (result.success) {
        showSuccess('Event created successfully!');
        setNewEvent({
          title: '',
          location: '',
          date: '',
          time: '',
          maxParticipants: '',
          description: '',
          imageUrl: '',
          coordinates: null,
        });
        setSelectedFile(null);
        setImagePreview('');
        setUploadProgress(0);
        setGeocodedAddress('');
        setShowCreateModal(false);
      } else {
        showError(result.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showError('Failed to create event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    const result = await joinEvent(eventId);
    if (result.success) {
      showSuccess('Successfully registered for the event!');
    } else {
      showError(result.error || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    const result = await leaveEvent(eventId);
    if (result.success) {
      showSuccess('You have left the event');
    } else {
      showError(result.error || 'Failed to leave event');
    }
  };

  const handleInputChange = (field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
    // Clear geocoded data if location changes
    if (field === 'location') {
      setGeocodedAddress('');
      setNewEvent(prev => ({ ...prev, coordinates: null }));
    }
  };

  const handleGeocodeAddress = async () => {
    if (!newEvent.location || newEvent.location.trim() === '') {
      showError('Please enter a location first');
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(newEvent.location);

      if (result) {
        setNewEvent(prev => ({
          ...prev,
          coordinates: {
            lat: result.lat,
            lng: result.lng,
          },
        }));
        setGeocodedAddress(result.formattedAddress);
        showSuccess('Location coordinates found!');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      showError(error.message || 'Failed to find location. Please try a different address.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsGeocoding(true);
    try {
      const position = await getCurrentPosition();

      if (position) {
        setNewEvent(prev => ({
          ...prev,
          coordinates: position,
        }));

        // Try to reverse geocode to get address
        try {
          const { reverseGeocode } = await import('../services/geocoding');
          const address = await reverseGeocode(position.lat, position.lng);
          setGeocodedAddress(address);

          // Optionally update location field if it's empty
          if (!newEvent.location) {
            setNewEvent(prev => ({
              ...prev,
              location: address,
            }));
          }
        } catch (err) {
          // Reverse geocoding failed, but we still have coordinates
          setGeocodedAddress(`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
        }

        showSuccess('Current location coordinates set!');
      }
    } catch (error) {
      console.error('Location error:', error);
      showError(error.message || 'Failed to get current location');
    } finally {
      setIsGeocoding(false);
    }
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

      {/* Event Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setEventTab('browse')}
          className={`px-6 py-3 font-medium transition-colors ${
            eventTab === 'browse'
              ? 'text-ocean-600 border-b-2 border-ocean-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Browse Events
        </button>
        <button
          onClick={() => setEventTab('myevents')}
          className={`px-6 py-3 font-medium transition-colors ${
            eventTab === 'myevents'
              ? 'text-ocean-600 border-b-2 border-ocean-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Events
          {joinedEventIds.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-ocean-100 text-ocean-700 rounded-full">
              {joinedEventIds.length}
            </span>
          )}
        </button>
      </div>

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
          <Button
            size="sm"
            onClick={getUserLocation}
            leftIcon={<MapPin className="h-4 w-4" />}
          >
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
              title={
                searchQuery
                  ? 'No events found'
                  : eventTab === 'myevents'
                  ? 'No registered events'
                  : 'No events available'
              }
              description={
                searchQuery
                  ? 'Try adjusting your search query'
                  : eventTab === 'myevents'
                  ? 'You haven\'t registered for any events yet. Browse events to find one near you!'
                  : 'Be the first to create a cleanup event in your area!'
              }
              action={
                !searchQuery && eventTab === 'browse' && (
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
                  <div className="h-48 relative">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ocean-400 to-ocean-600" />
                    )}
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
                      {eventTab === 'browse' ? (
                        <Button
                          size="sm"
                          onClick={() => handleJoinEvent(event.id)}
                          disabled={event.participants >= event.maxParticipants}
                        >
                          {event.participants >= event.maxParticipants ? 'Full' : 'Register'}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLeaveEvent(event.id)}
                        >
                          Leave Event
                        </Button>
                      )}
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
        onClose={() => {
          setShowCreateModal(false);
          setSelectedFile(null);
          setImagePreview('');
          setUploadProgress(0);
          setGeocodedAddress('');
          setNewEvent(prev => ({ ...prev, coordinates: null }));
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        title="Create New Event"
        size="md"
      >
        <form onSubmit={handleCreateEvent}>
          <ModalBody>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image (Optional)
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Upload Button or Preview */}
                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={handleUploadButtonClick}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors bg-gray-50 hover:bg-gray-100"
                  >
                    <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload event image
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, JPG, PNG, GIF, or WebP (max 5MB)
                    </p>
                  </button>
                ) : (
                  <div className="border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">Preview:</p>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                    <div className="aspect-video max-w-sm mx-auto overflow-hidden rounded-lg bg-white">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-ocean-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-center">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Event Title"
                type="text"
                required
                value={newEvent.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Saturday Beach Cleanup"
              />

              <div>
                <Input
                  label="Location / Address"
                  type="text"
                  required
                  value={newEvent.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Venice Beach, CA or 123 Main St, Los Angeles"
                  helperText="Enter the location name or full address"
                />

                {/* Geocoding Controls */}
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleGeocodeAddress}
                    disabled={isGeocoding || !newEvent.location}
                    leftIcon={<MapPin className="h-4 w-4" />}
                    className="flex-1"
                  >
                    {isGeocoding ? 'Getting Coordinates...' : 'Get Coordinates from Address'}
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleUseCurrentLocation}
                    disabled={isGeocoding}
                    leftIcon={<Navigation className="h-4 w-4" />}
                    title="Use your current location"
                  >
                    Use Current
                  </Button>
                </div>

                {/* Geocoding Result Display */}
                {newEvent.coordinates && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900">
                          Coordinates Set
                        </p>
                        {geocodedAddress && (
                          <p className="text-xs text-green-700 mt-1">
                            {geocodedAddress}
                          </p>
                        )}
                        <p className="text-xs text-green-600 mt-1 font-mono">
                          {newEvent.coordinates.lat.toFixed(6)}, {newEvent.coordinates.lng.toFixed(6)}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          This event will appear on the map!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!newEvent.coordinates && (
                  <p className="text-xs text-gray-500 mt-2">
                    Optional: Add coordinates to show this event on the map
                  </p>
                )}
              </div>

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
