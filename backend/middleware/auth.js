/**
 * @file auth.js
 * @path backend/middleware/auth.js
 * @description JWT authentication middleware for protecting routes
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { config } = require('../config/config');

/**
 * Middleware to authenticate JWT tokens
 * Adds user information to req.user if token is valid
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from HttpOnly cookie
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Check if token has userId (not a refresh token)
    if (decoded.type === 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Find user and check if still active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token has expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token provided, but adds user to req if token is valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    // Get token from HttpOnly cookie
    const token = req.cookies.accessToken;

    if (!token) {
      // No token provided, continue without user
      req.user = null;
      return next();
    }

    // Try to verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    if (decoded.type === 'refresh') {
      req.user = null;
      return next();
    }

    const user = await User.findById(decoded.userId);
    req.user = (user && user.isActive) ? user : null;
    
    next();

  } catch (error) {
    // Token invalid, but continue without user
    req.user = null;
    next();
  }
};

/**
 * Middleware to check if user has specific role (for future use)
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // For now, all users have the same role
    // In future, can add role-based access control
    if (req.user.role && req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Middleware to get current user profile
 */
const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // User is already attached to req.user by authenticateToken
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          memberSince: req.user.memberSince,
          avatar: req.user.avatar,
          lastLogin: req.user.lastLogin,
          phone: req.user.phone
        }
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  getCurrentUser
};
