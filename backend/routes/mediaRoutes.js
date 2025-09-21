/**
 * @file mediaRoutes.js
 * @path /backend/routes/mediaRoutes.js
 * @description API routes for movie and TV show data through TMDB
 */

const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService');

// GET /api/media/popular - Get popular movies/shows
router.get('/popular', async (req, res) => {
  try {
    const { type = 'movie', page = 1 } = req.query;
    
    let data;
    if (type === 'movie') {
      data = await tmdbService.getPopularMovies(page);
    } else if (type === 'tv') {
      data = await tmdbService.getPopularTVShows(page);
    } else {
      return res.status(400).json({ error: 'Invalid type. Must be "movie" or "tv"' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching popular media:', error);
    res.status(500).json({ error: 'Failed to fetch popular media' });
  }
});

// GET /api/media/trending - Get trending content
router.get('/trending', async (req, res) => {
  try {
    const { type = 'all', time = 'week' } = req.query;
    const data = await tmdbService.getTrending(type, time);
    res.json(data);
  } catch (error) {
    console.error('Error fetching trending media:', error);
    res.status(500).json({ error: 'Failed to fetch trending media' });
  }
});

// GET /api/media/search - Search movies/shows
router.get('/search', async (req, res) => {
  try {
    const { q: query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    
    const data = await tmdbService.searchMulti(query, page);
    res.json(data);
  } catch (error) {
    console.error('Error searching media:', error);
    res.status(500).json({ error: 'Failed to search media' });
  }
});

// GET /api/media/movie/:id - Get movie details
router.get('/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbService.getMovieDetails(id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// GET /api/media/tv/:id - Get TV show details
router.get('/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbService.getTVShowDetails(id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    res.status(500).json({ error: 'Failed to fetch TV show details' });
  }
});

// GET /api/media/featured - Get featured content for homepage
router.get('/featured', async (req, res) => {
  try {
    // Get a mix of popular movies and TV shows for the homepage
    const [movies, tvShows] = await Promise.all([
      tmdbService.getPopularMovies(1),
      tmdbService.getPopularTVShows(1)
    ]);
    
    res.json({
      movies: movies.results || [],
      tvShows: tvShows.results || []
    });
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Failed to fetch featured content' });
  }
});

module.exports = router;