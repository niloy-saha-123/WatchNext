/**
 * @file Header.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/Header.jsx
 * @description This component renders the main navigation header for the application.
 * It is designed to be semi-transparent and fixed at the top of the viewport.
 * It includes the application logo which links back to the homepage, and
 * primary/secondary action buttons for user authentication.
 */
import React from 'react';
import Button from './Button'; // Assuming Button.jsx is in the same directory

function Header() {
  // In a real app, these onClick handlers would navigate the user.
  // We'll use React Router for this later.
  const handleLoginClick = () => {
    console.log("Navigate to Login page");
  };

  const handleSignUpClick = () => {
    console.log("Navigate to Sign Up page");
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700"
    >
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-3xl font-black text-slate-100 hover:text-orange-400 transition-all duration-300 tracking-tight">
          <span className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent font-brand">
            Watch
          </span>
          <span className="text-white font-brand">
            Next
          </span>
        </a>

        {/* Action Buttons */}
        <nav className="flex items-center gap-4">
          <Button onClick={handleLoginClick} variant="secondary">
            Login
          </Button>
          <Button onClick={handleSignUpClick} variant="primary">
            Sign Up
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
