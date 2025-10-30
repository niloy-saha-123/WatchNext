/**
 * @file MyMoviesPage.jsx
 * @path /frontend/src/pages/MyMoviesPage.jsx
 * @description Page displaying all movies the user has watched with ratings, notes, and management options.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Header, LoadingSpinner, ErrorMessage } from '../components/common';
import { useWatchData } from '../contexts/WatchDataContext';

function MyMoviesPage() {
  const { watchData } = useWatchData();
  const movies = watchData.movies || [];

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

  const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-slate-400">No rating</span>;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-slate-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-slate-200 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Movies</h1>
              <p className="text-slate-600 mt-2">
                {movies.length} {movies.length === 1 ? 'movie' : 'movies'} watched
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

      {/* Movies Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {movies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">No Movies Yet</h2>
              <p className="text-slate-600 mb-6">
                Start watching movies and mark them as watched to see them here.
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
              {movies.map(movie => {
                const id = movie.mediaId ?? movie.id;
                const poster = movie.posterPath ?? movie.poster_path;
                const title = movie.title;
                const release = movie.release_date ?? movie.releaseDate;
                const runtime = movie.runtime;

                return (
                <div key={id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Movie Poster */}
                  <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 relative">
                    {poster ? (
                      <img
                        src={getImageUrl(poster)}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Watched Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        ✓ Watched
                      </span>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                      {title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Release Date:</span>
                        <span>{formatDate(release)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Runtime:</span>
                        <span>{runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>My Rating:</span>
                        <div>{renderStars(movie.rating)}</div>
                      </div>
                    </div>

                    {/* Personal Notes */}
                    {movie.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm text-slate-700 italic">
                          "{movie.notes}"
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/movie/${id}`}
                        className="flex-1 px-3 py-2 text-center text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MyMoviesPage;
