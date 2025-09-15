/**
 * @file Input.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/forms/Input.jsx
 * @description Reusable input component with consistent styling and validation support.
 * Designed with the minimalist red theme to match the application aesthetic.
 */
import React from 'react';

function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  error = '',
  label,
  id,
  className = ''
}) {
  const inputStyles = `
    w-full px-4 py-3 
    bg-slate-800/30 backdrop-blur-sm 
    border border-slate-600/30 rounded-lg 
    text-white placeholder-slate-400 
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
    transition-all duration-300
    ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
    ${className}
  `.trim();

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={inputStyles}
      />
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

export default Input;