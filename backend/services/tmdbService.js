/**
 * @file tmdbService.js
 * @path /backend/services/tmdbService.js
 * @description TMDB (The Movie Database) API service for fetching movie and TV show data.
 * Handles authentication, rate limiting, and provides methods for popular content.
 * This service should ONLY be used on the backend to keep API keys secure.
 */

// API Configuration - These should be set in backend environment variables
const API_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
const API_KEY = process.env.TMDB_API_KEY;
const READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

if (!API_KEY && !READ_ACCESS_TOKEN) {
  console.error('⚠️  TMDB API credentials not found in environment variables');
  console.error('Please set TMDB_API_KEY or TMDB_READ_ACCESS_TOKEN in your .env file');
}

// Common headers for API requests
const getHeaders = () => {
  if (READ_ACCESS_TOKEN) {
    return {
      'Authorization': `Bearer ${READ_ACCESS_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8'
    };
  }
  return {
    'Content-Type': 'application/json;charset=utf-8'
  };
};

// Generic API request function
const apiRequest = async (endpoint, params = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Add API key if no read access token
    if (!READ_ACCESS_TOKEN && API_KEY) {
      params.api_key = API_KEY;
    }
    
    // Add parameters to URL
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('TMDB API request failed:', error);
    throw error;
  }
};

// Image URL builder
const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get popular movies
const getPopularMovies = async (page = 1) => {
  return apiRequest('/movie/popular', { page });
};

// Get popular TV shows
const getPopularTVShows = async (page = 1) => {
  return apiRequest('/tv/popular', { page });
};

// Get now playing movies
const getNowPlayingMovies = async (page = 1) => {
  return apiRequest('/movie/now_playing', { page });
};

// Get trending movies and TV shows
const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  return apiRequest(`/trending/${mediaType}/${timeWindow}`);
};

// Get upcoming movies
const getUpcomingMovies = async (page = 1) => {
  return apiRequest('/movie/upcoming', { page });
};

// Get top rated movies
const getTopRatedMovies = async (page = 1) => {
  return apiRequest('/movie/top_rated', { page });
};

// Get top rated TV shows
const getTopRatedTVShows = async (page = 1) => {
  return apiRequest('/tv/top_rated', { page });
};

// Get movie details
const getMovieDetails = async (movieId) => {
  return apiRequest(`/movie/${movieId}`);
};

// Get TV show details
const getTVShowDetails = async (tvId) => {
  return apiRequest(`/tv/${tvId}`);
};

// Search movies and TV shows
const searchMulti = async (query, page = 1) => {
  return apiRequest('/search/multi', { query, page });
};

// Get movie/TV collection for sequels/prequels
const getMovieCollection = async (collectionId) => {
  return apiRequest(`/collection/${collectionId}`);
};

// Get movie credits (cast and crew)
const getMovieCredits = async (movieId) => {
  return apiRequest(`/movie/${movieId}/credits`);
};

// Get TV show credits (cast and crew)
const getTVShowCredits = async (tvId) => {
  return apiRequest(`/tv/${tvId}/credits`);
};

// Get movie recommendations
const getMovieRecommendations = async (movieId, page = 1) => {
  return apiRequest(`/movie/${movieId}/recommendations`, { page });
};

// Get TV show recommendations
const getTVShowRecommendations = async (tvId, page = 1) => {
  return apiRequest(`/tv/${tvId}/recommendations`, { page });
};

module.exports = {
  getPopularMovies,
  getPopularTVShows,
  getNowPlayingMovies,
  getTrending,
  getUpcomingMovies,
  getTopRatedMovies,
  getTopRatedTVShows,
  getMovieDetails,
  getTVShowDetails,
  searchMulti,
  getMovieCollection,
  getMovieCredits,
  getTVShowCredits,
  getMovieRecommendations,
  getTVShowRecommendations,
  getImageUrl
};