/**
 * @file WatchHistory.js
 * @path backend/models/WatchHistory.js
 * @description Mongoose model for watched movies and TV shows
 */

const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
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
  backdropPath: String,
  releaseDate: String,
  overview: String,
  voteAverage: Number,
  runtime: Number,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  isCompleted: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Prevent duplicates
watchHistorySchema.index({ user: 1, mediaId: 1, mediaType: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);

