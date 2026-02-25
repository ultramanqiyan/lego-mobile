import React, { createContext, useContext, useState, useCallback } from 'react';
import { COLORS } from '../utils/constants';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, visible: false } : null));
  }, []);

  const success = useCallback((message, duration) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const value = {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const getToastColor = (type) => {
  switch (type) {
    case 'success':
      return COLORS.success;
    case 'error':
      return COLORS.error;
    case 'warning':
      return COLORS.warning;
    case 'info':
    default:
      return COLORS.info;
  }
};

export default ToastContext;
