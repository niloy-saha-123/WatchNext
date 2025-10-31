/**
 * @file SearchResultsPage.jsx
 * @path frontend/src/pages/SearchResultsPage.jsx
 * @description Search results page displaying movies and TV shows based on user query.
 * Shows search results with poster images, titles, types, and release years.
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mediaAPI } from '../services/apiClient';
import { LoadingSpinner, ErrorMessage, SearchInput } from '../components/common';
import Header from '../components/common/Header';
import { getImageUrl } from '../utils/imageUtils';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch search results
  const fetchResults = async (searchQuery, pageNum = 1, append = false) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await mediaAPI.search(searchQuery, pageNum);
      
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
      
      if (append) {
        setResults(prev => [...prev, ...filteredResults]);
      } else {
        setResults(filteredResults);
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
      setResults([]);
      setPage(1);
      fetchResults(query, 1, false);
    }
  }, [query]);

  // Format release date
  const getReleaseYear = (date) => {
    if (!date) return '';
    try {
      return new Date(date).getFullYear();
    } catch {
      return '';
    }
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
            <div className="max-w-md mb-4">
              <SearchInput
                placeholder="Search movies and TV shows..."
                showDropdown={true}
                maxResults={5}
                initialValue={query}
              />
            </div>
            
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
                    <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                      {item.poster_path ? (
                        <img
                          src={getImageUrl(item.poster_path)}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          {item.media_type === 'movie' ? (
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                      )}
                      
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
