import axios from 'axios';
import { getDatabase } from '../config/database.js';

/**
 * GET /data/tides
 * Get tide predictions for event planning
 * Query params: lat, lon, date
 */
export async function getTides(req, res, next) {
  try {
    const { lat, lon, date } = req.query;

    if (!lat || !lon || !date) {
      return res.status(400).json({ error: 'lat, lon, and date are required' });
    }

    // NOAA API requires a station ID, not lat/lon directly
    // In a production app, you'd:
    // 1. Find the nearest station using NOAA's stations API
    // 2. Cache station lookups
    // For this demo, we'll use a sample station (8454000 - Providence, RI)
    // You can find stations at: https://tidesandcurrents.noaa.gov/

    const stationId = '8454000'; // Sample station - should be determined by lat/lon lookup

    const noaaUrl = `${process.env.NOAA_API_BASE_URL}`;

    const params = {
      product: 'predictions',
      application: 'beach_cleanup_app',
      begin_date: date.replace(/-/g, ''),
      end_date: date.replace(/-/g, ''),
      datum: 'MLLW',
      station: stationId,
      time_zone: 'lst_ldt',
      units: 'english',
      interval: 'hilo',
      format: 'json'
    };

    try {
      const response = await axios.get(noaaUrl, { params });

      if (response.data && response.data.predictions) {
        const predictions = response.data.predictions.map(pred => ({
          type: pred.type === 'L' ? 'Low' : 'High',
          time: pred.t.split(' ')[1], // Extract time portion
          height: `${pred.v} ft`
        }));

        res.status(200).json({
          date,
          station: stationId,
          predictions
        });
      } else {
        throw new Error('No tide data available');
      }
    } catch (apiError) {
      console.error('NOAA API Error:', apiError.message);
      // Return sample data for demo purposes
      res.status(200).json({
        date,
        station: stationId,
        predictions: [
          { type: 'Low', time: '6:42 AM', height: '0.3 ft' },
          { type: 'High', time: '12:28 PM', height: '4.2 ft' },
          { type: 'Low', time: '7:15 PM', height: '0.5 ft' }
        ],
        note: 'Sample data - Configure proper NOAA station lookup for production'
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /data/water-quality
 * Get water quality advisory for a location
 * Query params: lat, lon
 */
export async function getWaterQuality(req, res, next) {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    // EPA BEACON API
    // Note: The actual EPA API structure may vary. This is a simplified example.
    // You may need to use different endpoints or parameters based on the actual API documentation.

    try {
      // Attempt to fetch from EPA API
      // const epaUrl = `${process.env.EPA_API_BASE_URL}/beaches`;
      // const response = await axios.get(epaUrl, {
      //   params: { latitude: lat, longitude: lon, radius: 10 }
      // });

      // For now, return sample data
      // In production, parse the actual EPA API response

      // Simulate varying water quality based on coordinates
      const random = Math.random();
      let status, message;

      if (random < 0.7) {
        status = 'SAFE';
        message = 'No advisories at this time. Water quality is good.';
      } else if (random < 0.9) {
        status = 'CAUTION';
        message = 'Moderate bacteria levels detected. Swimming not recommended for sensitive individuals.';
      } else {
        status = 'ADVISORY';
        message = 'High bacteria count reported. Avoid water contact.';
      }

      res.status(200).json({
        status,
        message,
        source: 'EPA BEACON',
        coordinates: { lat, lon },
        lastUpdated: new Date().toISOString(),
        note: 'Sample data - Integrate with actual EPA/USGS API for production'
      });
    } catch (apiError) {
      console.error('EPA API Error:', apiError.message);
      res.status(200).json({
        status: 'UNKNOWN',
        message: 'Unable to retrieve water quality data at this time.',
        source: 'EPA BEACON',
        coordinates: { lat, lon }
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /data/debris-hotspots
 * Get known debris concentration areas
 * Query params: lat, lon, radius_km
 */
export function getDebrisHotspots(req, res, next) {
  try {
    const db = getDatabase();
    const { lat, lon, radius_km } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }

    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const radiusKm = parseFloat(radius_km) || 50;

    // Get all hotspots from database
    const allHotspots = db.prepare('SELECT * FROM debris_hotspots').all();

    // Filter by radius using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearbyHotspots = allHotspots
      .map(hotspot => ({
        ...hotspot,
        distance: calculateDistance(userLat, userLon, hotspot.lat, hotspot.lon)
      }))
      .filter(hotspot => hotspot.distance <= radiusKm)
      .sort((a, b) => b.debrisScore - a.debrisScore) // Sort by debris score (highest first)
      .map(hotspot => ({
        location: hotspot.location,
        debrisScore: hotspot.debrisScore,
        lat: hotspot.lat,
        lon: hotspot.lon,
        description: hotspot.description,
        distanceKm: Math.round(hotspot.distance * 10) / 10 // Round to 1 decimal
      }));

    res.status(200).json(nearbyHotspots);
  } catch (error) {
    next(error);
  }
}
