import { useEffect, useRef } from 'react';

/**
 * useKeyboardNavigation - Enhanced keyboard navigation hook
 * Provides comprehensive keyboard support for interactive elements
 */
export const useKeyboardNavigation = (isActive = true) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const handleKeyDown = (e) => {
      const { key, target, ctrlKey, altKey, shiftKey } = e;

      // Skip if typing in input fields
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      switch (key) {
        case 'Home':
          if (ctrlKey) {
            e.preventDefault();
            // Go to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const firstFocusable = container.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
          }
          break;

        case 'End':
          if (ctrlKey) {
            e.preventDefault();
            // Go to bottom of page
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
          break;

        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight': {
          // Handle arrow key navigation for custom components
          const event = new CustomEvent('keyboardNavigate', {
            detail: { key, target, ctrlKey, altKey, shiftKey }
          });
          target.dispatchEvent(event);
          break;
        }

        case 'Escape': {
          // Close any open modals, dropdowns, etc.
          const escapeEvent = new CustomEvent('escapeKey', {
            detail: { target }
          });
          container.dispatchEvent(escapeEvent);
          break;
        }

        case '?': {
          if (shiftKey) {
            // Show keyboard shortcuts help
            const helpEvent = new CustomEvent('showKeyboardHelp');
            container.dispatchEvent(helpEvent);
          }
          break;
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
};

/**
 * useAriaLive - Manages aria-live regions for dynamic content announcements
 */
export const useAriaLive = (politeness = 'polite') => {
  const announce = (message) => {
    if (!message) return;

    const region = document.createElement('div');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.textContent = message;
    
    document.body.appendChild(region);
    
    setTimeout(() => {
      if (document.body.contains(region)) {
        document.body.removeChild(region);
      }
    }, 1000);
  };

  return { announce };
};