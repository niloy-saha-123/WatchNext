/**
 * @file PublicRoute.jsx
 * @path /frontend/src/components/routes/PublicRoute.jsx
 * @description Route wrapper for public pages (login, signup).
 * Redirects to dashboard if user is already authenticated.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common';

/**
 * Public Route Component
 * Wraps routes that should only be accessible when NOT authenticated (login, signup)
 * Redirects to dashboard if user is already logged in
 * 
 * @param {React.ReactNode} children - Child components to render if not authenticated
 * @returns {React.ReactElement} - Public content or redirect to dashboard
 */
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-orange-500 to-purple-600">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is not authenticated, render the public content (login/signup)
  return children;
}

export default PublicRoute;

