/**
 * @file SearchResultsPage.jsx
 * @path frontend/src/pages/SearchResultsPage.jsx
 * @description Search results page displaying movies and TV shows based on user query.
 * Shows search results with poster images, titles, types, and release years.
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { mediaAPI } from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components/common';
import Header from '../components/common/Header';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Fetch search results
  const fetchResults = async (searchQuery, pageNum = 1, append = false) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await mediaAPI.search(searchQuery, pageNum);
      
      if (append) {
        setResults(prev => [...prev, ...(data.results || [])]);
      } else {
        setResults(data.results || []);
      }
      
      setHasMore(pageNum < data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search movies and TV shows');
    } finally {
      setLoading(false);
    }
  };

  // Load more results
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchResults(query, page + 1, true);
    }
  };

  // Initial search when query changes
  useEffect(() => {
    if (query) {
      setSearchInput(query);
      setResults([]);
      setPage(1);
      fetchResults(query, 1, false);
    }
  }, [query]);

  // Get image URL helper
  const getImageUrl = (posterPath, size = 'w500') => {
    if (!posterPath) return '/api/placeholder/300/450';
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  };

  // Format release date
  const getReleaseYear = (date) => {
    if (!date) return '';
    return new Date(date).getFullYear();
  };

  // Get media type display name
  const getMediaType = (mediaType) => {
    switch (mediaType) {
      case 'movie': return 'Movie';
      case 'tv': return 'TV Show';
      case 'person': return 'Person';
      default: return 'Unknown';
    }
  };

  // Get media detail URL
  const getDetailUrl = (item) => {
    if (item.media_type === 'movie') {
      return `/movie/${item.id}`;
    } else if (item.media_type === 'tv') {
      return `/tv/${item.id}`;
    }
    return '#';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {query ? `Search Results for "${query}"` : 'Search Movies & TV Shows'}
            </h1>
            
            {/* Search Input */}
            <form onSubmit={handleSearch} className="max-w-md mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies and TV shows..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md text-slate-500 hover:text-red-500 transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            {results.length > 0 && (
              <p className="text-slate-600">
                Found {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Error State */}
          {error && (
            <ErrorMessage 
              message={error}
              onRetry={() => fetchResults(query, 1, false)}
            />
          )}

          {/* Loading State */}
          {loading && results.length === 0 && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          )}

          {/* No Results */}
          {!loading && !error && query && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No results found
              </h3>
              <p className="text-slate-600">
                Try searching for a different movie or TV show title.
              </p>
            </div>
          )}

          {/* Search Results Grid */}
          {results.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
                {results.map((item) => (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    to={getDetailUrl(item)}
                    className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    {/* Poster Image */}
                    <div className="aspect-[2/3] bg-slate-200 relative overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path)}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      
                      {/* Media Type Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.media_type === 'movie'
                            ? 'bg-blue-100 text-blue-800'
                            : item.media_type === 'tv'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getMediaType(item.media_type)}
                        </span>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-red-600 transition-colors overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                        {item.title || item.name}
                      </h3>
                      
                      {(item.release_date || item.first_air_date) && (
                        <p className="text-xs text-slate-600">
                          {getReleaseYear(item.release_date || item.first_air_date)}
                        </p>
                      )}
                      
                      {item.vote_average > 0 && (
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-slate-600">⭐</span>
                          <span className="text-xs text-slate-600 ml-1">
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="small" />
                        Loading...
                      </div>
                    ) : (
                      'Load More Results'
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty Search State */}
          {!query && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Start searching
              </h3>
              <p className="text-slate-600">
                Use the search bar above to find movies and TV shows.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SearchResultsPage;
