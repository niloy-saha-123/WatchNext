/**
 * @file ProfilePage.jsx
 * @path /frontend/src/pages/ProfilePage.jsx
 * @description User profile page showing personal info, viewing statistics, and watch history.
 * Features user info, detailed stats, recently watched content, and full watch history access.
 */
import React from 'react';
import { Header } from '../components/common';

function ProfilePage() {
  // Mock user data - replace with real data from backend later
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2023',
    avatar: null, // Will show initials if no avatar
    stats: {
      moviesWatched: 47,
      showsTracked: 23,
      episodesLogged: 298,
      totalHours: 156
    },
    favoriteGenres: [
      { name: 'Action', percentage: 35 },
      { name: 'Sci-Fi', percentage: 28 },
      { name: 'Drama', percentage: 22 },
      { name: 'Comedy', percentage: 15 }
    ],
    recentlyWatched: [
      {
        id: 1,
        title: 'The Last of Us',
        type: 'tv',
        poster: 'https://image.tmdb.org/t/p/w342/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
        watchedAt: '2 days ago'
      },
      {
        id: 2,
        title: 'Avatar: The Way of Water',
        type: 'movie',
        poster: 'https://image.tmdb.org/t/p/w342/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        watchedAt: '1 week ago'
      },
      {
        id: 3,
        title: 'Wednesday',
        type: 'tv',
        poster: 'https://image.tmdb.org/t/p/w342/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
        watchedAt: '2 weeks ago'
      },
      {
        id: 4,
        title: 'Black Panther: Wakanda Forever',
        type: 'movie',
        poster: 'https://image.tmdb.org/t/p/w342/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
        watchedAt: '3 weeks ago'
      },
      {
        id: 5,
        title: 'House of the Dragon',
        type: 'tv',
        poster: 'https://image.tmdb.org/t/p/w342/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',
        watchedAt: '1 month ago'
      }
    ]
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getTypeIcon = (type) => {
    if (type === 'movie') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16">
        {/* Profile Hero Section */}
        <section className="bg-gradient-to-r from-red-500 via-orange-500 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Picture / Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt={userData.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {getInitials(userData.name)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* User Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{userData.name}</h1>
                  <p className="text-lg opacity-90 mb-1">{userData.email}</p>
                  <p className="text-sm opacity-75">Member since {userData.memberSince}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            
            {/* Viewing Statistics */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Viewing Statistics</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{userData.stats.moviesWatched}</h3>
                  <p className="text-slate-600 text-sm">Movies Watched</p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{userData.stats.showsTracked}</h3>
                  <p className="text-slate-600 text-sm">TV Shows Tracked</p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{userData.stats.episodesLogged}</h3>
                  <p className="text-slate-600 text-sm">Episodes Logged</p>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{userData.stats.totalHours}h</h3>
                  <p className="text-slate-600 text-sm">Total Hours</p>
                </div>
              </div>

              {/* Favorite Genres */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Favorite Genres</h3>
                <div className="space-y-3">
                  {userData.favoriteGenres.map((genre, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-700 font-medium">{genre.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${genre.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-slate-600 text-sm font-medium w-10 text-right">
                          {genre.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recently Watched */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Recently Watched</h2>
                <button className="text-orange-600 hover:text-orange-700 font-medium">
                  View All →
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {userData.recentlyWatched.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-48">
                      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative">
                          <img 
                            src={item.poster} 
                            alt={item.title}
                            className="w-full h-72 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                            <div className="text-white">
                              {getTypeIcon(item.type)}
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600">{item.watchedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Watch History Link */}
            <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Complete Watch History</h3>
                <p className="text-slate-600 mb-4">
                  View your complete viewing history with detailed logs, ratings, and notes for every movie and show you've watched.
                </p>
                <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 font-medium">
                  View Full History
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;