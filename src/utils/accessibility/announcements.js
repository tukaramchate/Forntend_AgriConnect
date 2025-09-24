/**
 * announce - Utility function to programmatically announce messages to screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - 'polite' | 'assertive' | 'off'
 */
export const announce = (message, politeness = 'polite') => {
  const region = document.createElement('div');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  region.textContent = message;
  
  document.body.appendChild(region);
  
  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(region)) {
      document.body.removeChild(region);
    }
  }, 1000);
};

/**
 * announceToast - Announce toast messages
 */
export const announceToast = (message, type = 'info') => {
  const typePrefix = {
    success: 'Success: ',
    error: 'Error: ',
    warning: 'Warning: ',
    info: 'Info: '
  };
  
  announce(`${typePrefix[type] || ''}${message}`, type === 'error' ? 'assertive' : 'polite');
};

/**
 * announceRouteChange - Announce route/page changes
 */
export const announceRouteChange = (pageName) => {
  announce(`Navigated to ${pageName}`, 'polite');
};