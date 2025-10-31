import React from 'react';
import { useToast } from '../../contexts/ToastContext';

const variantStyles = {
  info: 'bg-slate-800/90 text-white border border-slate-700/50',
  success: 'bg-green-600/90 text-white border border-green-500/40',
  warning: 'bg-yellow-600/90 text-white border border-yellow-500/40',
  error: 'bg-red-600/90 text-white border border-red-500/40',
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed top-4 right-4 z-[2000] space-y-3">
      {toasts.map(({ id, message, variant }) => (
        <div
          key={id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg ${variantStyles[variant] || variantStyles.info}`}
          role="status"
          aria-live="polite"
        >
          <div className="text-sm">{message}</div>
          <button
            onClick={() => removeToast(id)}
            className="ml-2 text-white/80 hover:text-white"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;


