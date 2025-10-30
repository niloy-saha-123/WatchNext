/**
 * @file Header.jsx
 * @path frontend/src/components/common/Header.jsx
 * @description Main navigation header component for the application.
 * Semi-transparent fixed header with logo, search, and authentication controls.
 * Uses actual authentication state from AuthContext for security.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '.';
import ProfileDropdown from './ProfileDropdown';
import SearchInput from './SearchInput';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  // On landing page, always use public theme regardless of auth
  const showAuthenticatedUI = isAuthenticated && !isLandingPage;
  const useCleanTheme = showAuthenticatedUI;
  
  // Determine button theme based on authentication status
  const buttonTheme = showAuthenticatedUI ? 'orange' : 'red';
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${
        useCleanTheme 
          ? 'bg-white border-gray-200' 
          : 'bg-slate-900/80 border-slate-700'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link to={showAuthenticatedUI ? "/dashboard" : "/"} className={`text-3xl font-black transition-all duration-300 tracking-tight flex-shrink-0`}>
          <span className={useCleanTheme ? 'text-red-600' : 'bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent'}>
            Watch
          </span>
          <span className={useCleanTheme ? 'text-gray-900' : 'text-white'}>Next</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search Bar - Only on authenticated pages */}
        {showAuthenticatedUI && (
          <div className="flex-1 max-w-2xl mx-auto">
            <SearchInput
              placeholder="Search..."
              showDropdown={true}
              maxResults={5}
              className="w-full"
            />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <nav className="flex items-center gap-4 flex-shrink-0" role="navigation" aria-label="Main navigation">
          {showAuthenticatedUI ? (
            // Authenticated pages navigation - profile menu
            <ProfileDropdown />
          ) : (
            // Public pages navigation - login/signup buttons
            <>
              <Link to="/login">
                <Button variant="secondary" theme={buttonTheme} aria-label="Sign in to your account">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" theme={buttonTheme} aria-label="Create a new account">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
