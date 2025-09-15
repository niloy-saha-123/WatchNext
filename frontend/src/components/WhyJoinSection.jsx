/**
 * @file WhyJoinSection.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/WhyJoinSection.jsx
 * @description This component explains the key benefits and features of WatchNext
 * to convince users to sign up. It's placed after the hero section
 * to provide more detailed information about the service.
 */
import React from 'react';

function WhyJoinSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-left mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose WatchNext?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-left p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Effortless Progress Tracking</h3>
            <p className="text-slate-300 text-sm">
              Never forget which season you finished - simple, elegant viewing history for movies and TV seasons.
            </p>
          </div>
          
          <div className="text-left p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-15 0v-5h5l-5-5-5 5h5v5a7.5 7.5 0 0015 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Automated Discovery</h3>
            <p className="text-slate-300 text-sm">
              Instantly see when new seasons or sequels are released - the app does the work for you.
            </p>
          </div>
          
          <div className="text-left p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Memory Cache</h3>
            <p className="text-slate-300 text-sm">
              Private plot reminders solve "what happened last season?" - your personal notes appear with new releases.
            </p>
          </div>
          
          <div className="text-left p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Binge Calculator</h3>
            <p className="text-slate-300 text-sm">
              Calculate total runtime of episodes you have left - perfect for planning catch-up binges.
            </p>
          </div>
          
          <div className="text-left p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3H5V1a1 1 0 011-1h2a1 1 0 011 1v3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM4 8h16l-1 13H5L4 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Mood Board</h3>
            <p className="text-slate-300 text-sm">
              Filter your watchlist by genre and mood - solve choice paralysis with instant organization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyJoinSection;