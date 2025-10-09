/**
 * @file WatchDataContext.jsx
 * @path /frontend/src/contexts/WatchDataContext.jsx
 * @description Context for managing user's watch data including movies, TV shows, and watchlist.
 * Stores data in localStorage for persistence across sessions.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchDataContext = createContext();

export const useWatchData = () => {
  const context = useContext(WatchDataContext);
  if (!context) {
    throw new Error('useWatchData must be used within a WatchDataProvider');
  }
  return context;
};

export const WatchDataProvider = ({ children }) => {
  const [watchData, setWatchData] = useState({
    movies: [], // Array of watched movies with ratings, notes, etc.
    shows: [], // Array of watched TV shows with episode progress
    watchlist: [] // Array of watchlisted content
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('watchNextData');
    if (savedData) {
      try {
        setWatchData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading watch data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever watchData changes
  useEffect(() => {
    localStorage.setItem('watchNextData', JSON.stringify(watchData));
  }, [watchData]);

  // Add movie to watched list
  const addWatchedMovie = (movieData) => {
    setWatchData(prev => ({
      ...prev,
      movies: [...prev.movies.filter(m => m.id !== movieData.id), movieData]
    }));
  };

  // Add TV show to watched list
  const addWatchedShow = (showData) => {
    setWatchData(prev => ({
      ...prev,
      shows: [...prev.shows.filter(s => s.id !== showData.id), showData]
    }));
  };

  // Add content to watchlist
  const addToWatchlist = (contentData) => {
    setWatchData(prev => ({
      ...prev,
      watchlist: [...prev.watchlist.filter(item => item.id !== contentData.id), contentData]
    }));
  };

  // Remove content from watchlist
  const removeFromWatchlist = (contentId) => {
    setWatchData(prev => ({
      ...prev,
      watchlist: prev.watchlist.filter(item => item.id !== contentId)
    }));
  };

  // Update movie data (rating, notes)
  const updateMovie = (movieId, updates) => {
    setWatchData(prev => ({
      ...prev,
      movies: prev.movies.map(movie => 
        movie.id === movieId ? { ...movie, ...updates } : movie
      )
    }));
  };

  // Update TV show data (episode progress, rating, notes)
  const updateShow = (showId, updates) => {
    setWatchData(prev => ({
      ...prev,
      shows: prev.shows.map(show => 
        show.id === showId ? { ...show, ...updates } : show
      )
    }));
  };

  // Check if content is watched
  const isWatched = (contentId, type) => {
    if (type === 'movie') {
      return watchData.movies.some(movie => movie.id === contentId);
    } else if (type === 'tv') {
      return watchData.shows.some(show => show.id === contentId);
    }
    return false;
  };

  // Check if content is in watchlist
  const isInWatchlist = (contentId) => {
    return watchData.watchlist.some(item => item.id === contentId);
  };

  // Get watched content data
  const getWatchedContent = (contentId, type) => {
    if (type === 'movie') {
      return watchData.movies.find(movie => movie.id === contentId);
    } else if (type === 'tv') {
      return watchData.shows.find(show => show.id === contentId);
    }
    return null;
  };

  // Get watchlist content data
  const getWatchlistContent = (contentId) => {
    return watchData.watchlist.find(item => item.id === contentId);
  };

  // Get total hours watched (simplified calculation)
  const getTotalHours = () => {
    const movieHours = watchData.movies.reduce((total, movie) => {
      return total + (movie.runtime ? Math.round(movie.runtime / 60) : 0);
    }, 0);
    
    const showHours = watchData.shows.reduce((total, show) => {
      const watchedEpisodes = Object.values(show.episodeProgress || {}).filter(watched => watched).length;
      return total + (watchedEpisodes * 0.5); // Assume 30 minutes per episode
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
