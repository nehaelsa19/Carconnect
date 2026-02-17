const db = require('../config/database');

class RideRequest {
  // Create a new ride request (pending by default)
  static async create({ ride_id, rider_id, status = 'pending' }) {
    const query = `
      INSERT INTO ride_requests (ride_id, rider_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [ride_id, rider_id, status]);
    return result.rows[0];
  }

  // Find by ID
  static async findById(id) {
    const query = 'SELECT * FROM ride_requests WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Find by ride (all requests for a ride)
  static async findByRideId(ride_id) {
    const query =
      'SELECT * FROM ride_requests WHERE ride_id = $1 ORDER BY requested_at DESC';
    const result = await db.query(query, [ride_id]);
    return result.rows;
  }

  // Find by rider (all requests by a user)
  static async findByRiderId(rider_id) {
    const query =
      'SELECT * FROM ride_requests WHERE rider_id = $1 ORDER BY requested_at DESC';
    const result = await db.query(query, [rider_id]);
    return result.rows;
  }

  // Check if rider already has a request for this ride (unique constraint also enforces this)
  static async findByRideAndRider(ride_id, rider_id) {
    const query =
      'SELECT * FROM ride_requests WHERE ride_id = $1 AND rider_id = $2';
    const result = await db.query(query, [ride_id, rider_id]);
    return result.rows[0];
  }

  // Update status and set approved_at or rejected_at
  static async update(id, updates) {
    const allowed = ['status', 'approved_at', 'rejected_at'];
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex += 1;
      }
    }

    if (setClauses.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE ride_requests
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Approve request (sets status and approved_at)
  static async approve(id) {
    const query = `
      UPDATE ride_requests
      SET status = 'approved', approved_at = CURRENT_TIMESTAMP, rejected_at = NULL
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Reject request (sets status and rejected_at)
  static async reject(id) {
    const query = `
      UPDATE ride_requests
      SET status = 'rejected', rejected_at = CURRENT_TIMESTAMP, approved_at = NULL
      WHERE id = $1
      RETURNING *
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Delete request
  static async delete(id) {
    const query = 'DELETE FROM ride_requests WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Search bookings for a rider, with optional status and date filters, paginated.
   * Joins rides (and drivers) so the rider can see ride details along with booking info.
   * @param {Object} options - rider_id (required), status, from_date, to_date, page, limit
   * @returns {Promise<{ rows: Array, total: number }>}
   */
  static async searchByRider(options = {}) {
    const {
      rider_id,
      status,
      from_date,
      to_date,
      page = 1,
      limit = 20,
    } = options;

    if (!rider_id) {
      throw new Error('rider_id is required for searchByRider');
    }

    const conditions = ['rr.rider_id = $1'];
    const values = [rider_id];
    let paramIndex = 2;

    if (status) {
      conditions.push(`rr.status = $${paramIndex}`);
      values.push(status);
      paramIndex += 1;
    }

    if (from_date) {
      conditions.push(`r.ride_date >= $${paramIndex}`);
      values.push(from_date);
      paramIndex += 1;
    }

    if (to_date) {
      conditions.push(`r.ride_date <= $${paramIndex}`);
      values.push(to_date);
      paramIndex += 1;
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM ride_requests rr
      INNER JOIN rides r ON rr.ride_id = r.id
      WHERE ${whereClause}
    `;
    const countResult = await db.query(countQuery, values);
    const total = countResult.rows[0].total;

    const offset = Math.max(0, (page - 1) * limit);
    const limitVal = Math.min(Math.max(1, limit), 100);

    const dataQuery = `
      SELECT
        rr.*,
        r.from_location,
        r.to_location,
        r.ride_date,
        r.ride_time,
        r.vehicle_name,
        r.vehicle_number,
        r.driver_id,
        u.name AS driver_name
      FROM ride_requests rr
      INNER JOIN rides r ON rr.ride_id = r.id
      INNER JOIN users u ON r.driver_id = u.id
      WHERE ${whereClause}
      ORDER BY rr.requested_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await db.query(dataQuery, [...values, limitVal, offset]);

    return { rows: dataResult.rows, total };
  }

  /**
   * Get all ride requests for rides owned by a driver.
   * Joins with rides and users (riders) to include ride and rider details.
   * @param {Object} options - driver_id (required), ride_id (optional), status (optional), page, limit
   * @returns {Promise<{ rows: Array, total: number }>}
   */
  static async findByDriver(options = {}) {
    const { driver_id, ride_id, status, page = 1, limit = 20 } = options;

    if (!driver_id) {
      throw new Error('driver_id is required for findByDriver');
    }

    const conditions = ['r.driver_id = $1'];
    const values = [driver_id];
    let paramIndex = 2;

    if (ride_id) {
      conditions.push(`rr.ride_id = $${paramIndex}`);
      values.push(ride_id);
      paramIndex += 1;
    }

    if (status) {
      conditions.push(`rr.status = $${paramIndex}`);
      values.push(status);
      paramIndex += 1;
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM ride_requests rr
      INNER JOIN rides r ON rr.ride_id = r.id
      WHERE ${whereClause}
    `;
    const countResult = await db.query(countQuery, values);
    const total = countResult.rows[0].total;

    const offset = Math.max(0, (page - 1) * limit);
    const limitVal = Math.min(Math.max(1, limit), 100);

    const dataQuery = `
      SELECT
        rr.*,
        r.from_location,
        r.to_location,
        r.ride_date,
        r.ride_time,
        r.vehicle_name,
        r.vehicle_number,
        r.seats_available,
        r.seats_booked,
        u.name AS rider_name,
        u.email AS rider_email
      FROM ride_requests rr
      INNER JOIN rides r ON rr.ride_id = r.id
      INNER JOIN users u ON rr.rider_id = u.id
      WHERE ${whereClause}
      ORDER BY rr.requested_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await db.query(dataQuery, [...values, limitVal, offset]);

    return { rows: dataResult.rows, total };
  }
}

module.exports = RideRequest;
