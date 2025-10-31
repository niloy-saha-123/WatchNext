import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, variant = 'info', durationMs = 5000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, variant }]);
    if (durationMs > 0) {
      setTimeout(() => removeToast(id), durationMs);
    }
    return id;
  }, [removeToast]);

  // Listen for global session expiration events
  useEffect(() => {
    const onExpired = () => {
      addToast('Session expired. Please login again.', 'warning', 6000);
    };
    window.addEventListener('app:session-expired', onExpired);
    return () => window.removeEventListener('app:session-expired', onExpired);
  }, [addToast]);

  const value = useMemo(() => ({ addToast, removeToast, toasts }), [addToast, removeToast, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;


