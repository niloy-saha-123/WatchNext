/**
 * @file StatsCard.jsx
 * @path /frontend/src/components/common/StatsCard.jsx
 * @description Reusable stats card component for consistent display across dashboard and profile pages.
 */
import React from 'react';

function StatsCard({ 
  icon, 
  value, 
  label, 
  isLoading = false, 
  suffix = '', 
  className = '' 
}) {
  return (
    <div className={`bg-white border border-slate-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">
        {isLoading ? '...' : `${value}${suffix}`}
      </h3>
      <p className="text-slate-600 text-sm">{label}</p>
    </div>
  );
}

export default StatsCard;