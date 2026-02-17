const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const driversRoutes = require('./driversRoutes');
const ridersRoutes = require('./ridersRoutes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CarConnect API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Driver routes (e.g. POST /api/drivers/rides)
router.use('/drivers', driversRoutes);

// Rider routes (e.g. GET /api/riders/rides/search)
router.use('/riders', ridersRoutes);

module.exports = router;
