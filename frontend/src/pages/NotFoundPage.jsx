import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="text-center space-y-4">
        <div className="text-7xl">🔍</div>
        <h1 className="text-2xl font-semibold">Page Not Found</h1>
        <p className="text-slate-300">The page you are looking for doesn’t exist.</p>
        <Link to="/" className="text-red-300 hover:text-red-200">Go back home</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;


