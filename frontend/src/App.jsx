/**
 * @file App.jsx
 * @path /frontend/src/App.jsx
 * @description Root component with React Router configuration.
 * Implements protected routes for authenticated pages and public routes for login/signup.
 * All user-specific pages require authentication.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/Toast';
import { WatchDataProvider } from './contexts/WatchDataContext';
import { ProtectedRoute, PublicRoute } from './components/routes';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SearchResultsPage from './pages/SearchResultsPage';
import MovieShowDetailPage from './pages/MovieShowDetailPage';
import MyMoviesPage from './pages/MyMoviesPage';
import MyShowsPage from './pages/MyShowsPage';
import WatchlistPage from './pages/WatchlistPage';
import BundlesPage from './pages/BundlesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WatchDataProvider>
          <Router>
          <ErrorBoundary>
          <Routes>
            {/* Public Routes - Accessible to everyone */}
            <Route path="/" element={<HomePage />} />
            
            {/* Auth Routes - Redirect to dashboard if already logged in */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } 
            />
            
            {/* Static info pages */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Protected Routes - Require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <SearchResultsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-movies" 
              element={
                <ProtectedRoute>
                  <MyMoviesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-shows" 
              element={
                <ProtectedRoute>
                  <MyShowsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <WatchlistPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bundles" 
              element={
                <ProtectedRoute>
                  <BundlesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/:type/:id" 
              element={
                <ProtectedRoute>
                  <MovieShowDetailPage />
                </ProtectedRoute>
              } 
            />
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </ErrorBoundary>
          <ToastContainer />
        </Router>
        </WatchDataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
