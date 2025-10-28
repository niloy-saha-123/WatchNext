/**
 * @file EpisodeProgress.js
 * @path backend/models/EpisodeProgress.js
 * @description Mongoose model for TV show episode tracking
 */

const mongoose = require('mongoose');

const episodeProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  showId: {
    type: Number,
    required: true,
    index: true
  },
  showName: String,
  episodeProgress: {
    type: Map,
    of: Boolean, // episodeNumber -> watched
    default: new Map()
  },
  lastWatchedSeason: {
    type: Number,
    default: 1
  },
  lastWatchedEpisode: {
    type: Number,
    default: 1
  },
  totalSeasons: Number,
  totalEpisodes: Number
}, {
  timestamps: true
});

// One progress entry per user per show
episodeProgressSchema.index({ user: 1, showId: 1 }, { unique: true });

module.exports = mongoose.model('EpisodeProgress', episodeProgressSchema);

