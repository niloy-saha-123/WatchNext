/**
 * @file WatchDataContext.jsx
 * @path /frontend/src/contexts/WatchDataContext.jsx
 * @description Context for managing user's watch data with MongoDB backend storage.
 * Fetches data from backend API instead of localStorage.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { watchAPI } from '../services/apiClient';
import { useAuth } from './AuthContext';

const WatchDataContext = createContext();

export const useWatchData = () => {
  const context = useContext(WatchDataContext);
  if (!context) {
    throw new Error('useWatchData must be used within a WatchDataProvider');
  }
  return context;
};

export const WatchDataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [watchData, setWatchData] = useState({
    movies: [],
    shows: [],
    watchlist: []
  });
  const [episodeProgress, setEpisodeProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from backend API
  useEffect(() => {
    if (isAuthenticated) {
      loadWatchData();
    } else {
      // Reset data when not authenticated
      setWatchData({ movies: [], shows: [], watchlist: [] });
      setEpisodeProgress([]);
    }
  }, [isAuthenticated]);

  const loadWatchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all watch data from backend
      const [historyRes, watchlistRes, progressRes] = await Promise.all([
        watchAPI.getHistory(),
        watchAPI.getWatchlist(),
        watchAPI.getEpisodeProgress()
      ]);

      // Transform backend data to match expected format
      const movies = historyRes.data?.filter(item => item.mediaType === 'movie') || [];
      const shows = historyRes.data?.filter(item => item.mediaType === 'tv') || [];
      const watchlist = watchlistRes.data || [];
      const progress = progressRes.data || [];

      setWatchData({ movies, shows, watchlist });
      setEpisodeProgress(progress);
    } catch (error) {
      console.error('Error loading watch data:', error);
      // Set empty data on error
      setWatchData({ movies: [], shows: [], watchlist: [] });
      setEpisodeProgress([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add movie to watched list
  const addWatchedMovie = async (movieData) => {
    try {
      const formattedData = {
        mediaId: movieData.id,
        mediaType: 'movie',
        title: movieData.title,
        posterPath: movieData.poster_path,
        releaseDate: movieData.release_date,
        overview: movieData.overview,
        voteAverage: movieData.vote_average,
        runtime: movieData.runtime,
        rating: movieData.rating || null,
        notes: movieData.notes || ''
      };

      await watchAPI.addToHistory(formattedData);
      
      // Reload data to get latest from backend
      await loadWatchData();
    } catch (error) {
      console.error('Error adding movie to history:', error);
      throw error;
    }
  };

  // Add TV show to watched list
  const addWatchedShow = async (showData) => {
    try {
      const formattedData = {
        mediaId: showData.id,
        mediaType: 'tv',
        title: showData.name,
        posterPath: showData.poster_path,
        releaseDate: showData.first_air_date,
        overview: showData.overview,
        voteAverage: showData.vote_average,
        runtime: showData.episode_run_time?.[0] || 0,
        isCompleted: false
      };

      await watchAPI.addToHistory(formattedData);
      await loadWatchData();
    } catch (error) {
      console.error('Error adding show to history:', error);
      throw error;
    }
  };

  // Add content to watchlist
  const addToWatchlist = async (contentData) => {
    try {
      const formattedData = {
        mediaId: contentData.id,
        mediaType: contentData.media_type || contentData.type,
        title: contentData.title || contentData.name,
        posterPath: contentData.poster_path,
        releaseDate: contentData.release_date || contentData.first_air_date,
        overview: contentData.overview || '',
        voteAverage: contentData.vote_average || 0
      };

      await watchAPI.addToWatchlist(formattedData);
      await loadWatchData();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  };

  // Remove content from watchlist
  const removeFromWatchlist = async (contentId) => {
    try {
      // Find the item in current watchlist to get its _id
      const item = watchData.watchlist.find(i => i.mediaId === contentId || i.id === contentId);
      if (item && item._id) {
        await watchAPI.removeFromWatchlist(item._id);
        await loadWatchData();
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  };

  // Update movie data (rating, notes)
  const updateMovie = async (movieId, updates) => {
    try {
      const movie = watchData.movies.find(m => m.mediaId === movieId || m.id === movieId);
      if (movie && movie._id) {
        await watchAPI.updateHistory(movie._id, updates);
        await loadWatchData();
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  };

  // Update TV show data
  const updateShow = async (showId, updates) => {
    try {
      const show = watchData.shows.find(s => s.mediaId === showId || s.id === showId);
      if (show && show._id) {
        await watchAPI.updateHistory(show._id, updates);
        await loadWatchData();
      }
    } catch (error) {
      console.error('Error updating show:', error);
      throw error;
    }
  };

  // Check if content is watched
  const isWatched = (contentId, type) => {
    if (type === 'movie') {
      return watchData.movies.some(movie => (movie.mediaId || movie.id) === contentId);
    } else if (type === 'tv') {
      return watchData.shows.some(show => (show.mediaId || show.id) === contentId);
    }
    return false;
  };

  // Check if content is in watchlist
  const isInWatchlist = (contentId) => {
    return watchData.watchlist.some(item => (item.mediaId || item.id) === contentId);
  };

  // Get watched content data
  const getWatchedContent = (contentId, type) => {
    if (type === 'movie') {
      return watchData.movies.find(movie => (movie.mediaId || movie.id) === contentId);
    } else if (type === 'tv') {
      const show = watchData.shows.find(show => (show.mediaId || show.id) === contentId);
      if (show) {
        // Attach episode progress if available
        const progress = episodeProgress.find(p => p.showId === contentId);
        if (progress) {
          return {
            ...show,
            episodeProgress: progress.episodeProgress
          };
        }
      }
      return show;
    }
    return null;
  };

  // Get watchlist content data
  const getWatchlistContent = (contentId) => {
    return watchData.watchlist.find(item => (item.mediaId || item.id) === contentId);
  };

  // Get total hours watched
  const getTotalHours = () => {
    const movieHours = watchData.movies.reduce((total, movie) => {
      return total + (movie.runtime ? Math.round(movie.runtime / 60) : 0);
    }, 0);
    
    const showHours = episodeProgress.reduce((total, show) => {
      const watchedEpisodes = Object.values(show.episodeProgress || {}).filter(watched => watched).length;
      return total + (watchedEpisodes * 0.5); // 30 minutes per episode
    }, 0);
    
    return movieHours + showHours;
  };

  const value = {
    watchData,
    addWatchedMovie,
    addWatchedShow,
    addToWatchlist,
    removeFromWatchlist,
    updateMovie,
    updateShow,
    isWatched,
    isInWatchlist,
    getWatchedContent,
    getWatchlistContent,
    getTotalHours,
    isLoading,
    // Stats for dashboard
    moviesWatched: watchData.movies.length,
    showsWatched: watchData.shows.length,
    watchlistCount: watchData.watchlist.length
  };

  return (
    <WatchDataContext.Provider value={value}>
      {children}
    </WatchDataContext.Provider>
  );
};

export default WatchDataContext;
