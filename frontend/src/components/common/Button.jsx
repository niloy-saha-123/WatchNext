/**
 * @file Button.jsx
 * @path /frontend/src/components/common/Button.jsx
 * @description A reusable, styled button component with support for different variants.
 * Updated to match the red-orange-purple gradient theme.
 */
import React from 'react';

function Button({ children, onClick, variant = 'primary' }) {
  // Base styles are common to all button variants
  const baseStyles = "px-6 py-3 font-semibold rounded-lg transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";
  
  // Variant-specific styles - solid red theme without purple
  const variantStyles = {
    primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-transparent border-2 border-red-500/50 text-red-200 hover:bg-red-600/15 hover:border-red-400 focus:ring-red-400 backdrop-blur-sm",
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
