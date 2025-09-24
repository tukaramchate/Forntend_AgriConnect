/**
 * Accessibility utility functions for WCAG 2.1 compliance
 */

/**
 * generateId - Generates unique IDs for form elements and ARIA relationships
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * getContrastRatio - Calculates contrast ratio between two colors
 * @param {string} color1 - First color (hex, rgb, or hsl)
 * @param {string} color2 - Second color (hex, rgb, or hsl)
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    // Convert color to RGB values
    let r, g, b;
    
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      r = parseInt(hex.substr(0, 2), 16) / 255;
      g = parseInt(hex.substr(2, 2), 16) / 255;
      b = parseInt(hex.substr(4, 2), 16) / 255;
    } else if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      r = parseInt(values[0]) / 255;
      g = parseInt(values[1]) / 255;
      b = parseInt(values[2]) / 255;
    } else {
      return 0;
    }

    // Calculate relative luminance
    const toLinear = (val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * meetsContrastRequirement - Checks if color combination meets WCAG contrast requirements
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 * @param {string} level - WCAG level ('AA' or 'AAA')
 * @param {string} textSize - Text size ('normal' or 'large')
 * @returns {boolean} Whether contrast requirement is met
 */
export const meetsContrastRequirement = (foreground, background, level = 'AA', textSize = 'normal') => {
  const contrast = getContrastRatio(foreground, background);
  
  const requirements = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };

  return contrast >= requirements[level][textSize];
};

/**
 * sanitizeAriaLabel - Sanitizes text for use in aria-label attributes
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeAriaLabel = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * formatScreenReaderText - Formats text for optimal screen reader pronunciation
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export const formatScreenReaderText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/\$(\d+(?:\.\d{2})?)/g, '$1 dollars') // Format currency
    .replace(/(\d+)%/g, '$1 percent') // Format percentages
    .replace(/(\d{1,2}):(\d{2})/g, '$1 $2') // Format time (avoid colon pronunciation)
    .replace(/([A-Z]{2,})/g, (match) => match.split('').join(' ')) // Spell out abbreviations
    .replace(/\b(\d+)\b/g, (match) => {
      // Format large numbers
      const num = parseInt(match);
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)} million`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)} thousand`;
      }
      return match;
    });
};

/**
 * createAriaDescribedBy - Creates describedby relationships for form elements
 * @param {string} baseId - Base ID for the element
 * @param {Array} descriptions - Array of description types
 * @returns {Object} Object with IDs and describedby string
 */
export const createAriaDescribedBy = (baseId, descriptions = []) => {
  const ids = {};
  const describedByIds = [];

  descriptions.forEach(desc => {
    const id = `${baseId}-${desc}`;
    ids[desc] = id;
    describedByIds.push(id);
  });

  return {
    ids,
    describedBy: describedByIds.join(' ')
  };
};

/**
 * isElementInViewport - Checks if element is visible in viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} Whether element is visible
 */
export const isElementInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * scrollToElement - Smoothly scrolls to element with accessibility considerations
 * @param {Element} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
export const scrollToElement = (element, options = {}) => {
  if (!element) return;

  const {
    block = 'center',
    behavior = 'smooth',
    focus = true,
    announce = true
  } = options;

  element.scrollIntoView({ behavior, block });

  if (focus && typeof element.focus === 'function') {
    // Small delay to ensure scroll completes
    setTimeout(() => {
      element.focus();
    }, 100);
  }

  if (announce) {
    const elementName = element.getAttribute('aria-label') || 
                       element.textContent?.trim() || 
                       element.tagName.toLowerCase();
    
    setTimeout(() => {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      announcer.textContent = `Scrolled to ${elementName}`;
      document.body.appendChild(announcer);
      
      setTimeout(() => {
        if (document.body.contains(announcer)) {
          document.body.removeChild(announcer);
        }
      }, 1000);
    }, 200);
  }
};