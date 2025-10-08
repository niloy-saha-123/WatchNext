/**
 * @file SearchInput.jsx
 * @path frontend/src/components/common/SearchInput.jsx
 * @description Reusable search input component with live dropdown functionality.
 * Shows live search results as user types with debounced API calls.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '.';
import { mediaAPI } from '../../services/apiClient';

function SearchInput({ 
  placeholder = "Search movies and TV shows... (Press Enter for full search)",
  showDropdown = true,
  maxResults = 5,
  className = "",
  initialValue = ""
}) {
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdownResults, setShowDropdownResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search function
  const performSearch = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowDropdownResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await mediaAPI.search(query, 1);
      // Filter for quality movies/TV shows only
      const filteredResults = data.results?.filter(item => {
        // Only movies and TV shows
        if (item.media_type !== 'movie' && item.media_type !== 'tv') {
          return false;
        }
        
        // Must have a title/name
        if (!item.title && !item.name) {
          return false;
        }
        
        // Must have either a poster OR good metadata (rating, release date, etc.)
        const hasPoster = item.poster_path && item.poster_path.trim() !== '';
        const hasReleaseYear = item.release_date || item.first_air_date;
        const hasGoodMetadata = item.vote_average > 0 && hasReleaseYear;
        
        return hasPoster || hasGoodMetadata;
      }) || [];
      
      // Limit results for dropdown
      setSearchResults(filteredResults.slice(0, maxResults));
      setShowDropdownResults(showDropdown);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
      setShowDropdownResults(false);
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

  // Handle Enter key press - go directly to search page
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
        setSearchResults([]);
        setShowDropdownResults(false);
      }
    }
  };

  // Handle search result click
  const handleResultClick = (item) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdownResults(false);
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
    setShowDropdownResults(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownResults(false);
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
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchInput}
          onKeyPress={handleSearchKeyPress}
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
              setShowDropdownResults(false);
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
      {showDropdown && showDropdownResults && (searchResults.length > 0 || isSearching) && (
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
                    <div className="w-12 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded overflow-hidden flex-shrink-0">
                      {item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          {item.media_type === 'movie' ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
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
                            {(() => {
                              try {
                                return new Date(item.release_date || item.first_air_date).getFullYear();
                              } catch {
                                return '';
                              }
                            })()}
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
  );
}

export default SearchInput;
