const express = require('express');
const router = express.Router();
const ridesController = require('../controllers/ridesController');
const { authenticate, requireDriver } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         driver_id:
 *           type: integer
 *           description: ID of the driver who created the ride
 *         vehicle_name:
 *           type: string
 *         vehicle_number:
 *           type: string
 *         from_location:
 *           type: string
 *         to_location:
 *           type: string
 *         ride_date:
 *           type: string
 *           format: date
 *         ride_time:
 *           type: string
 *           format: time
 *         seats_available:
 *           type: integer
 *         seats_booked:
 *           type: integer
 *         notes:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           example: active
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         driver_id: 5
 *         vehicle_name: Honda City
 *         vehicle_number: KA-01-AB-1234
 *         from_location: Bangalore MG Road
 *         to_location: Mysore Bus Stand
 *         ride_date: 2025-02-15
 *         ride_time: 14:30:00
 *         seats_available: 3
 *         seats_booked: 0
 *         notes: AC car, luggage space available
 *         status: active
 *         created_at: 2025-02-11T10:30:00.000Z
 *         updated_at: 2025-02-11T10:30:00.000Z
 *
 *     CreateRideRequest:
 *       type: object
 *       required:
 *         - vehicle_name
 *         - vehicle_number
 *         - from_location
 *         - to_location
 *         - ride_date
 *         - ride_time
 *         - seats_available
 *       properties:
 *         vehicle_name:
 *           type: string
 *         vehicle_number:
 *           type: string
 *         from_location:
 *           type: string
 *         to_location:
 *           type: string
 *         ride_date:
 *           type: string
 *           format: date
 *           example: 2025-02-15
 *         ride_time:
 *           type: string
 *           format: time
 *           example: 14:30
 *         seats_available:
 *           type: integer
 *           minimum: 1
 *         notes:
 *           type: string
 *           nullable: true
 *       example:
 *         vehicle_name: Honda City
 *         vehicle_number: KA-01-AB-1234
 *         from_location: Bangalore MG Road
 *         to_location: Mysore Bus Stand
 *         ride_date: 2025-02-15
 *         ride_time: 14:30
 *         seats_available: 3
 *         notes: AC car, luggage space available
 */

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver-specific ride management
 */

/**
 * @swagger
 * /api/drivers/rides:
 *   get:
 *     summary: Get rides posted by the authenticated driver
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of driver's rides
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
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Authenticated user is not a driver
 *   post:
 *     summary: Create a new ride (driver only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRideRequest'
 *     responses:
 *       201:
 *         description: Ride created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Ride'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Authenticated user is not a driver
 */
// GET /api/drivers/rides - list driver's posted rides
router.get('/rides', authenticate, requireDriver, ridesController.list);
// POST /api/drivers/rides - create ride (driver only)
router.post('/rides', authenticate, requireDriver, ridesController.create);

/**
 * @swagger
 * /api/drivers/requests:
 *   get:
 *     summary: Get all ride requests for driver's rides
 *     description: |
 *       Returns all ride requests for rides owned by the authenticated driver.
 *       Optional filters: ride_id, status
 *       Supports pagination
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ride_id
 *         schema:
 *           type: integer
 *         description: Filter by specific ride ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by request status
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
 *         description: List of ride requests with ride and rider details
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
 *                 meta:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User is not a driver
 */
router.get(
  '/requests',
  authenticate,
  requireDriver,
  ridesController.getRequests
);

/**
 * @swagger
 * /api/drivers/requests/{requestId}/approve:
 *   patch:
 *     summary: Approve a ride request
 *     description: |
 *       Approves a ride request and increments seats_booked in the ride.
 *       Validates the request belongs to a ride owned by the driver.
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the ride request to approve
 *     responses:
 *       200:
 *         description: Request approved successfully
 *       400:
 *         description: Invalid request or no seats available
 *       403:
 *         description: Request does not belong to driver's ride
 *       404:
 *         description: Request or ride not found
 */
router.patch(
  '/requests/:requestId/approve',
  authenticate,
  requireDriver,
  ridesController.approveRequest
);

/**
 * @swagger
 * /api/drivers/requests/{requestId}/reject:
 *   patch:
 *     summary: Reject a ride request
 *     description: |
 *       Rejects a ride request. If previously approved, decrements seats_booked.
 *       Validates the request belongs to a ride owned by the driver.
 *     tags:
 *       - Drivers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the ride request to reject
 *     responses:
 *       200:
 *         description: Request rejected successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Request does not belong to driver's ride
 *       404:
 *         description: Request or ride not found
 */
router.patch(
  '/requests/:requestId/reject',
  authenticate,
  requireDriver,
  ridesController.rejectRequest
);

module.exports = router;
