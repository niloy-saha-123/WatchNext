/**
 * @file Input.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/forms/Input.jsx
 * @description Reusable input component with consistent styling and validation support.
 * Designed with the minimalist red theme to match the application aesthetic.
 */
import React from 'react';
import { LoadingSpinner } from '../common';

function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  error = '',
  label,
  id,
  className = '',
  name,
  loading = false
}) {
  const inputStyles = `
    w-full px-4 py-3 
    bg-slate-800/30 backdrop-blur-sm 
    border border-slate-600/30 rounded-lg 
    text-white placeholder-slate-400 
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
    transition-all duration-300
    ${error ? 'border-red-400 ring-1 ring-red-400' : ''}
    ${className}
  `.trim();

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-300 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={inputStyles}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          disabled={loading}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="small" variant="slate" />
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-300 mt-1" role="alert">{error}</p>
      )}
    </div>
  );
}

export default Input;