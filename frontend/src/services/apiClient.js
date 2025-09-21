/**
 * @file apiClient.js
 * @path /frontend/src/services/apiClient.js
 * @description Frontend API client for communicating with the backend server
 * This replaces the old apiService.js and tmdbApi.js files that have been moved to backend
 */

// API Configuration - Frontend only needs the backend API URL
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

// Media API - communicates with backend which handles TMDB
export const mediaAPI = {
  // Get popular movies/shows
  getPopular: async (type = 'movie', page = 1) => {
    return apiRequest(`/media/popular?type=${type}&page=${page}`);
  },

  // Get trending content
  getTrending: async (type = 'all', time = 'week') => {
    return apiRequest(`/media/trending?type=${type}&time=${time}`);
  },

  // Search movies/shows
  search: async (query, page = 1) => {
    return apiRequest(`/media/search?q=${encodeURIComponent(query)}&page=${page}`);
  },

  // Get movie details
  getMovieDetails: async (id) => {
    return apiRequest(`/media/movie/${id}`);
  },

  // Get TV show details
  getTVShowDetails: async (id) => {
    return apiRequest(`/media/tv/${id}`);
  },

  // Get featured content for homepage
  getFeatured: async () => {
    return apiRequest('/media/featured');
  }
};

// User Statistics API calls (placeholder for future backend implementation)
export const userStatsAPI = {
  // Get user's watch statistics
  getStats: async () => {
    // TODO: Implement when user authentication is ready
    return {
      moviesWatched: 0,
      showsTracked: 0,
      totalHours: 0,
      loading: false,
      error: null
    };
  }
};

// Authentication API calls (placeholder for future backend implementation)
export const authAPI = {
  // Login user
  // eslint-disable-next-line no-unused-vars
  login: async (email, password) => {
    // TODO: Implement when backend auth routes are ready
    console.log('Login attempt:', { email, password: '[REDACTED]' });
    throw new Error('Authentication not implemented yet');
  },

  // Register user
  register: async (userData) => {
    // TODO: Implement when backend auth routes are ready
    console.log('Register attempt:', userData);
    throw new Error('Registration not implemented yet');
  },

  // Logout user
  logout: async () => {
    // TODO: Implement when backend auth routes are ready
    localStorage.removeItem('authToken');
    return { success: true };
  }
};

// Profile API calls (placeholder for future backend implementation)
export const profileAPI = {
  // Get complete user profile data
  getUserProfile: async () => {
    // TODO: Implement when user authentication is ready
    return {
      userInfo: {
        name: '',
        email: '',
        memberSince: '',
        avatar: null
      },
      stats: {
        moviesWatched: 0,
        showsTracked: 0,
        episodesLogged: 0,
        totalHours: 0
      },
      favoriteGenres: [],
      recentlyWatched: []
    };
  }
};

export default {
  mediaAPI,
  userStatsAPI,
  authAPI,
  profileAPI
};