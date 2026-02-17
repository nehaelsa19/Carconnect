const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');

/** Format ride_date as YYYY-MM-DD, ride_time as HH:mm */
function formatRideForResponse(ride) {
  if (!ride) return ride;
  const formatted = { ...ride };
  if (ride.ride_date) {
    const d =
      typeof ride.ride_date === 'string' && ride.ride_date.includes('T')
        ? ride.ride_date.split('T')[0]
        : ride.ride_date instanceof Date
          ? ride.ride_date.toISOString().split('T')[0]
          : String(ride.ride_date).slice(0, 10);
    formatted.ride_date = d;
  }
  if (ride.ride_time) {
    const t = String(ride.ride_time);
    formatted.ride_time = t.length >= 5 ? t.slice(0, 5) : t; // "14:30" or "14:30:00" -> "14:30"
  }
  return formatted;
}

/** Normalize ride_date to YYYY-MM-DD (pg may return Date object or string) */
function toDateStr(val) {
  if (val == null) return '';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val))
    return val.slice(0, 10);
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(val).slice(0, 10);
}

/** Normalize ride_time to HH:mm for comparison */
function toTimeStr(val) {
  if (val == null) return '00:00';
  const s = String(val);
  if (s.length >= 5) return s.slice(0, 5);
  return s;
}

/**
 * Compute filter buckets for driver rides.
 * - all: every ride
 * - upcoming: ride_date > today, or (ride_date = today and ride_time >= now)
 * - completed: ride_date < today (excluding cancelled)
 */
function bucketRidesByFilter(rides) {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const upcoming = rides.filter(r => {
    if (r.status === 'cancelled') return false;
    const d = toDateStr(r.ride_date);
    if (!d) return false;
    if (d > todayStr) return true;
    if (d < todayStr) return false;
    const t = toTimeStr(r.ride_time);
    return t >= nowTime;
  });
  const completed = rides.filter(r => {
    if (r.status === 'cancelled') return false;
    const d = toDateStr(r.ride_date);
    if (!d) return false;
    return d < todayStr;
  });

  return { all: rides, upcoming, completed };
}

/**
 * GET /api/drivers/rides
 * List rides posted by the authenticated driver.
 * Query: ?filter=all|upcoming|completed (default: all)
 * Returns data (filtered rides) and meta.counts (all, upcoming, completed).
 */
