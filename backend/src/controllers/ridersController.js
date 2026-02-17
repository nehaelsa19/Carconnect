const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');

/** Format ride_date as YYYY-MM-DD, ride_time as HH:mm, include driver_name */
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
    formatted.ride_time = t.length >= 5 ? t.slice(0, 5) : t;
  }
  // Include driver_name if present (from JOIN)
  if (ride.driver_name) {
    formatted.driver_name = ride.driver_name;
  }
  return formatted;
}

/** Format booking + ride details for rider bookings response */
function formatBookingForResponse(booking) {
  if (!booking) return booking;
  const formatted = { ...booking };

  if (booking.ride_date) {
    const d =
      typeof booking.ride_date === 'string' && booking.ride_date.includes('T')
        ? booking.ride_date.split('T')[0]
        : booking.ride_date instanceof Date
          ? booking.ride_date.toISOString().split('T')[0]
          : String(booking.ride_date).slice(0, 10);
    formatted.ride_date = d;
  }

  if (booking.ride_time) {
    const t = String(booking.ride_time);
    formatted.ride_time = t.length >= 5 ? t.slice(0, 5) : t;
  }

  return formatted;
}

/**
 * GET /api/riders/rides/search
 * Search available rides: active only, seats_available > seats_booked.
 * Optional query: from_location, to_location, ride_date, ride_time, page, limit.
 * Sorted by nearest upcoming ride date/time; results paginated.
 */
exports.searchRides = async (req, res, next) => {
  try {
    const { from_location, to_location, ride_date, ride_time, page, limit } =
      req.query;

    const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
    const limitNum = limit
      ? Math.min(100, Math.max(1, parseInt(limit, 10)))
      : 20;

    const { rows, total } = await Ride.searchAvailable({
      from_location: from_location?.trim() || undefined,
      to_location: to_location?.trim() || undefined,
      ride_date: ride_date?.trim() || undefined,
      ride_time: ride_time?.trim() || undefined,
      page: pageNum,
      limit: limitNum,
      rider_id: req.user?.id,
    });

    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      success: true,
      data: rows.map(formatRideForResponse),
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
 * POST /api/riders/rides/:rideId/requests
 * Rider requests a seat on a ride.
 * - Requires authentication (req.user set by auth middleware)
 * - Validates ride exists, is active, and has seats available
 * - Prevents drivers from requesting their own ride
 * - Prevents duplicate requests from the same rider for the same ride
 */
exports.requestSeat = async (req, res, next) => {
  try {
    const riderId = req.user.id;
    const rideId = parseInt(req.params.rideId, 10);

    if (Number.isNaN(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID.',
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'You can only request seats on active rides.',
      });
    }

    if (ride.driver_id === riderId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request a seat on your own ride.',
      });
    }

    const seatsLeft = ride.seats_available - ride.seats_booked;
    if (seatsLeft <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No seats available for this ride.',
      });
    }

    const existing = await RideRequest.findByRideAndRider(rideId, riderId);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already requested a seat for this ride.',
      });
    }

    const request = await RideRequest.create({
      ride_id: rideId,
      rider_id: riderId,
    });

    return res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/riders/bookings
 * Get all bookings for the authenticated rider.
 * Optional filters: status, from_date, to_date
 * Supports pagination: page, limit
 */
exports.getRiderBookings = async (req, res, next) => {
  try {
    const riderId = req.user.id;
    const { status, from_date, to_date, page, limit } = req.query;

    const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
    const limitNum = limit
      ? Math.min(100, Math.max(1, parseInt(limit, 10)))
      : 20;

    // Normalize status filter; map 'accepted' -> 'approved' to match DB values
    let normalizedStatus =
      typeof status === 'string' ? status.trim().toLowerCase() : undefined;

    if (normalizedStatus === 'accepted') {
      normalizedStatus = 'approved';
    }

    const allowedStatuses = new Set(['pending', 'approved', 'rejected']);
    if (normalizedStatus && !allowedStatuses.has(normalizedStatus)) {
      normalizedStatus = undefined;
    }

    const { rows, total } = await RideRequest.searchByRider({
      rider_id: riderId,
      status: normalizedStatus,
      from_date: from_date?.trim() || undefined,
      to_date: to_date?.trim() || undefined,
      page: pageNum,
      limit: limitNum,
    });

    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      success: true,
      data: rows.map(formatBookingForResponse),
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
