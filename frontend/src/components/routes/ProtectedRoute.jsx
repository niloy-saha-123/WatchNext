/**
 * @file ProtectedRoute.jsx
 * @path /frontend/src/components/routes/ProtectedRoute.jsx
 * @description Route wrapper that requires authentication to access.
 * Redirects to login page if user is not authenticated.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * 
 * @param {React.ReactNode} children - Child components to render if authenticated
 * @returns {React.ReactElement} - Protected content or redirect to login
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // DEVELOPMENT MODE: Allow access to all pages for testing
  const isDevelopment = import.meta.env.MODE === 'development';

  // Show loading spinner while checking authentication status
  if (isLoading && !isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // DEVELOPMENT MODE: Always allow access (bypass authentication check)
  if (isDevelopment) {
    return children;
  }

  // Redirect to login if not authenticated (PRODUCTION ONLY)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}

export default ProtectedRoute;

