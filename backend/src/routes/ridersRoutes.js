const express = require('express');
const router = express.Router();
const ridersController = require('../controllers/ridersController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/riders/rides/search:
 *   get:
 *     summary: Search available rides (rider)
 *     description: |
 *       Returns rides that are active and have seats available (seats_available > seats_booked).
 *       Optional filters: from_location, to_location, ride_date, ride_time.
 *       Results are paginated and sorted by nearest upcoming date/time.
 *     tags:
 *       - Riders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_location
 *         schema:
 *           type: string
 *         description: Filter by origin (partial match, case-insensitive)
 *       - in: query
 *         name: to_location
 *         schema:
 *           type: string
 *         description: Filter by destination (partial match, case-insensitive)
 *       - in: query
 *         name: ride_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by ride date (YYYY-MM-DD)
 *       - in: query
 *         name: ride_time
 *         schema:
 *           type: string
 *         description: Filter by ride time (e.g. 14:30)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Paginated list of available rides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ride'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized (no or invalid token)
 */
router.get('/rides/search', authenticate, ridersController.searchRides);

/**
 * Rider requests a seat on a specific ride.
 * POST /api/riders/rides/:rideId/requests
 */
router.post(
  '/rides/:rideId/requests',
  authenticate,
  ridersController.requestSeat
);

/**
 * @swagger
 * /api/riders/bookings:
 *   get:
 *     summary: Get all ride bookings for the authenticated rider
 *     description: |
 *       Returns all ride bookings created by the current rider, across all statuses
 *       (pending, approved, rejected, etc.), with optional filters and pagination.
 *     tags:
 *       - Riders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, accepted]
 *         description: Filter by booking status (\"accepted\" is treated as \"approved\")
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by earliest ride date (YYYY-MM-DD)
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by latest ride date (YYYY-MM-DD)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: Paginated list of rider bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Booking with ride details
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized (no or invalid token)
 */
router.get('/bookings', authenticate, ridersController.getRiderBookings);

module.exports = router;
