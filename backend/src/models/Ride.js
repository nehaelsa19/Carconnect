const db = require('../config/database');

class Ride {
  // Create a new ride
  static async create({
    driver_id,
    vehicle_name,
    vehicle_number,
    from_location,
    to_location,
    ride_date,
    ride_time,
    seats_available,
    seats_booked = 0,
    notes = null,
    status = 'active',
  }) {
    const query = `
      INSERT INTO rides (
        driver_id, vehicle_name, vehicle_number,
        from_location, to_location, ride_date, ride_time,
        seats_available, seats_booked, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      driver_id,
      vehicle_name,
      vehicle_number,
      from_location,
      to_location,
      ride_date,
      ride_time,
      seats_available,
      seats_booked,
      notes,
      status,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Find ride by ID
  static async findById(id) {
    const query = 'SELECT * FROM rides WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Find rides by driver
  static async findByDriverId(driver_id) {
    const query =
      'SELECT * FROM rides WHERE driver_id = $1 ORDER BY ride_date, ride_time';
    const result = await db.query(query, [driver_id]);
    return result.rows;
  }

  // Find active rides (e.g. for listing available rides)
  static async findActive(filters = {}) {
    let query = 'SELECT * FROM rides WHERE status = $1';
    const values = ['active'];
    let paramIndex = 2;

    if (filters.ride_date) {
      query += ` AND ride_date = $${paramIndex}`;
      values.push(filters.ride_date);
      paramIndex += 1;
    }
    if (filters.from_location) {
      query += ` AND from_location ILIKE $${paramIndex}`;
      values.push(`%${filters.from_location}%`);
      paramIndex += 1;
    }
    if (filters.to_location) {
      query += ` AND to_location ILIKE $${paramIndex}`;
      values.push(`%${filters.to_location}%`);
      paramIndex += 1;
    }

    query += ' ORDER BY ride_date, ride_time';

    const result = await db.query(query, values);
    return result.rows;
  }

  /**
   * Search available rides for riders: active only, seats left, optional filters, paginated.
   * Optionally excludes rides that the given rider has already requested (pending/approved).
   * @param {Object} options - from_location, to_location, ride_date, ride_time, page, limit, rider_id
   * @returns {Promise<{ rows: Array, total: number }>}
   */
  static async searchAvailable(options = {}) {
    const {
      from_location,
      to_location,
      ride_date,
      ride_time,
      page = 1,
      limit = 20,
      rider_id,
    } = options;

    const conditions = [
      "r.status = 'active'",
      'r.seats_available > r.seats_booked',
    ];
    const values = [];
    let paramIndex = 1;

    if (from_location) {
      conditions.push(`r.from_location ILIKE $${paramIndex}`);
      values.push(`%${from_location}%`);
      paramIndex += 1;
    }
    if (to_location) {
      conditions.push(`r.to_location ILIKE $${paramIndex}`);
      values.push(`%${to_location}%`);
      paramIndex += 1;
    }
    if (ride_date) {
      conditions.push(`r.ride_date = $${paramIndex}`);
      values.push(ride_date);
      paramIndex += 1;
    }
    if (ride_time) {
      conditions.push(`r.ride_time = $${paramIndex}`);
      values.push(ride_time);
      paramIndex += 1;
    }

    // Exclude rides where this rider has any request (pending, approved, or rejected)
    if (rider_id) {
      conditions.push(
        `NOT EXISTS (
          SELECT 1
          FROM ride_requests rr
          WHERE rr.ride_id = r.id
            AND rr.rider_id = $${paramIndex}
        )`.replace(/\s+/g, ' ')
      );
      values.push(rider_id);
      paramIndex += 1;
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*)::int AS total FROM rides r WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const total = countResult.rows[0].total;

    const offset = Math.max(0, (page - 1) * limit);
    const limitVal = Math.min(Math.max(1, limit), 100);

    const dataQuery = `
      SELECT 
        r.*,
        u.name as driver_name
      FROM rides r
      INNER JOIN users u ON r.driver_id = u.id
      WHERE ${whereClause}
      ORDER BY r.ride_date ASC, r.ride_time ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await db.query(dataQuery, [...values, limitVal, offset]);

    return { rows: dataResult.rows, total };
  }

  // Update ride
  static async update(id, updates) {
    const allowed = [
      'vehicle_name',
      'vehicle_number',
      'from_location',
      'to_location',
      'ride_date',
      'ride_time',
      'seats_available',
      'seats_booked',
      'notes',
      'status',
    ];
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
      UPDATE rides
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Delete ride
  static async delete(id) {
    const query = 'DELETE FROM rides WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Ride;
