/**
 * @file apiClient.js
 * @path frontend/src/services/apiClient.js
 * @description Frontend API client for communicating with the backend server.
 * Replaces the old apiService.js and tmdbApi.js files that have been moved to backend.
 */

// API Configuration - Frontend only needs the backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Generic API request function with automatic token refresh
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  let config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    let response = await fetch(url, config);
    
    // If token expired (401), try to refresh
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      try {
        await authAPI.refreshToken();
        // Retry with new token
        config.headers = getAuthHeaders();
        response = await fetch(url, config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
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
  },

  // Get detailed information for movies/TV shows
  getDetails: async (type, id) => {
    return apiRequest(`/media/${type}/${id}`);
  },

  // Get cast information for movies/TV shows
  getCast: async (type, id) => {
    return apiRequest(`/media/${type}/${id}/cast`);
  },

  // Get recommendations for movies/TV shows
  getRecommendations: async (type, id) => {
    return apiRequest(`/media/${type}/${id}/recommendations`);
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

// Authentication API calls
export const authAPI = {
  // Register user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store tokens
      if (data.data.accessToken && data.data.refreshToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens
      if (data.data.accessToken && data.data.refreshToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();

      if (!response.ok) {
        // Refresh token expired or invalid, clear all tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error(data.message || 'Token refresh failed');
      }

      // Store new access token
      if (data.data.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
      }

      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call backend logout endpoint (optional)
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if backend call fails
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    
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