/**
 * @file DashboardPage.jsx
 * @path /frontend/src/pages/DashboardPage.jsx
 * @description Main dashboard page for authenticated users to track their movies and TV shows.
 * Features a clean white background with strategic use of the brand gradient theme.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, LoadingSpinner, StatsCard, ErrorMessage } from '../components/common';
import { useUserStats } from '../hooks/useUserStats';
import { mediaAPI } from '../services/apiClient';

function DashboardPage() {
  const navigate = useNavigate();
  
  // Hook to manage user statistics
  const { stats, isLoading, error } = useUserStats();

  // Search dropdown state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search function
  const performSearch = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await mediaAPI.search(query, 1);
      // Limit to 5 results for dropdown
      setSearchResults(data.results?.slice(0, 5) || []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change with debouncing
  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  // Handle search result click
  const handleResultClick = (item) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    // For now, navigate to search page with the specific item as context
    // TODO: Create detail pages for movies/TV shows
    navigate(`/search?q=${encodeURIComponent(item.title || item.name)}`);
  };

  // Handle "View All Results" click
  const handleViewAllClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Header with transparent background for dashboard */}
      <Header />
      
      {/* Main Dashboard Content */}
      <main className="pt-16">
        {/* Hero Banner with gradient theme */}
        <section className="bg-gradient-to-r from-red-500 via-orange-500 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold mb-4">Welcome back to WatchNext! 🎬</h1>
              <p className="text-lg opacity-90">
                Track every movie. Binge every series. Never lose your place again.
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Content Area */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    }
                    value={stats.moviesWatched}
                    label="Movies"
                    isLoading={isLoading}
                    className="text-2xl"
                  />
                  
                  <StatsCard
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                    value={stats.showsTracked}
                    label="TV Shows"
                    isLoading={isLoading}
                    className="text-2xl"
                  />
                  
                  <StatsCard
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    value={stats.totalHours}
                    label="Hours Watched"
                    suffix="h"
                    isLoading={isLoading}
                    className="text-2xl"
                  />
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="large" variant="primary" text="Loading your stats..." />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <ErrorMessage message={`Error loading stats: ${error}`} />
                )}

                {/* What's Next Section */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">What's Next to Watch</h2>
                    <p className="text-slate-600 text-sm mt-1">New releases and continuing series</p>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-12 text-slate-500">
                      <div className="text-4xl mb-4">🎭</div>
                      <p className="text-lg font-medium mb-2">No new releases yet</p>
                      <p className="text-sm">Start tracking shows and movies to see updates here!</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Quick Actions */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                  </div>
                  <div className="p-6 space-y-3">
                    {/* Live Search Input */}
                    <div className="relative" ref={dropdownRef}>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search movies and TV shows..."
                          value={searchQuery}
                          onChange={handleSearchInput}
                          className="w-full p-3 rounded-lg border-2 border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                        />
                        {isSearching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <LoadingSpinner size="small" />
                          </div>
                        )}
                        {!isSearching && searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSearchResults([]);
                              setShowDropdown(false);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Search Results Dropdown */}
                      {showDropdown && (searchResults.length > 0 || isSearching) && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                          {isSearching ? (
                            <div className="p-4 text-center text-slate-500">
                              <LoadingSpinner size="small" />
                              <span className="ml-2">Searching...</span>
                            </div>
                          ) : searchResults.length > 0 ? (
                            <>
                              {searchResults.map((item) => (
                                <button
                                  key={`${item.media_type}-${item.id}`}
                                  onClick={() => handleResultClick(item)}
                                  className="w-full text-left p-3 hover:bg-orange-50 border-b border-slate-100 last:border-b-0 transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                                      {item.poster_path ? (
                                        <img
                                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                          alt={item.title || item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-slate-900 truncate">
                                        {item.title || item.name}
                                      </h4>
                                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                          item.media_type === 'movie'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                          {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                                        </span>
                                        {(item.release_date || item.first_air_date) && (
                                          <span>
                                            {new Date(item.release_date || item.first_air_date).getFullYear()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                              <div className="border-t border-slate-200">
                                <button
                                  onClick={handleViewAllClick}
                                  className="w-full p-3 text-center text-orange-600 hover:bg-orange-50 font-medium transition-colors"
                                >
                                  View All Results for "{searchQuery}"
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="p-4 text-center text-slate-500">
                              No results found for "{searchQuery}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-colors duration-300">
                      <div className="flex items-center text-slate-700 hover:text-orange-600">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">Add Manual Entry</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-colors duration-300">
                      <div className="flex items-center text-slate-700 hover:text-orange-600">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium">View Statistics</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-8 text-slate-500">
                      <div className="text-3xl mb-3">📅</div>
                      <p className="text-sm">No recent activity</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;