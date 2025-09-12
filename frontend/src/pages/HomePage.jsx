//frontend/src/pages/HomePage.jsx

import React from 'react';
import Button from '../components/Button';      

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          WATCHNEXT
        </h1>
        <p className="text-lg text-slate-400">
          Track. Discover. Watch.
        </p>
        {/* The Login and Register buttons will go here */}
      </div>
    </div>
  );
}

export default HomePage;