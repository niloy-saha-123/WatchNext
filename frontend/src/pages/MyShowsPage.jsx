/**
 * @file MyShowsPage.jsx
 * @path /frontend/src/pages/MyShowsPage.jsx
 * @description Page displaying all TV shows the user has watched with episode progress, ratings, and notes.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common';
import { useWatchData } from '../contexts/WatchDataContext';

function MyShowsPage() {
  const { watchData } = useWatchData();
  const shows = watchData.shows || [];

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

  const getEpisodeProgress = (show) => {
    const episodeProgress = show.episodeProgress || {};
    const watchedEpisodes = Object.values(episodeProgress).filter(watched => watched).length;
    return watchedEpisodes;
  };

  const getCompletionStatus = (show) => {
    const watchedEpisodes = getEpisodeProgress(show);
    const totalEpisodes = show.number_of_episodes || 100; // Simplified for demo
    
    if (watchedEpisodes === 0) return { status: 'not-started', color: 'gray' };
    if (watchedEpisodes >= totalEpisodes) return { status: 'completed', color: 'green' };
    if (watchedEpisodes > totalEpisodes * 0.5) return { status: 'in-progress', color: 'blue' };
    return { status: 'started', color: 'yellow' };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b border-slate-200 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My TV Shows</h1>
              <p className="text-slate-600 mt-2">
                {shows.length} {shows.length === 1 ? 'show' : 'shows'} tracked
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

      {/* Shows Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {shows.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📺</div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">No TV Shows Yet</h2>
              <p className="text-slate-600 mb-6">
                Start watching TV shows and track your episode progress to see them here.
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
              {shows.map(show => {
                const id = show.mediaId ?? show.id;
                const poster = show.posterPath ?? show.poster_path;
                const name = show.name;
                const firstAir = show.first_air_date ?? show.releaseDate;
                const watchedEpisodes = getEpisodeProgress(show);
                const completionStatus = getCompletionStatus(show);
                
                return (
                  <div key={id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Show Poster */}
                    <div className="aspect-[2/3] bg-gradient-to-br from-slate-200 to-slate-300 relative">
                      {poster ? (
                        <img
                          src={getImageUrl(poster)}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Progress Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-white text-xs font-medium rounded-full ${
                          completionStatus.color === 'green' ? 'bg-green-500' :
                          completionStatus.color === 'blue' ? 'bg-blue-500' :
                          completionStatus.color === 'yellow' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}>
                          {completionStatus.status === 'completed' ? '✓ Complete' :
                           completionStatus.status === 'in-progress' ? '📺 Watching' :
                           completionStatus.status === 'started' ? '▶ Started' :
                           '⏸ Not Started'}
                        </span>
                      </div>
                    </div>

                    {/* Show Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                        {name}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>First Air Date:</span>
                          <span>{formatDate(firstAir)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>Seasons:</span>
                          <span>{show.number_of_seasons || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>Episodes Watched:</span>
                          <span className="font-medium">{watchedEpisodes}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>My Rating:</span>
                          <div>{renderStars(show.rating)}</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Progress</span>
                          <span>{watchedEpisodes} episodes</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, (watchedEpisodes / Math.max(show.number_of_episodes || 100, 1)) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>

                      {/* Personal Notes */}
                      {show.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-sm text-slate-700 italic">
                            "{show.notes}"
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/tv/${id}`}
                          className="flex-1 px-3 py-2 text-center text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MyShowsPage;
