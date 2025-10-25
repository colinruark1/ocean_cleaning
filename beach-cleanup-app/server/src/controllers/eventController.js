import { getDatabase } from '../config/database.js';
import { randomUUID } from 'crypto';

/**
 * Calculate distance between two lat/lon points (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * GET /events
 * Get all upcoming cleanup events
 */
export function getAllEvents(req, res, next) {
  try {
    const db = getDatabase();
    const { lat, lon, radius_km, organizer_id } = req.query;

    let query = `
      SELECT e.*, u.username as organizerName
      FROM events e
      JOIN users u ON e.organizerId = u.id
    `;
    const conditions = [];
    const values = [];

    if (organizer_id) {
      conditions.push('e.organizerId = ?');
      values.push(organizer_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY e.date ASC';

    let events = db.prepare(query).all(...values);

    // Filter by radius if lat/lon provided
    if (lat && lon && radius_km) {
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lon);
      const radiusKm = parseFloat(radius_km);

      events = events.filter(event => {
        const distance = calculateDistance(userLat, userLon, event.lat, event.lon);
        return distance <= radiusKm;
      });
    }

    // Get attendee counts for each event
    const eventsWithCounts = events.map(event => {
      const attendeeCount = db.prepare('SELECT COUNT(*) as count FROM event_attendees WHERE eventId = ?').get(event.id).count;
      return {
        eventId: event.id,
        eventName: event.eventName,
        description: event.description,
        date: event.date,
        lat: event.lat,
        lon: event.lon,
        address: event.address,
        organizer: {
          userId: event.organizerId,
          username: event.organizerName
        },
        attendeeCount,
        createdAt: event.createdAt
      };
    });

    res.status(200).json(eventsWithCounts);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /events
 * Create a new cleanup event
 */
export function createEvent(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { eventName, description, date, lat, lon, address } = req.body;

    // Validation
    if (!eventName || !date || !lat || !lon) {
      return res.status(400).json({ error: 'eventName, date, lat, and lon are required' });
    }

    const eventId = randomUUID();
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO events (id, eventName, description, date, lat, lon, address, organizerId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(eventId, eventName, description, date, lat, lon, address, userId, now, now);

    // Get created event with organizer info
    const event = db.prepare(`
      SELECT e.*, u.username as organizerName
      FROM events e
      JOIN users u ON e.organizerId = u.id
      WHERE e.id = ?
    `).get(eventId);

    res.status(201).json({
      eventId: event.id,
      eventName: event.eventName,
      description: event.description,
      date: event.date,
      lat: event.lat,
      lon: event.lon,
      address: event.address,
      organizer: {
        userId: event.organizerId,
        username: event.organizerName
      },
      createdAt: event.createdAt
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /events/:eventId
 * Get full details for one event
 */
export function getEventById(req, res, next) {
  try {
    const db = getDatabase();
    const { eventId } = req.params;

    // Get event with organizer info
    const event = db.prepare(`
      SELECT e.*, u.username as organizerName
      FROM events e
      JOIN users u ON e.organizerId = u.id
      WHERE e.id = ?
    `).get(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get attendees
    const attendees = db.prepare(`
      SELECT u.id, u.username, u.profilePictureUrl
      FROM event_attendees ea
      JOIN users u ON ea.userId = u.id
      WHERE ea.eventId = ?
      ORDER BY ea.joinedAt ASC
    `).all(eventId);

    res.status(200).json({
      eventId: event.id,
      eventName: event.eventName,
      description: event.description,
      date: event.date,
      lat: event.lat,
      lon: event.lon,
      address: event.address,
      organizer: {
        userId: event.organizerId,
        username: event.organizerName
      },
      attendees: attendees.map(a => ({
        userId: a.id,
        username: a.username,
        profilePictureUrl: a.profilePictureUrl
      })),
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /events/:eventId/join
 * RSVP for an event
 */
export function joinEvent(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { eventId } = req.params;

    // Check if event exists
    const event = db.prepare('SELECT id FROM events WHERE id = ?').get(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already joined
    const existing = db.prepare('SELECT * FROM event_attendees WHERE eventId = ? AND userId = ?').get(eventId, userId);
    if (existing) {
      return res.status(400).json({ error: 'Already joined this event' });
    }

    // Add attendee
    const insert = db.prepare(`
      INSERT INTO event_attendees (eventId, userId, joinedAt)
      VALUES (?, ?, ?)
    `);

    insert.run(eventId, userId, new Date().toISOString());

    res.status(200).json({ message: 'Successfully joined event' });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /events/:eventId/leave
 * Remove RSVP for an event
 */
export function leaveEvent(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { eventId } = req.params;

    // Remove attendee
    const result = db.prepare('DELETE FROM event_attendees WHERE eventId = ? AND userId = ?').run(eventId, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Not attending this event' });
    }

    res.status(200).json({ message: 'Successfully left event' });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /events/:eventId
 * Delete/cancel an event (organizer only)
 */
export function deleteEvent(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.userId;
    const { eventId } = req.params;

    // Check if user is organizer
    const event = db.prepare('SELECT organizerId FROM events WHERE id = ?').get(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.organizerId !== userId) {
      return res.status(403).json({ error: 'Only the event organizer can delete this event' });
    }

    // Delete event (cascades to attendees)
    db.prepare('DELETE FROM events WHERE id = ?').run(eventId);

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
}
