/**
 * @file LoadingSpinner.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/common/LoadingSpinner.jsx
 * @description A reusable loading spinner component with different sizes and themes
 * 
 * Usage Examples:
 * - Form loading: <LoadingSpinner size="small" variant="slate" />
 * - Page loading: <LoadingSpinner size="xl" variant="secondary" text="Loading..." />
 * - Button loading: Handled automatically by Button component
 * - API loading: <LoadingSpinner size="large" variant="primary" text="Fetching data..." />
 * 
 * 📝 For visual examples, see LoadingDemo.jsx (reference only)
 */
import React from 'react';

function LoadingSpinner({ size = 'medium', variant = 'primary', text = '' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8', 
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const variantClasses = {
    primary: 'border-orange-500 border-t-transparent', // Orange for dashboard
    secondary: 'border-white border-t-transparent',
    slate: 'border-slate-400 border-t-transparent',
    red: 'border-red-500 border-t-transparent' // Red for homepage
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]}
          border-2 rounded-full animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm text-slate-300 animate-pulse">{text}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;