/**
 * @file apiClient.js
 * @path frontend/src/services/apiClient.js
 * @description Frontend API client for communicating with the backend server.
 * Replaces the old apiService.js and tmdbApi.js files that have been moved to backend.
 */

// API Configuration - Frontend only needs the backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Generic API request function
// HttpOnly cookies are automatically included with credentials: 'include'
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  let config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include', // Include HttpOnly cookies automatically
    ...options
  };

  try {
    let response = await fetch(url, config);
    
    // If token expired (401), try to refresh once
    if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/me') {
      try {
        // Try to refresh token (cookies are automatically sent and updated)
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (refreshResponse.ok) {
          // Retry original request (new cookie automatically included)
        response = await fetch(url, config);
        } else {
          // Refresh failed, redirect to login
          if (window.location.pathname !== '/login') {
            window.history.pushState({}, '', '/login');
            window.location.reload();
          }
          throw new Error('Session expired. Please login again.');
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (window.location.pathname !== '/login') {
          window.history.pushState({}, '', '/login');
          window.location.reload();
        }
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
        credentials: 'include', // Include cookies
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Tokens are now in HttpOnly cookies - no need to store manually
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
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Tokens are now in HttpOnly cookies - no need to store manually
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include' // Send cookies
      });

      if (!response.ok) {
        return { success: false, user: null };
      }

      const data = await response.json();
      return { success: true, user: data.data.user };
    } catch (error) {
      console.error('Check auth error:', error);
      return { success: false, user: null };
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include' // Send cookies to be cleared
      });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: true }; // Still return success even if backend fails
    }
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

// Watch API - for user watch data
export const watchAPI = {
  // Watch History (Movies & TV Shows)
  getHistory: async () => {
    return apiRequest('/watch/history');
  },

  addToHistory: async (mediaData) => {
    return apiRequest('/watch/history', {
      method: 'POST',
      body: JSON.stringify(mediaData)
    });
  },

  updateHistory: async (id, updates) => {
    return apiRequest(`/watch/history/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  removeFromHistory: async (id) => {
    return apiRequest(`/watch/history/${id}`, {
      method: 'DELETE'
    });
  },

  // Watchlist
  getWatchlist: async () => {
    return apiRequest('/watch/watchlist');
  },

  addToWatchlist: async (itemData) => {
    return apiRequest('/watch/watchlist', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  },

  removeFromWatchlist: async (id) => {
    return apiRequest(`/watch/watchlist/${id}`, {
      method: 'DELETE'
    });
  },

  // Episode Progress
  getEpisodeProgress: async () => {
    return apiRequest('/watch/progress');
  },

  updateEpisodeProgress: async (progressData) => {
    return apiRequest('/watch/progress', {
      method: 'POST',
      body: JSON.stringify(progressData)
    });
  },

  removeEpisodeProgress: async (id) => {
    return apiRequest(`/watch/progress/${id}`, {
      method: 'DELETE'
    });
  }
};

// Bundles API - folders of movies/shows
export const bundleAPI = {
  list: async () => {
    return apiRequest('/bundles');
  },
  create: async ({ name, description = '' }) => {
    return apiRequest('/bundles', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
  },
  update: async (id, updates) => {
    return apiRequest(`/bundles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  remove: async (id) => {
    return apiRequest(`/bundles/${id}`, {
      method: 'DELETE'
    });
  },
  addItem: async (id, item) => {
    return apiRequest(`/bundles/${id}/items`, {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },
  removeItem: async (id, mediaId, mediaType) => {
    const query = mediaType ? `?mediaType=${encodeURIComponent(mediaType)}` : '';
    return apiRequest(`/bundles/${id}/items/${mediaId}${query}`, {
      method: 'DELETE'
    });
  }
};

export default {
  mediaAPI,
  userStatsAPI,
  authAPI,
  profileAPI,
  watchAPI,
  bundleAPI
};