exports.list = async (req, res, next) => {
  try {
    const rides = await Ride.findByDriverId(req.user.id);
    const { all, upcoming, completed } = bucketRidesByFilter(rides);

    const filter = ['all', 'upcoming', 'completed'].includes(req.query.filter)
      ? req.query.filter
      : 'all';

    let data;
    if (filter === 'upcoming') {
      data = [...upcoming].sort((a, b) => {
        const da = toDateStr(a.ride_date);
        const db = toDateStr(b.ride_date);
        if (da !== db) return da.localeCompare(db);
        const ta = toTimeStr(a.ride_time);
        const tb = toTimeStr(b.ride_time);
        return ta.localeCompare(tb);
      });
    } else if (filter === 'completed') {
      data = [...completed].sort((a, b) => {
        const da = toDateStr(a.ride_date);
        const db = toDateStr(b.ride_date);
        if (da !== db) return db.localeCompare(da);
        const ta = toTimeStr(a.ride_time);
        const tb = toTimeStr(b.ride_time);
        return tb.localeCompare(ta);
      });
    } else {
      data = all;
    }

    return res.json({
      success: true,
      data: data.map(formatRideForResponse),
      meta: {
        counts: {
          all: all.length,
          upcoming: upcoming.length,
          completed: completed.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/drivers/rides
 * Create a new ride. Driver only. driver_id = req.user.id, seats_booked=0, status='active'.
 */
exports.create = async (req, res, next) => {
  try {
    const {
      vehicle_name,
      vehicle_number,
      from_location,
      to_location,
      ride_date,
      ride_time,
      seats_available,
      notes,
    } = req.body;

    // Validation - required fields
    const required = [
      'vehicle_name',
      'vehicle_number',
      'from_location',
      'to_location',
      'ride_date',
      'ride_time',
      'seats_available',
    ];
    const missing = required.filter(
      field => req.body[field] == null || req.body[field] === ''
    );
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    if (typeof seats_available !== 'number' || seats_available < 1) {
      return res.status(400).json({
        success: false,
        message: 'seats_available must be a number greater than 0',
      });
    }

    const ride = await Ride.create({
      driver_id: req.user.id,
      vehicle_name: vehicle_name.trim(),
      vehicle_number: vehicle_number.trim(),
      from_location: from_location.trim(),
      to_location: to_location.trim(),
      ride_date: ride_date,
      ride_time: ride_time,
      seats_available,
      seats_booked: 0,
      notes: notes ? notes.trim() : null,
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Ride created successfully',
      data: formatRideForResponse(ride),
    });
  } catch (error) {
    next(error);
  }
};

/** Format ride request with ride and rider details */
function formatRideRequestForResponse(request) {
  if (!request) return request;
  const formatted = { ...request };
  if (request.ride_date) {
    const d =
      typeof request.ride_date === 'string' && request.ride_date.includes('T')
        ? request.ride_date.split('T')[0]
        : request.ride_date instanceof Date
          ? request.ride_date.toISOString().split('T')[0]
          : String(request.ride_date).slice(0, 10);
    formatted.ride_date = d;
  }
  if (request.ride_time) {
    const t = String(request.ride_time);
    formatted.ride_time = t.length >= 5 ? t.slice(0, 5) : t;
  }
  return formatted;
}

/**
 * GET /api/drivers/requests
 * Get all ride requests for rides owned by the authenticated driver.
 * Optional filters: ride_id, status
 * Supports pagination: page, limit
 */
exports.getRequests = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const { ride_id, status, page, limit } = req.query;

    const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
    const limitNum = limit
      ? Math.min(100, Math.max(1, parseInt(limit, 10)))
      : 20;

    const rideIdNum = ride_id ? parseInt(ride_id, 10) : undefined;
    if (ride_id && Number.isNaN(rideIdNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride_id parameter',
      });
    }

    const { rows, total } = await RideRequest.findByDriver({
      driver_id: driverId,
      ride_id: rideIdNum,
      status: status?.trim() || undefined,
      page: pageNum,
      limit: limitNum,
    });

    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      success: true,
      data: rows.map(formatRideRequestForResponse),
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/drivers/requests/:requestId/approve
 * Approve a ride request.
 * - Updates request status to 'approved'
 * - Increments seats_booked in the ride
 * - Validates the request belongs to a ride owned by the driver
 * - Validates seats are still available
 */
exports.approveRequest = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const requestId = parseInt(req.params.requestId, 10);

    if (Number.isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID',
      });
    }

    const request = await RideRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Ride request not found',
      });
    }

    const ride = await Ride.findById(request.ride_id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    if (ride.driver_id !== driverId) {
      return res.status(403).json({
        success: false,
        message: 'You can only approve requests for your own rides',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}`,
      });
    }

    const seatsLeft = ride.seats_available - ride.seats_booked;
    if (seatsLeft <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No seats available for this ride',
      });
    }

    // Approve request and increment seats_booked atomically
    const approvedRequest = await RideRequest.approve(requestId);
    const updatedRide = await Ride.update(request.ride_id, {
      seats_booked: ride.seats_booked + 1,
    });

    return res.json({
      success: true,
      message: 'Ride request approved successfully',
      data: {
        request: formatRideRequestForResponse(approvedRequest),
        ride: formatRideForResponse(updatedRide),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/drivers/requests/:requestId/reject
 * Reject a ride request.
 * - Updates request status to 'rejected'
 * - Validates the request belongs to a ride owned by the driver
 * - If the request was previously approved, decrements seats_booked
 */
exports.rejectRequest = async (req, res, next) => {
  try {
    const driverId = req.user.id;
    const requestId = parseInt(req.params.requestId, 10);

    if (Number.isNaN(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID',
      });
    }

    const request = await RideRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Ride request not found',
      });
    }

    const ride = await Ride.findById(request.ride_id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
    }

    if (ride.driver_id !== driverId) {
      return res.status(403).json({
        success: false,
        message: 'You can only reject requests for your own rides',
      });
    }

    if (request.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Request is already rejected',
      });
    }

    // Reject request
    const rejectedRequest = await RideRequest.reject(requestId);

    // If it was previously approved, decrement seats_booked
    let updatedRide = ride;
    if (request.status === 'approved' && ride.seats_booked > 0) {
      updatedRide = await Ride.update(request.ride_id, {
        seats_booked: ride.seats_booked - 1,
      });
    }

    return res.json({
      success: true,
      message: 'Ride request rejected successfully',
      data: {
        request: formatRideRequestForResponse(rejectedRequest),
        ride: formatRideForResponse(updatedRide),
      },
    });
  } catch (error) {
    next(error);
  }
};
