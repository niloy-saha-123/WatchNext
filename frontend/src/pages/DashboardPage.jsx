/**
 * @file DashboardPage.jsx
 * @path /frontend/src/pages/DashboardPage.jsx
 * @description Main dashboard page for authenticated users to track their movies and TV shows.
 * Features a clean white background with strategic use of the brand gradient theme.
 */
import React from 'react';
import { Header, LoadingSpinner } from '../components/common';
import { useUserStats } from '../hooks/useUserStats';

function DashboardPage() {
  // Hook to manage user statistics
  const { stats, isLoading, error } = useUserStats();
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
                Your personalized dashboard to track movies, discover what's next, and never lose progress again.
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
                  <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white text-xl">🎬</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                      {isLoading ? '...' : stats.moviesWatched}
                    </h3>
                    <p className="text-slate-600 text-sm">Movies Watched</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white text-xl">📺</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                      {isLoading ? '...' : stats.showsTracked}
                    </h3>
                    <p className="text-slate-600 text-sm">TV Shows Tracked</p>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-white text-xl">⏱️</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">
                      {isLoading ? '...' : `${stats.totalHours}h`}
                    </h3>
                    <p className="text-slate-600 text-sm">Watch Time</p>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="large" variant="primary" text="Loading your stats..." />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">Error loading stats: {error}</p>
                  </div>
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
                    <button className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all duration-300">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🔍</span>
                        <span className="font-medium">Search Movies & Shows</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-300">
                      <div className="flex items-center text-slate-700">
                        <span className="text-lg mr-3">📝</span>
                        <span className="font-medium">Add Manual Entry</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-300">
                      <div className="flex items-center text-slate-700">
                        <span className="text-lg mr-3">📊</span>
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