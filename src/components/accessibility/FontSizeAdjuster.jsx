import React, { useEffect, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

/**
 * FontSizeAdjuster - Allows users to adjust font size for better readability
 * WCAG 2.1 Level AA compliance feature
 */
const FontSizeAdjuster = ({ className = '', ...props }) => {
  const [fontSize, setFontSize] = useLocalStorage(
    'font-size-preference',
    'medium'
  );

  const fontSizes = useMemo(
    () => ({
      small: { label: 'Small', scale: 0.875, class: 'font-size-small' },
      medium: { label: 'Medium', scale: 1, class: 'font-size-medium' },
      large: { label: 'Large', scale: 1.125, class: 'font-size-large' },
      'extra-large': {
        label: 'Extra Large',
        scale: 1.25,
        class: 'font-size-extra-large',
      },
    }),
    []
  );

  useEffect(() => {
    const root = document.documentElement;

    // Remove all font size classes
    Object.values(fontSizes).forEach((size) => {
      root.classList.remove(size.class);
    });

    // Add current font size class
    if (fontSizes[fontSize]) {
      root.classList.add(fontSizes[fontSize].class);
      root.style.setProperty('--font-scale', fontSizes[fontSize].scale);
    }

    // Announce the change
    setTimeout(() => {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      announcer.textContent = `Font size changed to ${fontSizes[fontSize]?.label || fontSize}`;
      document.body.appendChild(announcer);

      setTimeout(() => {
        if (document.body.contains(announcer)) {
          document.body.removeChild(announcer);
        }
      }, 1000);
    }, 100);
  }, [fontSize, fontSizes]);

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };

  return (
    <div className={`font-size-adjuster ${className}`} {...props}>
      <fieldset className='font-size-fieldset'>
        <legend className='font-size-legend'>Font Size</legend>
        <div className='font-size-options'>
          {Object.entries(fontSizes).map(([key, size]) => (
            <label key={key} className='font-size-option'>
              <input
                type='radio'
                name='font-size'
                value={key}
                checked={fontSize === key}
                onChange={() => handleFontSizeChange(key)}
                className='font-size-input'
              />
              <span className='font-size-label'>{size.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

/**
 * FontSizeQuickToggle - Simple +/- buttons for font size adjustment
 */
export const FontSizeQuickToggle = ({ className = '', ...props }) => {
  const [fontSize, setFontSize] = useLocalStorage(
    'font-size-preference',
    'medium'
  );

  const sizes = ['small', 'medium', 'large', 'extra-large'];
  const currentIndex = sizes.indexOf(fontSize);

  const increaseFontSize = () => {
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1]);
    }
  };

  return (
    <div className={`font-size-quick-toggle ${className}`} {...props}>
      <button
        type='button'
        onClick={decreaseFontSize}
        disabled={currentIndex === 0}
        aria-label='Decrease font size'
        className='font-size-btn font-size-decrease'
      >
        A-
      </button>
      <span className='font-size-current sr-only'>
        Current font size: {fontSize}
      </span>
      <button
        type='button'
        onClick={increaseFontSize}
        disabled={currentIndex === sizes.length - 1}
        aria-label='Increase font size'
        className='font-size-btn font-size-increase'
      >
        A+
      </button>
    </div>
  );
};

export default FontSizeAdjuster;
