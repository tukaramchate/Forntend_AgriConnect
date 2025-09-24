import { useCallback } from 'react';

/**
 * Hook for showing toast notifications
 * This is a simple implementation that can be enhanced with a toast provider
 */
export const useToast = () => {
  const showToast = useCallback((message, type = 'info') => {
    // Simple implementation using browser notification
    // In a real app, this would integrate with a toast provider/context
    console.log(`Toast [${type}]: ${message}`);
    
    // You can replace this with actual toast implementation
    // For now, we'll use a simple alert for demonstration
    if (type === 'error') {
      console.error(message);
    } else if (type === 'warning') {
      console.warn(message);
    } else {
      console.info(message);
    }
  }, []);

  return { showToast };
};