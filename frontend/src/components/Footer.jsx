/**
 * @file Footer.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/Footer.jsx
 * @description This component renders the main footer for the application.
 * It's designed to be simple, clean, and provide essential information
 * like copyright and a link to the project's source code.
 */
import React from 'react';

// An inline SVG component for the GitHub icon for better performance and scalability.
const GitHubIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-slate-400">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} WatchNext. All Rights Reserved.
        </p>
        <a 
          href="https://github.com/niloy-saha-123/WatchNext" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors mt-4 sm:mt-0"
        >
          <GitHubIcon />
          <span>View on GitHub</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
