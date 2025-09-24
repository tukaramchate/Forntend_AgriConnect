import React, { useEffect } from 'react';
import { SkipLink, AccessibilityToolbar } from './index';
import { setupAccessibilityShortcuts } from '../../utils/accessibility/shortcuts';
import { useFocusVisible } from '../../hooks/accessibility/useFocusManagement';

/**
 * AccessibilityWrapper - Provides comprehensive accessibility features for the app
 * Includes skip links, accessibility toolbar, keyboard shortcuts, and focus management
 */
const AccessibilityWrapper = ({ children }) => {
  // Enable focus-visible styles for keyboard users
  useFocusVisible();

  useEffect(() => {
    // Setup global keyboard shortcuts
    const cleanup = setupAccessibilityShortcuts();

    // Announce page loads for screen readers
    const announcePageLoad = () => {
      setTimeout(() => {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent =
          'AgriConnect application loaded. Use Alt+A for accessibility options.';
        document.body.appendChild(announcer);

        setTimeout(() => {
          if (document.body.contains(announcer)) {
            document.body.removeChild(announcer);
          }
        }, 2000);
      }, 1000);
    };

    announcePageLoad();

    return cleanup;
  }, []);

  return (
    <>
      {/* Skip Link for keyboard users */}
      <SkipLink targetId='main-content' />

      {/* Main content wrapper */}
      <div id='main-content' tabIndex='-1'>
        {children}
      </div>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar position='bottom-right' />
    </>
  );
};

export default AccessibilityWrapper;
