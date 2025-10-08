// server/controllers/locationsController.js
import { pool } from '../config/database.js';

/**
 * GET /api/locations
 */
export async function getAllLocations(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, slug, description, latitude, longitude, image_url
      FROM locations
      ORDER BY name
    `);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('getAllLocations error', err);
    return res.status(500).json({ error: 'Failed to fetch locations' });
  }
}

/**
 * GET /api/locations/:id
 */
export async function getLocationById(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM locations WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Location not found' });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('getLocationById error', err);
    return res.status(500).json({ error: 'Failed to fetch location' });
  }
}

/**
 * POST /api/locations
 * body: { name, slug, description, latitude, longitude, image_url }
 */
export async function createLocation(req, res) {
  const { name, slug, description, latitude, longitude, image_url } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Missing required: name or slug' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO locations (name, slug, description, latitude, longitude, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, slug, description || null, latitude || null, longitude || null, image_url || null]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createLocation error', err);
    return res.status(500).json({ error: 'Failed to create location' });
  }
}

/**
 * PATCH /api/locations/:id
 */
export async function updateLocation(req, res) {
  const { id } = req.params;
  const { name, slug, description, latitude, longitude, image_url } = req.body;

  const fields = [];
  const values = [];
  let idx = 1;
  if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
  if (slug !== undefined) { fields.push(`slug = $${idx++}`); values.push(slug); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (latitude !== undefined) { fields.push(`latitude = $${idx++}`); values.push(latitude); }
  if (longitude !== undefined) { fields.push(`longitude = $${idx++}`); values.push(longitude); }
  if (image_url !== undefined) { fields.push(`image_url = $${idx++}`); values.push(image_url); }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  try {
    const sql = `UPDATE locations SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    values.push(id);
    const { rows } = await pool.query(sql, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Location not found' });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('updateLocation error', err);
    return res.status(500).json({ error: 'Failed to update location' });
  }
}

/**
 * DELETE /api/locations/:id
 */
export async function deleteLocation(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('DELETE FROM locations WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Location not found' });
    return res.status(200).json({ message: 'Location deleted', location: rows[0] });
  } catch (err) {
    console.error('deleteLocation error', err);
    return res.status(500).json({ error: 'Failed to delete location' });
  }
}
