import React, { useState } from 'react';
import HighContrastToggle from './HighContrastToggle';
import { FontSizeQuickToggle } from './FontSizeAdjuster';
import { announce } from '../../utils/accessibility/announcements';

/**
 * AccessibilityToolbar - Comprehensive accessibility controls
 * Provides quick access to all accessibility features
 */
const AccessibilityToolbar = ({
  isOpen = false,
  onToggle,
  className = '',
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    if (onToggle) {
      onToggle(newState);
    }

    // Announce the state change
    announce(
      newState
        ? 'Accessibility toolbar opened. Use tab to navigate through accessibility options.'
        : 'Accessibility toolbar closed.',
      'polite'
    );
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <div
      className={`accessibility-toolbar ${positionClasses[position]} ${className}`}
      role='region'
      aria-label='Accessibility Tools'
    >
      {/* Toggle Button */}
      <button
        type='button'
        onClick={handleToggle}
        className='accessibility-toggle-btn'
        aria-expanded={isExpanded}
        aria-controls='accessibility-controls'
        aria-label='Toggle accessibility options'
        title='Accessibility Options (Alt + A)'
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
        >
          <path
            d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M21 17V15L15 15.5V17M11 15V19C11 20.1 11.9 21 13 21H15V19H13V15H11ZM7 7V9L3 9V7L7 7ZM7 15V17L3 17V15L7 15ZM16 9H18L19 12L18 15H16L15 12L16 9ZM6 12L7 9H9L8 12L9 15H7L6 12Z'
            fill='currentColor'
          />
        </svg>
        <span className={isExpanded ? 'sr-only' : ''}>Accessibility</span>
      </button>

      {/* Controls Panel */}
      {isExpanded && (
        <div
          id='accessibility-controls'
          className='accessibility-controls'
          role='group'
          aria-label='Accessibility controls'
        >
          <div className='accessibility-controls-header'>
            <h3 className='accessibility-controls-title'>
              Accessibility Options
            </h3>
            <button
              type='button'
              onClick={handleToggle}
              className='accessibility-close-btn'
              aria-label='Close accessibility options'
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  d='M18 6L6 18M6 6L18 18'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>

          <div className='accessibility-controls-content'>
            {/* High Contrast Toggle */}
            <div className='accessibility-control-group'>
              <label className='accessibility-control-label'>
                Display Mode
              </label>
              <HighContrastToggle className='accessibility-control' />
            </div>

            {/* Font Size Controls */}
            <div className='accessibility-control-group'>
              <label className='accessibility-control-label'>Text Size</label>
              <FontSizeQuickToggle className='accessibility-control' />
            </div>

            {/* Keyboard Navigation Help */}
            <div className='accessibility-control-group'>
              <button
                type='button'
                className='accessibility-help-btn'
                onClick={() => {
                  announce(
                    'Keyboard shortcuts: Tab to navigate, Enter or Space to activate, Escape to close dialogs, Arrow keys for menus.'
                  );
                }}
                aria-label='Announce keyboard shortcuts'
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                >
                  <path
                    d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 17.25h.007v.008H12v-.008z'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                Keyboard Help
              </button>
            </div>

            {/* Reset Button */}
            <div className='accessibility-control-group'>
              <button
                type='button'
                className='accessibility-reset-btn'
                onClick={() => {
                  // Reset all accessibility preferences
                  localStorage.removeItem('high-contrast-mode');
                  localStorage.removeItem('font-size-preference');
                  document.documentElement.classList.remove('high-contrast');
                  document.documentElement.className =
                    document.documentElement.className.replace(
                      /font-size-\w+/g,
                      ''
                    );
                  document.documentElement.style.removeProperty('--font-scale');

                  announce(
                    'All accessibility settings have been reset to default.'
                  );
                }}
                aria-label='Reset all accessibility settings to default'
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityToolbar;
