/**
 * @file WatchlistItem.js
 * @path backend/models/WatchlistItem.js
 * @description Mongoose model for user watchlist items
 */

const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mediaId: {
    type: Number,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
  },
  title: String,
  posterPath: String,
  releaseDate: String,
  overview: String,
  voteAverage: Number
}, {
  timestamps: true
});

// Prevent duplicates
watchlistItemSchema.index({ user: 1, mediaId: 1, mediaType: 1 }, { unique: true });

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);

