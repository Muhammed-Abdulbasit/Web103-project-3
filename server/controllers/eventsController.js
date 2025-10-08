import { pool } from '../config/database.js';

/**
 * GET /api/events
 * Returns all events with optional joined location name
 */
export async function getAllEvents(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT e.id, e.title, e.description, e.date, e.location_id,
             l.name AS location_name, l.slug AS location_slug
      FROM events e
      LEFT JOIN locations l ON e.location_id = l.id
      ORDER BY e.date ASC
    `);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('getAllEvents error', err);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}

/**
 * GET /api/events/:id
 */
export async function getEventById(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('getEventById error', err);
    return res.status(500).json({ error: 'Failed to fetch event' });
  }
}

/**
 * GET /api/locations/:locationId/events
 * Returns all events for a specific location
 */
export async function getEventsByLocation(req, res) {
  const { locationId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT id, title, description, date, location_id
       FROM events
       WHERE location_id = $1
       ORDER BY date ASC`,
      [locationId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error('getEventsByLocation error', err);
    return res.status(500).json({ error: 'Failed to fetch events for location' });
  }
}

/**
 * POST /api/events
 * body: { title, description, date, location_id }
 */
export async function createEvent(req, res) {
  const { title, description, date, location_id } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing required field: title' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO events (title, description, date, location_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || null, date || null, location_id || null]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createEvent error', err);
    return res.status(500).json({ error: 'Failed to create event' });
  }
}

/**
 * PATCH /api/events/:id
 * body: partial fields to update (title, description, date, location_id)
 */
export async function updateEvent(req, res) {
  const { id } = req.params;
  const { title, description, date, location_id } = req.body;

  // build dynamic SET clause for partial updates
  const fields = [];
  const values = [];
  let idx = 1;
  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (date !== undefined) { fields.push(`date = $${idx++}`); values.push(date); }
  if (location_id !== undefined) { fields.push(`location_id = $${idx++}`); values.push(location_id); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  try {
    const sql = `UPDATE events SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    values.push(id);
    const { rows } = await pool.query(sql, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('updateEvent error', err);
    return res.status(500).json({ error: 'Failed to update event' });
  }
}

/**
 * DELETE /api/events/:id
 */
export async function deleteEvent(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json({ message: 'Event deleted', event: rows[0] });
  } catch (err) {
    console.error('deleteEvent error', err);
    return res.status(500).json({ error: 'Failed to delete event' });
  }
}
