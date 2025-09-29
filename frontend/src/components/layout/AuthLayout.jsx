/**
 * @file AuthLayout.jsx
 * @path /frontend/src/components/layout/AuthLayout.jsx
 * @description Reusable layout component for authentication pages.
 * Features centered design with minimalist red theme and gradient background.
 */
import React from 'react';
import { Link } from 'react-router-dom';

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-red-500 via-orange-500 via-purple-600 to-blue-900">
      {/* Light overlay for consistency with homepage */}
      <div className="absolute inset-0 bg-slate-900/25 z-0"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Header */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-black text-white hover:text-orange-400 transition-all duration-300 tracking-tight">
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent font-brand">
                  Watch
                </span>
                <span className="text-white">
                  Next
                </span>
              </h1>
            </Link>
          </div>

          {/* Form Container */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
              {subtitle && <p className="text-slate-300">{subtitle}</p>}
            </div>
            
            {children}
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-white transition-colors duration-300 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;