/**
 * @file bundleRoutes.js
 * @path backend/routes/bundleRoutes.js
 * @description Routes for managing user bundles (folders of movies/shows)
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { csrfProtect } = require('../middleware/csrf');
const { body, validationResult, param, query } = require('express-validator');
const Bundle = require('../models/Bundle');

// Require auth and CSRF for write routes
router.use(authenticateToken);
router.use(csrfProtect);

// GET /api/bundles - list bundles for current user
router.get('/', async (req, res) => {
  try {
    const bundles = await Bundle.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: bundles });
  } catch (error) {
    console.error('List bundles error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bundles' });
  }
});

// POST /api/bundles - create bundle { name, description }
router.post('/', [
  body('name').isString().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { name, description } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Bundle name is required' });
    }
    const bundle = await Bundle.create({ userId: req.user._id, name: name.trim(), description: description || '' });
    res.status(201).json({ success: true, data: bundle });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'A bundle with this name already exists' });
    }
    console.error('Create bundle error:', error);
    res.status(500).json({ success: false, message: 'Failed to create bundle' });
  }
});

// PUT /api/bundles/:id - update bundle name/description
router.put('/:id', [
  param('id').isMongoId(),
  body('name').optional().isString().trim(),
  body('description').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { name, description } = req.body || {};
    const update = {};
    if (typeof name === 'string') update.name = name.trim();
    if (typeof description === 'string') update.description = description;

    const bundle = await Bundle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      update,
      { new: true, runValidators: true }
    );

    if (!bundle) return res.status(404).json({ success: false, message: 'Bundle not found' });
    res.json({ success: true, data: bundle });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'A bundle with this name already exists' });
    }
    console.error('Update bundle error:', error);
    res.status(500).json({ success: false, message: 'Failed to update bundle' });
  }
});

// DELETE /api/bundles/:id - delete bundle
router.delete('/:id', [param('id').isMongoId()], async (req, res) => {
  try {
    const result = await Bundle.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: 'Bundle not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete bundle error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete bundle' });
  }
});

// POST /api/bundles/:id/items - add item { mediaId, mediaType, ... }
router.post('/:id/items', [
  param('id').isMongoId(),
  body('mediaId').isInt().toInt(),
  body('mediaType').isIn(['movie', 'tv']),
  body('title').optional().isString(),
  body('name').optional().isString(),
  body('posterPath').optional().isString(),
  body('backdropPath').optional().isString(),
  body('releaseDate').optional().isString(),
  body('firstAirDate').optional().isString(),
  body('voteAverage').optional().isFloat({ min: 0 }).toFloat(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { mediaId, mediaType, title, name, posterPath, backdropPath, releaseDate, firstAirDate, voteAverage } = req.body || {};
    if (!mediaId || !mediaType) {
      return res.status(400).json({ success: false, message: 'mediaId and mediaType are required' });
    }

    const bundle = await Bundle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bundle) return res.status(404).json({ success: false, message: 'Bundle not found' });

    const exists = bundle.items.some(i => i.mediaId === Number(mediaId) && i.mediaType === mediaType);
    if (!exists) {
      bundle.items.push({ mediaId: Number(mediaId), mediaType, title, name, posterPath, backdropPath, releaseDate, firstAirDate, voteAverage });
      await bundle.save();
    }

    res.status(201).json({ success: true, data: bundle });
  } catch (error) {
    console.error('Add item to bundle error:', error);
    res.status(500).json({ success: false, message: 'Failed to add item to bundle' });
  }
});

// DELETE /api/bundles/:id/items/:mediaId - remove item
router.delete('/:id/items/:mediaId', [
  param('id').isMongoId(),
  param('mediaId').isInt().toInt(),
  query('mediaType').optional().isIn(['movie', 'tv']),
], async (req, res) => {
  try {
    const { mediaType } = req.query; // optional filter when same id exists across types
    const bundle = await Bundle.findOne({ _id: req.params.id, userId: req.user._id });
    if (!bundle) return res.status(404).json({ success: false, message: 'Bundle not found' });

    const before = bundle.items.length;
    bundle.items = bundle.items.filter(i => {
      const idMatches = i.mediaId === Number(req.params.mediaId);
      const typeMatches = mediaType ? i.mediaType === String(mediaType) : true;
      return !(idMatches && typeMatches);
    });

    if (bundle.items.length === before) {
      return res.status(404).json({ success: false, message: 'Item not found in bundle' });
    }

    await bundle.save();
    res.json({ success: true, data: bundle });
  } catch (error) {
    console.error('Remove item from bundle error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item from bundle' });
  }
});

module.exports = router;


