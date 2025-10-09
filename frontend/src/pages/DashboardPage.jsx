/**
 * @file DashboardPage.jsx
 * @path /frontend/src/pages/DashboardPage.jsx
 * @description Modern dashboard inspired by Netflix and Spotify with minimalist design, red accents, and cinematic feel.
 * Features stats, trending content, continue watching, watchlist, and sidebar with recent activity and bundles.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/common';
import { useWatchData } from '../contexts/WatchDataContext';
// import { useAuth } from '../contexts/AuthContext'; // TODO: Use for personalized greeting once user profile is implemented
import { mediaAPI } from '../services/apiClient';

function DashboardPage() {
  const { moviesWatched, showsWatched, getTotalHours, watchData } = useWatchData();
  // const { user } = useAuth(); // TODO: Use for personalized greeting once user profile is implemented
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Fetch trending content
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await mediaAPI.getTrending('all', 'week');
        setTrending(data.results?.slice(0, 12) || []);
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getInProgressShows = () => {
    return watchData.shows.filter(show => {
      const episodeProgress = show.episodeProgress || {};
      const watchedCount = Object.values(episodeProgress).filter(watched => watched).length;
      const totalEpisodes = show.number_of_episodes || 100;
      return watchedCount > 0 && watchedCount < totalEpisodes;
    }).slice(0, 6);
  };

  const inProgressShows = getInProgressShows();

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      
      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-[1600px]">
          
          {/* Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Stats Overview Section */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link to="/my-shows" className="group">
                  <div className="bg-orange-50/80 border-2 border-orange-200 rounded-xl p-4 hover:border-red-500 hover:bg-orange-100/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{showsWatched}</p>
                        <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Shows Watched</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <svg className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
            </div>
          </div>
                </Link>

                <Link to="/my-movies" className="group">
                  <div className="bg-orange-50/80 border-2 border-orange-200 rounded-xl p-4 hover:border-red-500 hover:bg-orange-100/80 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{moviesWatched}</p>
                        <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Movies Watched</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <svg className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                <div>
                  <div className="bg-orange-50/80 border-2 border-orange-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{Math.round(getTotalHours())}<span className="text-xl text-slate-600">h</span></p>
                        <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total Hours</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trending Now Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
                  <span className="text-sm text-slate-500">Updated daily</span>
                </div>

                {loadingTrending ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {trending.map(item => (
                        <Link
                          key={item.id}
                          to={`/${item.media_type}/${item.id}`}
                          className="group flex-shrink-0 w-40 snap-start"
                        >
                          <div className="relative rounded-lg overflow-hidden mb-3 shadow-md hover:shadow-xl transition-shadow">
                            <div className="aspect-[2/3] bg-orange-100">
                              {item.poster_path ? (
                                <img
                                  src={getImageUrl(item.poster_path, 'w342')}
                                  alt={item.title || item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-orange-400">
                                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                  </div>
                )}
                            </div>
                            {item.vote_average > 0 && (
                              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1">
                                <div className="flex items-center space-x-1">
                                  <span className="text-orange-500 text-xs">★</span>
                                  <span className="text-white text-xs font-semibold">{item.vote_average.toFixed(1)}</span>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {item.title || item.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 capitalize">{item.media_type}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Continue Watching */}
              {inProgressShows.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Continue Watching</h2>
                    <Link to="/my-shows" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                      View All →
                    </Link>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {inProgressShows.map(show => {
                      const episodeProgress = show.episodeProgress || {};
                      const watchedCount = Object.values(episodeProgress).filter(watched => watched).length;
                      const totalEpisodes = show.number_of_episodes || 100;
                      const progressPercent = Math.round((watchedCount / totalEpisodes) * 100);

                      return (
                        <Link
                          key={show.id}
                          to={`/tv/${show.id}`}
                          className="group flex-shrink-0 w-64 snap-start"
                        >
                          <div className="relative rounded-lg overflow-hidden mb-3 shadow-md hover:shadow-xl transition-shadow">
                            <div className="aspect-video bg-orange-100">
                              {show.backdrop_path ? (
                                <img
                                  src={getImageUrl(show.backdrop_path, 'w500')}
                                  alt={show.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-orange-400">
                                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                                </div>
                              )}
                      </div>
                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                              <div 
                                className="h-full bg-orange-600 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                      </div>
                      </div>
                          <h3 className="font-semibold text-sm text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {show.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">{progressPercent}% complete · {watchedCount} episodes</p>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* My Watchlist */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">My Watchlist</h2>
                  <Link to="/watchlist" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                    View All →
                  </Link>
                </div>

                {watchData.watchlist.length === 0 ? (
                  <div className="bg-orange-100/50 border-2 border-dashed border-orange-300 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Your watchlist is empty</h3>
                    <p className="text-slate-600 mb-4">Search for movies and shows to add them to your watchlist</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {watchData.watchlist.slice(0, 10).map(item => (
                        <Link
                          key={item.id}
                          to={`/${item.media_type}/${item.id}`}
                          className="group flex-shrink-0 w-40 snap-start"
                        >
                          <div className="relative rounded-lg overflow-hidden mb-3 shadow-md hover:shadow-xl hover:shadow-orange-100 transition-shadow">
                            <div className="aspect-[2/3] bg-orange-100">
                              {item.poster_path ? (
                                <img
                                  src={getImageUrl(item.poster_path, 'w342')}
                                  alt={item.title || item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-orange-400">
                                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {item.vote_average > 0 && (
                              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-md px-2 py-1">
                                <div className="flex items-center space-x-1">
                                  <span className="text-orange-400 text-xs">★</span>
                                  <span className="text-white text-xs font-semibold">{item.vote_average.toFixed(1)}</span>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {item.title || item.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 capitalize">{item.media_type}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>

            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              
              {/* Bundles (Playlists) - Placeholder */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-bold text-orange-900">Bundles</h3>
                </div>
                <p className="text-sm text-orange-800 mb-4">
                  Create playlists like "MCU Marathon" or "Oscar Winners"
                </p>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                  Coming Soon
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-orange-50/80 border-2 border-orange-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                {watchData.movies.length === 0 && watchData.shows.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No activity yet</p>
                ) : (
                  <div className="space-y-3">
                    {[...watchData.movies.slice(-3), ...watchData.shows.slice(-3)].slice(-5).reverse().map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full flex-shrink-0"></div>
                        <p className="text-sm text-slate-700 line-clamp-1 flex-1">
                          {item.title || item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            </aside>
          </div>
        </div>
      </main>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;