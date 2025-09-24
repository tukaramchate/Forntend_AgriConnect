import { useCallback } from 'react';
import { useToast } from './useToast';

/**
 * Hook for handling errors consistently across the application
 */
export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = useCallback((error, customMessage = null) => {
    console.error('Error caught by useErrorHandler:', error);
    
    // Determine the message to show
    let message = customMessage;
    if (!message) {
      if (error?.message) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        message = 'An unexpected error occurred';
      }
    }

    // Show error toast
    showToast(message, 'error');
    
    // In a real app, you might want to:
    // - Log errors to a service like Sentry
    // - Show user-friendly error messages
    // - Handle specific error types differently
    
    return message;
  }, [showToast]);

  return { handleError };
};