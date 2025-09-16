/**
 * @file Header.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/common/Header.jsx
 * @description This component renders the main navigation header for the application.
 * It is designed to be semi-transparent and fixed at the top of the viewport.
 * It includes the application logo which links back to the homepage, and
 * primary/secondary action buttons for user authentication.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '.';
import ProfileDropdown from './ProfileDropdown';

function Header() {
  const location = useLocation();
  
  // Check if user is on authenticated pages (dashboard, profile, etc.)
  const authenticatedPages = ['/dashboard', '/profile', '/settings', '/help'];
  const isAuthenticated = authenticatedPages.some(page => location.pathname.startsWith(page));
  
  // Use white background for authenticated pages
  const useWhiteBackground = isAuthenticated;
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${
        useWhiteBackground 
          ? 'bg-white/90 border-slate-200' 
          : 'bg-slate-900/80 border-slate-700'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className={`text-3xl font-black transition-all duration-300 tracking-tight ${
          useWhiteBackground 
            ? 'text-slate-900 hover:text-red-500' 
            : 'text-slate-100 hover:text-orange-400'
        }`}>
          <span className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent font-brand">
            Watch
          </span>
          <span className={useWhiteBackground ? 'text-slate-900' : 'text-white'}>
            Next
          </span>
        </Link>

        {/* Action Buttons */}
        <nav className="flex items-center gap-4" role="navigation" aria-label="Main navigation">
          {isAuthenticated ? (
            // Authenticated pages navigation - profile menu
            <ProfileDropdown />
          ) : (
            // Public pages navigation - login/signup buttons
            <>
              <Link to="/login">
                <Button variant="secondary" aria-label="Sign in to your account">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" aria-label="Create a new account">
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
