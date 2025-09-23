import DOMPurify from 'dompurify';

/**
 * Security utilities for sanitizing user inputs and preventing XSS attacks
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The dirty HTML string
 * @param {Object} options - DOMPurify options
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHtml = (dirty, options = {}) => {
  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  };

  return DOMPurify.sanitize(dirty, { ...defaultOptions, ...options });
};

/**
 * Sanitize user input for safe display
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Validate and sanitize URL to prevent open redirect attacks
 * @param {string} url - URL to validate
 * @param {Array} allowedDomains - Array of allowed domains
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url, allowedDomains = []) => {
  try {
    const urlObj = new URL(url);

    // Check if it's a relative URL (no protocol)
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }

    // Check if domain is in allowed list
    if (allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(
        (domain) =>
          urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );

      if (!isAllowed) {
        console.warn('URL not in allowed domains:', url);
        return null;
      }
    }

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.warn('Invalid URL protocol:', url);
      return null;
    }

    return urlObj.toString();
  } catch {
    console.warn('Invalid URL:', url);
    return null;
  }
};

/**
 * Generate Content Security Policy headers
 * @returns {Object} - CSP headers object
 */
export const getCSPHeaders = () => {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' " +
      (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'),
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ];

  return {
    'Content-Security-Policy': cspDirectives.join('; '),
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

/**
 * Generate a random string for CSRF tokens
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};

/**
 * Rate limiting helper for API calls
 */
export class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const userRequests = this.requests.get(key);

    // Remove old requests outside the window
    const validRequests = userRequests.filter((time) => time > windowStart);
    this.requests.set(key, validRequests);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    return true;
  }
}
