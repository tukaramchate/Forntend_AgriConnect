import React, { useEffect, useRef } from 'react';

/**
 * FocusTrap - Traps focus within a container for modals and dialogs
 * Essential for keyboard navigation in overlays
 */
const FocusTrap = ({
  children,
  isActive = true,
  restoreFocus = true,
  className = '',
  ...props
}) => {
  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
      );
    };

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus the first focusable element when trap activates
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Restore focus to the previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, restoreFocus]);

  if (!isActive) {
    return children;
  }

  return (
    <div ref={containerRef} className={`focus-trap ${className}`} {...props}>
      {children}
    </div>
  );
};

export default FocusTrap;
