import axios from 'axios';
import Cookies from 'js-cookie';
import { generateRandomString, RateLimiter } from '@utils/security';

// Create rate limiter instance
const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
};

// Create axios instance
const api = axios.create(API_CONFIG);

// CSRF Token management
let csrfToken = Cookies.get('csrf-token');

const generateCSRFToken = () => {
  const token = generateRandomString(32);
  Cookies.set('csrf-token', token, {
    secure: import.meta.env.VITE_SECURE_COOKIES === 'true',
    sameSite: 'strict',
    expires: 1, // 1 day
  });
  csrfToken = token;
  return token;
};

// Request interceptor for authentication and security
api.interceptors.request.use(
  (config) => {
    // Rate limiting check
    const clientId = Cookies.get('client-id') || 'anonymous';
    if (!rateLimiter.isAllowed(clientId)) {
      return Promise.reject(
        new Error('Rate limit exceeded. Please try again later.')
      );
    }

    // Add authentication token
    const token =
      Cookies.get('auth-token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing requests
    if (
      ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())
    ) {
      if (!csrfToken) {
        generateCSRFToken();
      }
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    config.headers['X-Content-Type-Options'] = 'nosniff';

    // Log request in development
    if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    const { response } = error;

    // Handle network errors
    if (!response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        type: 'NETWORK_ERROR',
        message:
          'Network connection failed. Please check your internet connection.',
        originalError: error,
      });
    }

    // Handle HTTP errors
    const { status, data } = response;

    switch (status) {
      case 401:
        // Unauthorized - clear auth data and redirect to login
        Cookies.remove('auth-token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Redirect to login if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }

        return Promise.reject({
          type: 'UNAUTHORIZED',
          message: 'Your session has expired. Please log in again.',
          status,
        });

      case 403:
        return Promise.reject({
          type: 'FORBIDDEN',
          message: 'You do not have permission to perform this action.',
          status,
        });

      case 404:
        return Promise.reject({
          type: 'NOT_FOUND',
          message: 'The requested resource was not found.',
          status,
        });

      case 422:
        return Promise.reject({
          type: 'VALIDATION_ERROR',
          message: 'Validation failed. Please check your input.',
          errors: data?.errors || {},
          status,
        });

      case 429:
        return Promise.reject({
          type: 'RATE_LIMIT',
          message: 'Too many requests. Please try again later.',
          status,
        });

      case 500:
        return Promise.reject({
          type: 'SERVER_ERROR',
          message: 'Internal server error. Please try again later.',
          status,
        });

      default:
        return Promise.reject({
          type: 'HTTP_ERROR',
          message: data?.message || 'An unexpected error occurred.',
          status,
          originalError: error,
        });
    }
  }
);

// API Methods
export const apiMethods = {
  // GET request
  get: (url, params = {}, config = {}) => {
    return api.get(url, { params, ...config });
  },

  // POST request
  post: (url, data = {}, config = {}) => {
    return api.post(url, data, config);
  },

  // PUT request
  put: (url, data = {}, config = {}) => {
    return api.put(url, data, config);
  },

  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return api.patch(url, data, config);
  },

  // DELETE request
  delete: (url, config = {}) => {
    return api.delete(url, config);
  },

  // Upload file
  upload: (url, formData, onProgress = null) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        : undefined,
    });
  },

  // Download file
  download: (url, filename, config = {}) => {
    return api
      .get(url, {
        responseType: 'blob',
        ...config,
      })
      .then((response) => {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        return response;
      });
  },
};

// Auth utilities
export const authUtils = {
  setAuthToken: (token) => {
    Cookies.set('auth-token', token, {
      secure: import.meta.env.VITE_SECURE_COOKIES === 'true',
      sameSite: 'strict',
      expires: 7, // 7 days
    });
    localStorage.setItem('authToken', token);
  },

  getAuthToken: () => {
    return Cookies.get('auth-token') || localStorage.getItem('authToken');
  },

  clearAuthToken: () => {
    Cookies.remove('auth-token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!authUtils.getAuthToken();
  },
};

// Initialize client ID for rate limiting
if (!Cookies.get('client-id')) {
  Cookies.set('client-id', generateRandomString(16), {
    secure: import.meta.env.VITE_SECURE_COOKIES === 'true',
    sameSite: 'strict',
    expires: 365, // 1 year
  });
}

// Generate CSRF token on startup
if (!csrfToken) {
  generateCSRFToken();
}

export default api;
export { apiMethods as api };
