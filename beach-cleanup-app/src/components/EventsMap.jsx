import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';
import { formatDate, formatDistance } from '../utils/helpers';
import { Button } from './ui';

/**
 * EventsMap Component
 * Displays cleanup events on Google Maps with markers and info windows
 */
const EventsMap = ({ events, userLocation, onJoinEvent, apiKey }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
  });

  // Default center (Santa Monica if no user location)
  const defaultCenter = useMemo(
    () => userLocation || { lat: 34.0195, lng: -118.4912 },
    [userLocation]
  );

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Custom marker icon for user location
  const userMarkerIcon = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    fillColor: '#3B82F6',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 1.5,
  };

  // Custom marker icon for cleanup events
  const eventMarkerIcon = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
    fillColor: '#0ea5e9',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 1.5,
  };

  if (loadError) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Error loading map</p>
          <p className="text-sm text-gray-500 mt-2">
            Please check your Google Maps API key
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={11}
        options={options}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={userMarkerIcon}
            title="Your Location"
          />
        )}

        {/* Event markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={event.coordinates}
            icon={eventMarkerIcon}
            onClick={() => setSelectedEvent(event)}
            title={event.title}
          />
        ))}

        {/* Info window for selected event */}
        {selectedEvent && (
          <InfoWindow
            position={selectedEvent.coordinates}
            onCloseClick={() => setSelectedEvent(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>

              <div className="space-y-1 mb-3">
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  {selectedEvent.location}
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  {formatDate(selectedEvent.date, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                  {selectedEvent.time}
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                  {selectedEvent.participants}/{selectedEvent.maxParticipants} participants
                </div>

                {selectedEvent.distance && (
                  <div className="text-xs font-semibold text-ocean-600 mt-1">
                    {formatDistance(selectedEvent.distance)} away
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {selectedEvent.description}
              </p>

              <Button
                size="sm"
                onClick={() => {
                  onJoinEvent(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                disabled={selectedEvent.participants >= selectedEvent.maxParticipants}
                className="w-full"
              >
                {selectedEvent.participants >= selectedEvent.maxParticipants
                  ? 'Full'
                  : 'Join Event'}
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default EventsMap;
