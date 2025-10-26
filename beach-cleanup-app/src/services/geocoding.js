/**
 * Geocoding Service
 * Converts addresses to coordinates using Google Maps Geocoding API
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Convert an address string to coordinates (lat, lng)
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number, formattedAddress: string} | null>}
 */
export const geocodeAddress = async (address) => {
  if (!address || address.trim() === '') {
    throw new Error('Address is required');
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'ZERO_RESULTS') {
      throw new Error('No results found for this address');
    }

    if (data.status !== 'OK') {
      throw new Error(`Geocoding error: ${data.status}`);
    }

    if (!data.results || data.results.length === 0) {
      throw new Error('No geocoding results returned');
    }

    const result = data.results[0];
    const location = result.geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

/**
 * Get address suggestions as the user types (Places Autocomplete)
 * Note: This requires the Places API to be enabled
 * @param {string} input - The partial address typed by user
 * @returns {Promise<Array<{description: string, placeId: string}>>}
 */
export const getAddressSuggestions = async (input) => {
  if (!input || input.trim() === '') {
    return [];
  }

  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured');
    return [];
  }

  try {
    const encodedInput = encodeURIComponent(input);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedInput}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Places API error:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (data.status === 'ZERO_RESULTS' || !data.predictions) {
      return [];
    }

    return data.predictions.map(prediction => ({
      description: prediction.description,
      placeId: prediction.place_id,
    }));
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
};

/**
 * Get coordinates for a specific place ID
 * @param {string} placeId - The Google Place ID
 * @returns {Promise<{lat: number, lng: number, formattedAddress: string}>}
 */
export const getPlaceDetails = async (placeId) => {
  if (!placeId) {
    throw new Error('Place ID is required');
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Place Details API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.result) {
      throw new Error(`Place Details error: ${data.status}`);
    }

    const location = data.result.geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: data.result.formatted_address,
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

/**
 * Convert coordinates to an address (reverse geocoding)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Formatted address
 */
export const reverseGeocode = async (lat, lng) => {
  if (!lat || !lng) {
    throw new Error('Latitude and longitude are required');
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured');
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error('Could not find address for these coordinates');
    }

    return data.results[0].formatted_address;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};
