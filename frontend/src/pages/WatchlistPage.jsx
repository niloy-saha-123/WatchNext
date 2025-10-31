/**
 * @file WatchlistPage.jsx
 * @path /frontend/src/pages/WatchlistPage.jsx
 * @description Page displaying all content in the user's watchlist (movies and TV shows).
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common';
import { SkeletonGrid } from '../components/common/Skeleton';
import { useWatchData } from '../contexts/WatchDataContext';
import { getImageUrl } from '../utils/imageUtils';

function WatchlistPage() {
  const { watchData, isLoading } = useWatchData();
  const watchlist = watchData.watchlist || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const getMediaTypeIcon = (mediaType) => {
    if (mediaType === 'movie') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-slate-200 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Watchlist</h1>
              <p className="text-slate-600 mt-2">
                {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} to watch
              </p>
            </div>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Watchlist Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <SkeletonGrid count={12} />
          ) : watchlist.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Watchlist is Empty</h2>
              <p className="text-slate-600 mb-6">
                Add movies and TV shows to your watchlist to see them here.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchlist.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Content Poster */}
                  <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 relative">
                    {item.poster_path ? (
                      <img
                        src={getImageUrl(item.poster_path)}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        {item.media_type === 'movie' ? (
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    )}
                    
                    {/* Media Type Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`flex items-center gap-1 px-2 py-1 text-white text-xs font-medium rounded-full ${
                        item.media_type === 'movie' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {getMediaTypeIcon(item.media_type)}
                        {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                      {item.title || item.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Release Date:</span>
                        <span>{formatDate(item.release_date || item.first_air_date)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Rating:</span>
                        <span>⭐ {item.vote_average?.toFixed(1) || 'N/A'}</span>
                      </div>
                      
                      {item.media_type === 'tv' && (
                        <div className="flex items-center justify-between">
                          <span>Seasons:</span>
                          <span>{item.number_of_seasons || 'N/A'}</span>
                        </div>
                      )}
                    </div>

                    {/* Overview */}
                    {item.overview && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm text-slate-700 line-clamp-3">
                          {item.overview}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/${item.media_type}/${item.id}`}
                        className="flex-1 px-3 py-2 text-center text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default WatchlistPage;
