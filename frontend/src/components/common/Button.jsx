/**
 * @file Button.jsx
 * @path /frontend/src/components/common/Button.jsx
 * @description A reusable, styled button component with support for different variants.
 * Updated to match the red-orange-purple gradient theme.
 */
import React from 'react';

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  loading = false, 
  type = 'button',
  className = '',
  theme = 'orange', // 'orange' for dashboard, 'red' for homepage
  ...props 
}) {
  // Base styles are common to all button variants
  const baseStyles = "px-6 py-3 font-semibold rounded-lg transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";
  
  // Theme-based variant styles
  const getVariantStyles = (theme) => {
    if (theme === 'red') {
      return {
        primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        secondary: "bg-transparent border-2 border-red-500/50 text-red-200 hover:bg-red-600/15 hover:border-red-400 focus:ring-red-400 backdrop-blur-sm",
      };
    }
    // Default orange theme for dashboard
    return {
      primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500",
      secondary: "bg-transparent border-2 border-orange-500/50 text-orange-200 hover:bg-orange-600/15 hover:border-orange-400 focus:ring-orange-400 backdrop-blur-sm",
    };
  };
  
  const variantStyles = getVariantStyles(theme);

  return (
    <button 
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
