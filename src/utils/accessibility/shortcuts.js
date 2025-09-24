/**
 * Accessibility keyboard shortcuts setup
 */

/**
 * setupAccessibilityShortcuts - Sets up global keyboard shortcuts for accessibility features
 * @returns {Function} Cleanup function to remove event listeners
 */
export const setupAccessibilityShortcuts = () => {
  const handleKeyDown = (e) => {
    // Alt + A opens accessibility toolbar
    if (e.altKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      const toolbar = document.querySelector('.accessibility-toggle-btn');
      if (toolbar) {
        toolbar.click();
        toolbar.focus();
      }
    }

    // Alt + C toggles high contrast
    if (e.altKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const contrastToggle = document.querySelector('.high-contrast-toggle');
      if (contrastToggle) {
        contrastToggle.click();
      }
    }

    // Alt + + increases font size
    if (e.altKey && e.key === '+') {
      e.preventDefault();
      const increaseBtn = document.querySelector('.font-size-increase');
      if (increaseBtn && !increaseBtn.disabled) {
        increaseBtn.click();
      }
    }

    // Alt + - decreases font size
    if (e.altKey && e.key === '-') {
      e.preventDefault();
      const decreaseBtn = document.querySelector('.font-size-decrease');
      if (decreaseBtn && !decreaseBtn.disabled) {
        decreaseBtn.click();
      }
    }

    // Escape key closes any open accessibility panels
    if (e.key === 'Escape') {
      const openToolbar = document.querySelector(
        '.accessibility-toolbar [aria-expanded="true"]'
      );
      if (openToolbar) {
        openToolbar.click();
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};
