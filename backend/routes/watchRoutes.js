/**
 * @file watchRoutes.js
 * @path backend/routes/watchRoutes.js
 * @description API routes for user watch data (movies, shows, watchlist)
 */

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { csrfProtect } = require('../middleware/csrf');
const { body, validationResult, param } = require('express-validator');
const WatchHistory = require('../models/WatchHistory');
const WatchlistItem = require('../models/WatchlistItem');
const EpisodeProgress = require('../models/EpisodeProgress');

const router = express.Router();

// All routes require authentication and CSRF for write actions
router.use(authenticateToken);
router.use(csrfProtect);

// ========================================
// WATCH HISTORY ROUTES (Movies & TV Shows)
// ========================================

// GET /api/watch/history - Get user's watch history
router.get('/history', async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id });
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching watch history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch watch history' });
  }
});

// POST /api/watch/history - Add movie/show to watch history
router.post(
  '/history',
  [
    body('mediaId').isInt().toInt(),
    body('mediaType').isIn(['movie', 'tv']),
    body('title').optional().isString().trim(),
    body('posterPath').optional().isString(),
    body('backdropPath').optional().isString(),
    body('releaseDate').optional().isString(),
    body('overview').optional().isString(),
    body('voteAverage').optional().isFloat({ min: 0 }).toFloat(),
    body('runtime').optional().isInt({ min: 0 }).toInt(),
    body('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
    body('notes').optional().isString().trim(),
    body('isCompleted').optional().isBoolean().toBoolean(),
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const historyData = {
      user: req.user._id,
      mediaId: req.body.mediaId,
      mediaType: req.body.mediaType,
      title: req.body.title,
      posterPath: req.body.posterPath,
      backdropPath: req.body.backdropPath,
      releaseDate: req.body.releaseDate,
      overview: req.body.overview,
      voteAverage: req.body.voteAverage,
      runtime: req.body.runtime,
      rating: req.body.rating ?? null,
      notes: req.body.notes ?? '',
      isCompleted: req.body.isCompleted ?? true,
    };
    
    const historyItem = await WatchHistory.findOneAndUpdate(
      { user: req.user._id, mediaId: req.body.mediaId, mediaType: req.body.mediaType },
      historyData,
      { upsert: true, new: true, runValidators: true }
    );
    
    res.json({ success: true, data: historyItem });
  } catch (error) {
    console.error('Error adding to watch history:', error);
    res.status(500).json({ success: false, message: 'Failed to add to watch history' });
  }
});

// PUT /api/watch/history/:id - Update watch history item (rating, notes)
router.put('/history/:id', [
  param('id').isMongoId(),
  body('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('notes').optional().isString().trim(),
  body('isCompleted').optional().isBoolean().toBoolean(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const historyItem = await WatchHistory.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        ...(typeof req.body.rating !== 'undefined' ? { rating: req.body.rating } : {}),
        ...(typeof req.body.notes !== 'undefined' ? { notes: req.body.notes } : {}),
        ...(typeof req.body.isCompleted !== 'undefined' ? { isCompleted: req.body.isCompleted } : {}),
      },
      { new: true, runValidators: true }
    );
    
    if (!historyItem) {
      return res.status(404).json({ success: false, message: 'Watch history item not found' });
    }
    
    res.json({ success: true, data: historyItem });
  } catch (error) {
    console.error('Error updating watch history:', error);
    res.status(500).json({ success: false, message: 'Failed to update watch history' });
  }
});

// DELETE /api/watch/history/:id - Remove from watch history
router.delete('/history/:id', [param('id').isMongoId()], async (req, res) => {
  try {
    const historyItem = await WatchHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!historyItem) {
      return res.status(404).json({ success: false, message: 'Watch history item not found' });
    }
    
    res.json({ success: true, message: 'Removed from watch history' });
  } catch (error) {
    console.error('Error deleting watch history:', error);
    res.status(500).json({ success: false, message: 'Failed to delete watch history' });
  }
});

// ========================================
// WATCHLIST ROUTES
// ========================================

// GET /api/watch/watchlist - Get user's watchlist
router.get('/watchlist', async (req, res) => {
  try {
    const watchlist = await WatchlistItem.find({ user: req.user._id });
    res.json({ success: true, data: watchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch watchlist' });
  }
});

// POST /api/watch/watchlist - Add item to watchlist
router.post('/watchlist', [
  body('mediaId').isInt().toInt(),
  body('mediaType').isIn(['movie', 'tv']),
  body('title').optional().isString().trim(),
  body('posterPath').optional().isString(),
  body('releaseDate').optional().isString(),
  body('overview').optional().isString(),
  body('voteAverage').optional().isFloat({ min: 0 }).toFloat(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const watchlistData = {
      user: req.user._id,
      mediaId: req.body.mediaId,
      mediaType: req.body.mediaType,
      title: req.body.title,
      posterPath: req.body.posterPath,
      releaseDate: req.body.releaseDate,
      overview: req.body.overview,
      voteAverage: req.body.voteAverage,
    };
    
    const watchlistItem = await WatchlistItem.findOneAndUpdate(
      { user: req.user._id, mediaId: req.body.mediaId, mediaType: req.body.mediaType },
      watchlistData,
      { upsert: true, new: true, runValidators: true }
    );
    
    res.json({ success: true, data: watchlistItem });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ success: false, message: 'Failed to add to watchlist' });
  }
});

// DELETE /api/watch/watchlist/:id - Remove from watchlist
router.delete('/watchlist/:id', [param('id').isMongoId()], async (req, res) => {
  try {
    const watchlistItem = await WatchlistItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!watchlistItem) {
      return res.status(404).json({ success: false, message: 'Watchlist item not found' });
    }
    
    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Error deleting watchlist item:', error);
    res.status(500).json({ success: false, message: 'Failed to remove from watchlist' });
  }
});

// ========================================
// EPISODE PROGRESS ROUTES
// ========================================

// GET /api/watch/progress - Get user's episode progress
router.get('/progress', async (req, res) => {
  try {
    const progress = await EpisodeProgress.find({ user: req.user._id });
    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error fetching episode progress:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch episode progress' });
  }
});

// POST /api/watch/progress - Update episode progress
router.post('/progress', [
  body('showId').isInt().toInt(),
  body('showName').optional().isString().trim(),
  body('episodeProgress').optional().isObject(),
  body('totalSeasons').optional().isInt({ min: 0 }).toInt(),
  body('totalEpisodes').optional().isInt({ min: 0 }).toInt(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { showId, showName, episodeProgress, totalSeasons, totalEpisodes } = req.body;
    
    const progress = await EpisodeProgress.findOneAndUpdate(
      { user: req.user._id, showId },
      { 
        user: req.user._id,
        showId,
        showName,
        episodeProgress,
        totalSeasons,
        totalEpisodes
      },
      { upsert: true, new: true, runValidators: true }
    );
    
    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error updating episode progress:', error);
    res.status(500).json({ success: false, message: 'Failed to update episode progress' });
  }
});

// DELETE /api/watch/progress/:id - Remove episode progress
router.delete('/progress/:id', [param('id').isMongoId()], async (req, res) => {
  try {
    const progress = await EpisodeProgress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Episode progress not found' });
    }
    
    res.json({ success: true, message: 'Removed episode progress' });
  } catch (error) {
    console.error('Error deleting episode progress:', error);
    res.status(500).json({ success: false, message: 'Failed to delete episode progress' });
  }
});

module.exports = router;

