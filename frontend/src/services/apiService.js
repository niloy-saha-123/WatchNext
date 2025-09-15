/**
 * @file apiService.js
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/services/apiService.js
 * @description Service for handling all API calls to the backend
 * This will be the central place for backend communication
 */

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// User Statistics API calls
export const userStatsAPI = {
  // Get user's watch statistics
  getStats: async () => {
    return apiRequest('/user/stats');
    
    // Expected backend response:
    // {
    //   moviesWatched: 24,
    //   showsTracked: 12,
    //   totalHours: 156,
    //   recentActivity: [...],
    //   favoriteGenres: [...]
    // }
  },

  // Update specific stat
  updateStat: async (statType, value) => {
    return apiRequest('/user/stats', {
      method: 'PATCH',
      body: JSON.stringify({ [statType]: value })
    });
  },

  // Add a watched movie (automatically updates stats)
  addWatchedMovie: async (movieData) => {
    const result = await apiRequest('/user/movies', {
      method: 'POST',
      body: JSON.stringify(movieData)
    });
    
    // Backend automatically:
    // 1. Saves movie to user's watched list
    // 2. Increments moviesWatched count
    // 3. Adds movie runtime to totalHours
    // 4. Returns updated stats
    
    return result;
    
    // Expected request body:
    // {
    //   tmdbId: 123,
    //   title: "Movie Title",
    //   runtime: 142, // minutes from TMDB
    //   watchedDate: "2024-01-15",
    //   rating: 8.5,
    //   notes: "Great movie!"
    // }
    //
    // Expected response:
    // {
    //   success: true,
    //   movie: { saved movie data },
    //   updatedStats: {
    //     moviesWatched: 25, // incremented
    //     totalHours: 158    // added 2.37 hours (142 min)
    //   }
    // }
  },

  // Add a tracked TV show (automatically updates stats)
  addTrackedShow: async (showData) => {
    const result = await apiRequest('/user/shows', {
      method: 'POST',
      body: JSON.stringify(showData)
    });
    
    // Backend automatically:
    // 1. Saves show to user's tracked list
    // 2. Increments showsTracked count
    // 3. Calculates and adds episode runtime to totalHours
    // 4. Returns updated stats
    
    return result;
    
    // Expected request body:
    // {
    //   tmdbId: 456,
    //   title: "Show Title",
    //   currentSeason: 2,
    //   currentEpisode: 5,
    //   episodeRuntime: 45, // minutes per episode from TMDB
    //   watchedEpisodes: 15, // total episodes watched
    //   status: "watching" // "watching", "completed", "paused"
    // }
    //
    // Expected response:
    // {
    //   success: true,
    //   show: { saved show data },
    //   updatedStats: {
    //     showsTracked: 13,  // incremented
    //     totalHours: 169    // added 11.25 hours (15 episodes × 45 min)
    //   }
    // }
  },

  // Mark episode as watched (updates show progress and hours)
  markEpisodeWatched: async (showId, seasonNumber, episodeNumber) => {
    const result = await apiRequest('/user/shows/episode', {
      method: 'PATCH',
      body: JSON.stringify({
        showId,
        seasonNumber,
        episodeNumber,
        watched: true
      })
    });
    
    // Backend automatically:
    // 1. Updates user's progress for this show
    // 2. Adds episode runtime to totalHours
    // 3. Checks if season/series is completed
    // 4. Returns updated stats and progress
    
    return result;
  },

  // Remove watched content (decrements stats)
  removeWatchedMovie: async (movieId) => {
    return apiRequest(`/user/movies/${movieId}`, {
      method: 'DELETE'
    });
    
    // Backend automatically decrements moviesWatched and subtracts hours
  }
};

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Expected response:
    // {
    //   token: "jwt_token_here",
    //   user: { id, name, email, ... }
    // }
  },

  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Logout user
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    });
  }
};

// Movies & Shows API calls
export const mediaAPI = {
  // Search movies/shows (uses TMDB through backend)
  search: async (query, type = 'multi') => {
    return apiRequest(`/media/search?q=${encodeURIComponent(query)}&type=${type}`);
  },

  // Get popular movies/shows
  getPopular: async (type = 'movie') => {
    return apiRequest(`/media/popular?type=${type}`);
  },

  // Get movie/show details
  getDetails: async (id, type = 'movie') => {
    return apiRequest(`/media/${type}/${id}`);
  }
};

export default {
  userStatsAPI,
  authAPI,
  mediaAPI
};