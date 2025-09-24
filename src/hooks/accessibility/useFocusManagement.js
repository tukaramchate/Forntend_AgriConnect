import { useRef, useEffect, useCallback } from 'react';

/**
 * useFocusManagement - Comprehensive focus management utilities
 * Essential for WCAG 2.1 compliance
 */
export const useFocusManagement = () => {
  const lastFocusedElement = useRef(null);

  // Store the currently focused element
  const storeFocus = useCallback(() => {
    lastFocusedElement.current = document.activeElement;
  }, []);

  // Restore focus to the previously focused element
  const restoreFocus = useCallback(() => {
    if (lastFocusedElement.current && typeof lastFocusedElement.current.focus === 'function') {
      lastFocusedElement.current.focus();
    }
  }, []);

  // Focus the first focusable element in a container
  const focusFirst = useCallback((container) => {
    if (!container) return false;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return true;
    }
    return false;
  }, []);

  // Focus the last focusable element in a container
  const focusLast = useCallback((container) => {
    if (!container) return false;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    );

    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
      return true;
    }
    return false;
  }, []);

  // Get all focusable elements in a container
  const getFocusableElements = useCallback((container) => {
    if (!container) return [];

    return Array.from(container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    )).filter(element => {
      // Filter out disabled and hidden elements
      return !element.disabled && 
             element.offsetParent !== null && 
             window.getComputedStyle(element).visibility !== 'hidden';
    });
  }, []);

  // Move focus to next/previous focusable element
  const moveFocus = useCallback((direction = 'next', container = document) => {
    const focusableElements = getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(document.activeElement);

    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusableElements.length) {
        nextIndex = 0; // Loop to first
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = focusableElements.length - 1; // Loop to last
      }
    }

    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus();
      return true;
    }
    return false;
  }, [getFocusableElements]);

  return {
    storeFocus,
    restoreFocus,
    focusFirst,
    focusLast,
    getFocusableElements,
    moveFocus
  };
};

/**
 * useFocusVisible - Manages focus-visible styles for keyboard users
 */
export const useFocusVisible = () => {
  useEffect(() => {
    let hadKeyboardEvent = true;

    const keyboardThrottleTimeout = {
      current: null
    };

    const detectKeyboard = (e) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }

      switch (e.type) {
        case 'keydown':
          if (keyboardThrottleTimeout.current) {
            clearTimeout(keyboardThrottleTimeout.current);
          }
          hadKeyboardEvent = true;
          break;

        case 'mousedown':
        case 'pointerdown':
        case 'touchstart':
          hadKeyboardEvent = false;
          keyboardThrottleTimeout.current = setTimeout(() => {
            hadKeyboardEvent = true;
          }, 1000);
          break;
      }
    };

    const onFocus = (e) => {
      if (hadKeyboardEvent || e.target.matches(':focus-visible')) {
        e.target.classList.add('focus-visible');
      }
    };

    const onBlur = (e) => {
      e.target.classList.remove('focus-visible');
    };

    document.addEventListener('keydown', detectKeyboard, true);
    document.addEventListener('mousedown', detectKeyboard, true);
    document.addEventListener('pointerdown', detectKeyboard, true);
    document.addEventListener('touchstart', detectKeyboard, true);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);

    return () => {
      document.removeEventListener('keydown', detectKeyboard, true);
      document.removeEventListener('mousedown', detectKeyboard, true);
      document.removeEventListener('pointerdown', detectKeyboard, true);
      document.removeEventListener('touchstart', detectKeyboard, true);
      document.removeEventListener('focus', onFocus, true);
      document.removeEventListener('blur', onBlur, true);
    };
  }, []);
};