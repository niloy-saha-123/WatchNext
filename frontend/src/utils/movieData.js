/**
 * @file movieData.js
 * @path frontend/src/utils/movieData.js
 * @description Utility functions to fetch and format movie/TV show data for WatchNext.
 * Focuses on popular content, recent releases, and franchises with sequels/prequels.
 * Uses the backend API instead of direct TMDB integration.
 */

import { mediaAPI } from '../services/apiClient';

// Curated list of popular franchises and standalone hits with sequels/prequels
const FEATURED_MOVIE_IDS = [
  238,    // The Godfather
  155,    // The Dark Knight
  27205,  // Inception
  120,    // The Lord of the Rings: The Fellowship of the Ring
  122,    // The Lord of the Rings: The Two Towers
  121,    // The Lord of the Rings: The Return of the King
  11,     // Star Wars
  1891,   // The Empire Strikes Back
  1892,   // Return of the Jedi
  140607, // Star Wars: The Force Awakens
  299534, // Avengers: Endgame
  24428,  // The Avengers
  299536, // Avengers: Infinity War
  118340, // Guardians of the Galaxy
  283995, // Guardians of the Galaxy Vol. 2
  634649, // Spider-Man: No Way Home
  315635, // Spider-Man: Homecoming
  429617, // Spider-Man: Far From Home
  1726,   // Iron Man
  10138,  // Iron Man 2
  68721,  // Iron Man 3
];

const FEATURED_TV_IDS = [
  1396,   // Breaking Bad
  60625,  // Better Call Saul
  1399,   // Game of Thrones
  94997,  // House of the Dragon
  1668,   // Friends
  82856,  // The Mandalorian
  95557,  // Invincible
  85271,  // WandaVision
  88329,  // Hawkeye
  84958,  // Loki
  71712,  // The Boys
  66732,  // Stranger Things
  1402,   // The Walking Dead
  62286,  // Fear the Walking Dead
];

/**
 * Fetch a mix of popular movies and TV shows for the poster grid
 * @returns {Promise<Object>} Object containing movies and tvShows arrays
 */
export const getFeaturedContent = async () => {
  try {
    // Check cache first (2 weeks)
    const cacheKey = 'featured_content';
    const cacheExpiry = 14 * 24 * 60 * 60 * 1000; // 2 weeks in ms
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      
      if (age < cacheExpiry) {
        // Cache is still valid
        return data;
      }
    }
    
    // Use the backend API to get featured content
    const data = await mediaAPI.getFeatured();
    
    // Format the data for the poster grid
    const movies = (data.movies || []).map(movie => ({
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      releaseDate: movie.release_date,
      overview: movie.overview,
      rating: movie.vote_average,
      type: 'movie'
    }));

    const tvShows = (data.tvShows || []).map(show => ({
      id: show.id,
      title: show.name,
      posterPath: show.poster_path,
      backdropPath: show.backdrop_path,
      releaseDate: show.first_air_date,
      overview: show.overview,
      rating: show.vote_average,
      type: 'tv'
    }));

    const formattedData = {
      movies,
      tvShows,
      trending: [] // Backend doesn't provide trending yet
    };
    
    // Cache for 2 weeks
    localStorage.setItem(cacheKey, JSON.stringify({
      data: formattedData,
      timestamp: Date.now()
    }));
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching featured content:', error);
    
    // Try to use cached data if API fails
    const cached = localStorage.getItem('featured_content');
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }
    
    // Return fallback data as last resort
    return getFallbackData();
  }
};

/**
 * Get franchise movies (sequels/prequels) for specific collections
 * @returns {Promise<Array>} Array of franchise movie collections
 */
export const getFranchiseMovies = async () => {
  try {
    // TODO: Implement franchise collections when backend supports it
    console.log('Franchise movies not implemented yet - using fallback');
    return [];
  } catch (error) {
    console.error('Error fetching franchise movies:', error);
    return [];
  }
};

/**
 * Format content for the animated poster grid
 * @param {Array} movies - Array of movie objects
 * @param {Array} tvShows - Array of TV show objects
 * @returns {Object} Formatted data for poster grid
 */
export const formatPosterGridData = (movies, tvShows) => {
  // Mix movies and TV shows for variety
  const allContent = [...movies, ...tvShows];
  
  // Shuffle and split into two rows
  const shuffled = allContent.sort(() => Math.random() - 0.5);
  const midpoint = Math.ceil(shuffled.length / 2);
  
  return {
    topRow: shuffled.slice(0, midpoint),
    bottomRow: shuffled.slice(midpoint)
  };
};

/**
 * Fallback data when API is unavailable
 * @returns {Object} Static fallback content
 */
export const getFallbackData = () => {
  const fallbackMovies = [
    { id: 1, title: 'Avengers: Endgame', posterPath: null, type: 'movie' },
    { id: 2, title: 'Spider-Man: No Way Home', posterPath: null, type: 'movie' },
    { id: 3, title: 'The Dark Knight', posterPath: null, type: 'movie' },
    { id: 4, title: 'Inception', posterPath: null, type: 'movie' },
    { id: 5, title: 'Interstellar', posterPath: null, type: 'movie' },
    { id: 6, title: 'The Matrix', posterPath: null, type: 'movie' },
    { id: 7, title: 'Pulp Fiction', posterPath: null, type: 'movie' },
    { id: 8, title: 'The Godfather', posterPath: null, type: 'movie' },
  ];

  const fallbackTVShows = [
    { id: 9, title: 'Breaking Bad', posterPath: null, type: 'tv' },
    { id: 10, title: 'Game of Thrones', posterPath: null, type: 'tv' },
    { id: 11, title: 'Better Call Saul', posterPath: null, type: 'tv' },
    { id: 12, title: 'The Mandalorian', posterPath: null, type: 'tv' },
    { id: 13, title: 'House of the Dragon', posterPath: null, type: 'tv' },
    { id: 14, title: 'The Boys', posterPath: null, type: 'tv' },
    { id: 15, title: 'Stranger Things', posterPath: null, type: 'tv' },
    { id: 16, title: 'The Walking Dead', posterPath: null, type: 'tv' },
    { id: 17, title: 'Loki', posterPath: null, type: 'tv' },
    { id: 18, title: 'WandaVision', posterPath: null, type: 'tv' },
  ];

  return {
    movies: fallbackMovies,
    tvShows: fallbackTVShows,
    trending: []
  };
};

export default {
  getFeaturedContent,
  getFranchiseMovies,
  formatPosterGridData,
  getFallbackData
};