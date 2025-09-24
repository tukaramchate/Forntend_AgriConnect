import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

/**
 * HighContrastToggle - Toggle high contrast mode for better visibility
 * WCAG 2.1 Level AAA compliance feature
 */
const HighContrastToggle = ({ className = '', ...props }) => {
  const [isHighContrast, setIsHighContrast] = useLocalStorage(
    'high-contrast-mode',
    false
  );
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if CSS custom properties are supported
    setIsSupported(
      window.CSS &&
        window.CSS.supports &&
        window.CSS.supports('color', 'var(--primary)')
    );
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Announce the change
    const message = isHighContrast
      ? 'High contrast mode enabled'
      : 'High contrast mode disabled';
    setTimeout(() => {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      announcer.textContent = message;
      document.body.appendChild(announcer);

      setTimeout(() => {
        if (document.body.contains(announcer)) {
          document.body.removeChild(announcer);
        }
      }, 1000);
    }, 100);
  }, [isHighContrast]);

  const handleToggle = () => {
    setIsHighContrast(!isHighContrast);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type='button'
      onClick={handleToggle}
      className={`high-contrast-toggle ${className}`}
      aria-pressed={isHighContrast}
      aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      {...props}
    >
      <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
      >
        <circle
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='2'
          fill={isHighContrast ? 'currentColor' : 'none'}
        />
        {isHighContrast && <circle cx='12' cy='12' r='6' fill='white' />}
      </svg>
      <span className={isHighContrast ? '' : 'sr-only'}>
        {isHighContrast ? 'High Contrast' : 'Toggle High Contrast'}
      </span>
    </button>
  );
};

export default HighContrastToggle;
