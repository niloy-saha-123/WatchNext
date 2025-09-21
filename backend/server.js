/**
 * @file server.js
 * @path /backend/server.js
 * @description Main Express server for WatchNext backend API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { config, validateConfig } = require('./config/config');

// Validate configuration on startup
validateConfig();

const app = express();

// Trust proxy if behind reverse proxy (Heroku, Nginx, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: config.nodeEnv 
  });
});

// API Routes
app.use('/api/media', require('./routes/mediaRoutes'));

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'WatchNext API',
    version: '1.0.0',
    description: 'Backend API for WatchNext movie/TV tracking application',
    endpoints: {
      health: 'GET /health',
      media: {
        popular: 'GET /api/media/popular?type=movie|tv&page=1',
        trending: 'GET /api/media/trending?type=all|movie|tv&time=day|week',
        search: 'GET /api/media/search?q=query&page=1',
        movieDetails: 'GET /api/media/movie/:id',
        tvDetails: 'GET /api/media/tv/:id',
        featured: 'GET /api/media/featured'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(config.nodeEnv === 'development' && { details: err.message })
  });
});

// Start server
const PORT = config.port;
const HOST = config.host;

app.listen(PORT, HOST, () => {
  console.log(`🚀 WatchNext Backend Server running at http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🎬 TMDB Integration: ${config.tmdb.apiKey || config.tmdb.readAccessToken ? '✅ Configured' : '❌ Missing credentials'}`);
  console.log(`📖 API Documentation: http://${HOST}:${PORT}/api`);
});

module.exports = app;