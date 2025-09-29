/**
 * @file ErrorMessage.jsx
 * @path /frontend/src/components/common/ErrorMessage.jsx
 * @description Reusable error message component for consistent error display
 */
import React from 'react';

function ErrorMessage({ 
  title,
  message, 
  onRetry,
  retryText = 'Try Again',
  variant = 'default' // 'default' or 'centered'
}) {
  const containerClasses = variant === 'centered' 
    ? "container mx-auto px-4 py-8" 
    : "";
  
  const messageClasses = variant === 'centered'
    ? "max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6"
    : "bg-red-50 border border-red-200 rounded-lg p-4";

  return (
    <div className={containerClasses}>
      <div className={messageClasses}>
        {title && (
          <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        )}
        <p className="text-red-600 text-sm mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;