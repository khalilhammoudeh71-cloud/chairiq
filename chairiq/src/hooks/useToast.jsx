import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 5 seconds (increased from 3 for error messages)
    setTimeout(() => {
      setToasts(prev => prev?.filter(toast => toast?.id !== id));
    }, type === 'error' ? 7000 : 5000);
  };

  const removeToast = useCallback((id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  }, []);

  return {
    showToast,
    removeToast,
    toasts
  };
}