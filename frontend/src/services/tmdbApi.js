/**
 * @file tmdbApi.js
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/services/tmdbApi.js
 * @description TMDB (The Movie Database) API service for fetching movie and TV show data.
 * Handles authentication, rate limiting, and provides methods for popular content.
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

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
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  return apiRequest('/movie/popular', { page });
};

// Get popular TV shows
export const getPopularTVShows = async (page = 1) => {
  return apiRequest('/tv/popular', { page });
};

// Get now playing movies
export const getNowPlayingMovies = async (page = 1) => {
  return apiRequest('/movie/now_playing', { page });
};

// Get trending movies and TV shows
export const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  return apiRequest(`/trending/${mediaType}/${timeWindow}`);
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  return apiRequest('/movie/upcoming', { page });
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  return apiRequest('/movie/top_rated', { page });
};

// Get top rated TV shows
export const getTopRatedTVShows = async (page = 1) => {
  return apiRequest('/tv/top_rated', { page });
};

// Get movie details
export const getMovieDetails = async (movieId) => {
  return apiRequest(`/movie/${movieId}`);
};

// Get TV show details
export const getTVShowDetails = async (tvId) => {
  return apiRequest(`/tv/${tvId}`);
};

// Search movies and TV shows
export const searchMulti = async (query, page = 1) => {
  return apiRequest('/search/multi', { query, page });
};

// Get movie/TV collection for sequels/prequels
export const getMovieCollection = async (collectionId) => {
  return apiRequest(`/collection/${collectionId}`);
};

export default {
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
  getImageUrl
};