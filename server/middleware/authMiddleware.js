const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if token looks like a mock token (from development environment)
      if (token.startsWith('mock-jwt-token-')) {
        res.status(401);
        throw new Error('Invalid token format. Please log in again.');
      }

      // Set a default JWT_SECRET if not in environment (NOT RECOMMENDED FOR PRODUCTION)
      const jwtSecret = process.env.JWT_SECRET || 'kisanmanchdefaultsecret2024';

      // Verify token
      const decoded = jwt.verify(token, jwtSecret);

      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to restrict access to admin users
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };
