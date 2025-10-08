/**
 * @file DashboardPage.jsx
 * @path /frontend/src/pages/DashboardPage.jsx
 * @description Main dashboard page for authenticated users to track their movies and TV shows.
 * Features a clean white background with strategic use of the brand gradient theme.
 */
import React from 'react';
import { Header, LoadingSpinner, StatsCard, ErrorMessage, SearchInput } from '../components/common';
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
                Track every movie. Binge every series. Never lose your place again.
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
                  <StatsCard
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    }
                    value={stats.moviesWatched}
                    label="Movies"
                    isLoading={isLoading}
                    className="text-2xl"
                  />
                  
                  <StatsCard
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                    value={stats.showsTracked}
                    label="TV Shows"
                    isLoading={isLoading}
                    className="text-2xl"
                  />
                  
                  <StatsCard
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    value={stats.totalHours}
                    label="Hours Watched"
                    suffix="h"
                    isLoading={isLoading}
                    className="text-2xl"
                  />
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="large" variant="primary" text="Loading your stats..." />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <ErrorMessage message={`Error loading stats: ${error}`} />
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
                    {/* Live Search Input */}
                    <SearchInput
                      placeholder="Search movies and TV shows..."
                      showDropdown={true}
                      maxResults={5}
                    />
                    <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-colors duration-300">
                      <div className="flex items-center text-slate-700 hover:text-orange-600">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">Add Manual Entry</span>
                      </div>
                    </button>
                    <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-orange-50 hover:border-orange-200 transition-colors duration-300">
                      <div className="flex items-center text-slate-700 hover:text-orange-600">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
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