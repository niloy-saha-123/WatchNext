/**
 * @file config.js
 * @path /backend/config/config.js
 * @description Backend configuration management for environment variables and app settings
 */

// Load environment variables from .env file
require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017, // MongoDB default port
    name: process.env.DB_NAME || 'watchnext',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'secret-key-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // TMDB API Configuration
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    readAccessToken: process.env.TMDB_READ_ACCESS_TOKEN,
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  },

  // CORS Configuration
  cors: {
    origin: function (origin, callback) {
      // SECURITY: Reject requests without Origin header
      // This blocks curl, Postman, and other non-browser tools
      if (!origin) {
        return callback(new Error('Origin header required'));
      }
      
      // Define allowed origins
      const allowedOrigins = process.env.CORS_ORIGIN ? 
        process.env.CORS_ORIGIN.split(',') : 
        ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];
      
      // In development: Allow localhost origins only
      if (config.nodeEnv === 'development') {
        // Allow any localhost port for development flexibility
        if (origin.match(/^http:\/\/localhost:\d+$/)) {
          return callback(null, true);
        }
        
        // Also allow explicitly whitelisted origins
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        // Reject all other origins in development too
        return callback(new Error('Not allowed by CORS'));
      }
      
      // In production: Strict whitelist only
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Reject everything else
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // File Upload (for avatar images)
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

// Validation function to check required environment variables
const validateConfig = () => {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please create a .env file in the backend directory with the required variables');
    process.exit(1);
  }

  if (!config.tmdb.apiKey && !config.tmdb.readAccessToken) {
    console.warn('⚠️  TMDB API credentials not found. TMDB features will not work.');
    console.warn('Set TMDB_API_KEY or TMDB_READ_ACCESS_TOKEN in your .env file');
  }
};

module.exports = {
  config,
  validateConfig
};