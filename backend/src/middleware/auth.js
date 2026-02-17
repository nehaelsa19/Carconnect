const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT and set req.user.
 * Expects Authorization: Bearer <token>
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
    next(error);
  }
};

/**
 * Restrict to users with role = 'driver'.
 * Must be used after authenticate.
 */
const requireDriver = (req, res, next) => {
  if (req.user && req.user.role === 'driver') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Only drivers can perform this action.',
  });
};

module.exports = {
  authenticate,
  requireDriver,
};
