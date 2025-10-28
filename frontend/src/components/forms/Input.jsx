/**
 * @file Input.jsx
 * @path /Users/niloysaha/IdeaProjects/WatchNext/frontend/src/components/forms/Input.jsx
 * @description Reusable input component with password visibility toggle, validation, and modern UI.
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
  loading = false,
  showPasswordToggle = false,
  // External password visibility state (optional)
  isPasswordVisible = false,
  onPasswordToggle = null
}) {
  // Use external state if provided, otherwise manage internally
  const showPassword = showPasswordToggle && isPasswordVisible !== undefined ? isPasswordVisible : false;
  const displayType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const inputStyles = `
    w-full px-4 py-3 
    bg-slate-800/30 backdrop-blur-sm 
    border border-slate-600/30 rounded-lg 
    text-white placeholder-slate-400 
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
    transition-all duration-300
    ${error ? 'border-red-400 ring-1 ring-red-400' : ''}
    ${className}
    ${showPasswordToggle ? 'pr-12' : ''}
  `.trim();

  const handleToggle = () => {
    if (onPasswordToggle) {
      onPasswordToggle(); // Use external handler
    }
  };

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
          type={displayType}
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
        
        {/* Password visibility toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}

        {loading && !showPasswordToggle && (
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
