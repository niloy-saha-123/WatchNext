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
import { mediaAPI, bundleAPI } from '../services/apiClient';

function DashboardPage() {
  const { moviesWatched, showsWatched, getTotalHours, watchData } = useWatchData();
  // const { user } = useAuth(); // TODO: Use for personalized greeting once user profile is implemented
  const [trending, setTrending] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [bundles, setBundles] = useState([]);
  const [bundlesError, setBundlesError] = useState('');

  // Fetch trending content with 1-week caching
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Check cache first
        const cacheKey = 'trending_content';
        const cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 1 week in ms
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          if (age < cacheExpiry) {
            // Cache is still valid
            setTrending(data);
            setLoadingTrending(false);
            return;
          }
        }
        
        // Fetch fresh data from API
        const data = await mediaAPI.getTrending('all', 'week');
        const results = data.results?.slice(0, 12) || [];
        setTrending(results);
        
        // Cache for 1 week
        localStorage.setItem(cacheKey, JSON.stringify({
          data: results,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error fetching trending:', error);
        // Try to use cached data if API fails
        const cached = localStorage.getItem('trending_content');
        if (cached) {
          const { data } = JSON.parse(cached);
          setTrending(data);
        }
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  // Fetch user's bundles for sidebar preview
  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setBundlesError('');
        const response = await bundleAPI.getBundles();
        if (response?.success && Array.isArray(response.data)) {
          setBundles(response.data);
        } else {
          setBundles([]);
        }
      } catch (error) {
        console.error('Error fetching bundles:', error);
        setBundlesError('');
      }
    };
    fetchBundles();
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
    <div className="min-h-screen bg-white relative">
      {/* Subtle gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-50/60 via-orange-50/40 to-transparent pointer-events-none"></div>
      <Header />
      
      {/* Main Content */}
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-6 max-w-[1600px]">
          
          {/* Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Stats Overview Section */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <Link to="/my-shows" className="group">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-red-300 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{showsWatched}</p>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Shows Watched</p>
                      </div>
                      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <svg className="w-7 h-7 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
            </div>
          </div>
                </Link>

                <Link to="/my-movies" className="group">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-red-300 hover:shadow-lg hover:shadow-red-100/50 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{moviesWatched}</p>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Movies Watched</p>
                      </div>
                      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <svg className="w-7 h-7 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                <div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{Math.round(getTotalHours())}<span className="text-xl text-gray-600">h</span></p>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Hours</p>
                      </div>
                      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trending Now Section */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Updated weekly</span>
                </div>

                {loadingTrending ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {trending.map(item => (
                        <Link
                          key={item.id}
                          to={`/${item.media_type}/${item.id}`}
                          className="group flex-shrink-0 w-44 snap-start"
                        >
                          <div className="relative rounded-3xl overflow-hidden mb-4 shadow-sm hover:shadow-xl hover:shadow-red-100/30 transition-all duration-300 group-hover:-translate-y-2">
                            <div className="aspect-[2/3] bg-gray-100">
                              {item.poster_path ? (
                                <img
                                  src={getImageUrl(item.poster_path, 'w342')}
                                  alt={item.title || item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                  </div>
                )}
                            </div>
                            {item.vote_average > 0 && (
                              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                                <div className="flex items-center space-x-1">
                                  <span className="text-red-500 text-sm font-bold">★</span>
                                  <span className="text-gray-900 text-sm font-semibold">{item.vote_average.toFixed(1)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                            {item.title || item.name}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">{item.media_type}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Continue Watching */}
              {inProgressShows.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Continue Watching</h2>
                    <Link to="/my-shows" className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full transition-colors">
                      View All →
                    </Link>
                  </div>
                  
                  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {inProgressShows.map(show => {
                      const episodeProgress = show.episodeProgress || {};
                      const watchedCount = Object.values(episodeProgress).filter(watched => watched).length;
                      const totalEpisodes = show.number_of_episodes || 100;
                      const progressPercent = Math.round((watchedCount / totalEpisodes) * 100);

                      return (
                        <Link
                          key={show.id}
                          to={`/tv/${show.id}`}
                          className="group flex-shrink-0 w-72 snap-start"
                        >
                          <div className="relative rounded-3xl overflow-hidden mb-4 shadow-sm hover:shadow-xl hover:shadow-red-100/30 transition-all duration-300 group-hover:-translate-y-2">
                            <div className="aspect-video bg-gray-100">
                              {show.backdrop_path ? (
                                <img
                                  src={getImageUrl(show.backdrop_path, 'w500')}
                                  alt={show.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                                </div>
                              )}
                      </div>
                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 rounded-b-3xl overflow-hidden">
                              <div 
                                className="h-full bg-red-500 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                      </div>
                      </div>
                          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors mb-1">
                            {show.name}
                          </h3>
                          <p className="text-xs text-gray-500">{progressPercent}% complete · {watchedCount} episodes</p>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* My Watchlist */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">My Watchlist</h2>
                  <Link to="/watchlist" className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full transition-colors">
                    View All →
                  </Link>
                </div>

                {watchData.watchlist.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-16 text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Your watchlist is empty</h3>
                    <p className="text-gray-600 mb-6">Search for movies and shows to add them to your watchlist</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {watchData.watchlist.slice(0, 10).map(item => (
                        <Link
                          key={item.id}
                          to={`/${item.media_type}/${item.id}`}
                          className="group flex-shrink-0 w-44 snap-start"
                        >
                          <div className="relative rounded-3xl overflow-hidden mb-4 shadow-sm hover:shadow-xl hover:shadow-red-100/30 transition-all duration-300 group-hover:-translate-y-2">
                            <div className="aspect-[2/3] bg-gray-100">
                              {item.poster_path ? (
                                <img
                                  src={getImageUrl(item.poster_path, 'w342')}
                                  alt={item.title || item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {item.vote_average > 0 && (
                              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                                <div className="flex items-center space-x-1">
                                  <span className="text-red-500 text-sm font-bold">★</span>
                                  <span className="text-gray-900 text-sm font-semibold">{item.vote_average.toFixed(1)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                            {item.title || item.name}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">{item.media_type}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>

            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">

              {/* Bundles (Playlists) - Sidebar Preview */}
              <div className="bg-gradient-to-br from-red-50 to-red-50 rounded-3xl p-8 border border-red-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Bundles</h3>
                  </div>
                  <Link to="/bundles" className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full transition-colors">View All</Link>
                </div>
                {bundlesError ? (
                  <p className="text-sm text-gray-600">Unable to load bundles.</p>
                ) : bundles.length === 0 ? (
                  <div className="text-sm text-gray-700">
                    <p className="mb-4 leading-relaxed">Create playlists like "MCU Marathon" or "Oscar Winners"</p>
                    <Link to="/bundles" className="inline-flex w-full items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-2xl transition-colors text-sm">Create Your First Bundle</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bundles.slice(0, 4).map((bundle) => (
                      <Link key={bundle._id} to="/bundles" className="block group">
                        <div className="flex items-center justify-between bg-white border border-red-100 rounded-2xl px-4 py-3 hover:border-red-300 hover:shadow-md transition-all">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-red-600">{bundle.name}</p>
                            <p className="text-xs text-gray-500 truncate">{bundle.items?.length || 0} items</p>
                          </div>
                          <span className="text-xs text-red-600 group-hover:text-red-700">Open →</span>
                        </div>
                      </Link>
                    ))}
                    {bundles.length > 4 && (
                      <Link to="/bundles" className="block text-center text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-2 rounded-2xl transition-colors">View {bundles.length - 4} more</Link>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                {watchData.movies.length === 0 && watchData.shows.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
                ) : (
                  <div className="space-y-4">
                    {[...watchData.movies.slice(-3), ...watchData.shows.slice(-3)].slice(-5).reverse().map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                        <p className="text-sm text-gray-700 line-clamp-1 flex-1 font-medium">
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