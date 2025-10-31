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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}

export default ProtectedRoute;

