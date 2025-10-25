import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Search } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useApp } from '../contexts/AppContext';
import { formatDate } from '../utils/helpers';
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

  const [newEvent, setNewEvent] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    maxParticipants: '',
    description: '',
  });

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search events by location or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-5 w-5" />}
        />
      </div>

      {/* Events List */}
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
              <div className="h-48 bg-gradient-to-br from-ocean-400 to-ocean-600" />
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
