import React from 'react';

function Button({ children, onClick, variant = 'primary' }) {
  // Define styles for different button types
  const baseStyles = "px-6 py-2 font-semibold rounded-md transition-transform duration-200 active:scale-95";

  const variantStyles = {
    primary: "bg-cyan-500 text-slate-900 hover:bg-cyan-400",
    secondary: "bg-transparent border-2 border-slate-500 text-slate-200 hover:bg-slate-700 hover:border-slate-700",
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