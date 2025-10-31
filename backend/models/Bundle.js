/**
 * @file Bundle.js
 * @path backend/models/Bundle.js
 * @description Mongoose model for user bundles (folders of movies/shows)
 */

const mongoose = require('mongoose');

const BundleItemSchema = new mongoose.Schema(
  {
    mediaId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], required: true },
    title: { type: String },
    name: { type: String },
    posterPath: { type: String },
    backdropPath: { type: String },
    releaseDate: { type: String },
    firstAirDate: { type: String },
    voteAverage: { type: Number }
  },
  { _id: false }
);

const BundleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true },
    description: { type: String },
    items: { type: [BundleItemSchema], default: [] }
  },
  { timestamps: true }
);

BundleSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Bundle', BundleSchema);


