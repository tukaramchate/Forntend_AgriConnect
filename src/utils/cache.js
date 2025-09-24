// Advanced caching utilities for performance optimization
import { useCallback } from 'react';

// In-memory cache with TTL and size limits
class MemoryCache {
  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache = new Map();
    this.timers = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      this.delete(firstKey);
    }

    // Clear existing timer if key exists
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set value and timer
    this.cache.set(key, value);

    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl);
      this.timers.set(key, timer);
    }

    return this;
  }

  get(key) {
    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.cache.delete(key);
  }

  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  keys() {
    return Array.from(this.cache.keys());
  }
}

// Global cache instances
export const apiCache = new MemoryCache(200, 10 * 60 * 1000); // 10 minutes for API responses
export const computeCache = new MemoryCache(100, 30 * 60 * 1000); // 30 minutes for computed values
export const imageCache = new MemoryCache(50, 60 * 60 * 1000); // 1 hour for image metadata

// Memoization decorator for functions
export const memoize = (
  fn,
  cache = computeCache,
  keyFn = (...args) => JSON.stringify(args)
) => {
  return function memoized(...args) {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Enhanced memoization with options
export const memoizeWithOptions = (fn, options = {}) => {
  const {
    cache = computeCache,
    ttl,
    maxSize,
    keyFn = (...args) => JSON.stringify(args),
    onCacheHit,
    onCacheMiss,
  } = options;

  // Create dedicated cache if custom options provided
  const memoCache =
    maxSize || ttl
      ? new MemoryCache(maxSize || 100, ttl || 5 * 60 * 1000)
      : cache;

  return function memoized(...args) {
    const key = keyFn(...args);

    if (memoCache.has(key)) {
      onCacheHit?.(key, args);
      return memoCache.get(key);
    }

    onCacheMiss?.(key, args);
    const result = fn.apply(this, args);
    memoCache.set(key, result);
    return result;
  };
};

// localStorage cache with expiration
export const localStorageCache = {
  set(key, value, ttl = 24 * 60 * 60 * 1000) {
    // 24 hours default
    try {
      const item = {
        value,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error);
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove localStorage cache:', error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  },

  // Get all cached keys
  keys() {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.warn('Failed to get localStorage keys:', error);
      return [];
    }
  },

  // Clean expired items
  cleanup() {
    try {
      const keys = this.keys();
      keys.forEach((key) => {
        this.get(key); // This will remove expired items
      });
    } catch (error) {
      console.warn('Failed to cleanup localStorage cache:', error);
    }
  },
};

// Session storage cache (similar to localStorage but session-scoped)
export const sessionStorageCache = {
  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to set sessionStorage cache:', error);
    }
  },

  get(key) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to get sessionStorage cache:', error);
      return null;
    }
  },

  remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove sessionStorage cache:', error);
    }
  },

  clear() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear sessionStorage cache:', error);
    }
  },
};

// Cache for API requests with deduplication
export const createApiCache = (baseURL = '') => {
  const cache = new MemoryCache(500, 10 * 60 * 1000); // 500 entries, 10 minutes
  const pendingRequests = new Map();

  return {
    async get(url, options = {}) {
      const cacheKey = `${baseURL}${url}:${JSON.stringify(options)}`;

      // Return cached response if available
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      // Return pending request if already in flight
      if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey);
      }

      // Make new request
      const request = fetch(`${baseURL}${url}`, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          cache.set(cacheKey, data);
          pendingRequests.delete(cacheKey);
          return data;
        })
        .catch((error) => {
          pendingRequests.delete(cacheKey);
          throw error;
        });

      pendingRequests.set(cacheKey, request);
      return request;
    },

    invalidate(pattern) {
      if (typeof pattern === 'string') {
        cache.delete(pattern);
      } else if (pattern instanceof RegExp) {
        cache.keys().forEach((key) => {
          if (pattern.test(key)) {
            cache.delete(key);
          }
        });
      }
    },

    clear() {
      cache.clear();
      pendingRequests.clear();
    },
  };
};

// React hook for cached computations
export const useMemoizedCallback = (callback, deps = [], options = {}) => {
  const { ttl, maxSize, keyFn } = options;

  const memoizedCallback = useCallback(() => {
    const memoized = memoizeWithOptions(callback, {
      ttl,
      maxSize,
      keyFn,
      cache: new MemoryCache(maxSize || 10, ttl || 5 * 60 * 1000),
    });
    return memoized;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ttl, maxSize, keyFn, ...deps]);

  return memoizedCallback;
};

// Batch cache operations
export const batchCache = {
  async setMultiple(items, cache = apiCache) {
    const promises = items.map(({ key, value, ttl }) =>
      Promise.resolve(cache.set(key, value, ttl))
    );
    return Promise.all(promises);
  },

  async getMultiple(keys, cache = apiCache) {
    return keys.map((key) => ({
      key,
      value: cache.get(key),
      hit: cache.has(key),
    }));
  },

  async deleteMultiple(keys, cache = apiCache) {
    return keys.map((key) => cache.delete(key));
  },
};

// Cache statistics and monitoring
export const cacheStats = {
  getStats(cache) {
    return {
      size: cache.size(),
      maxSize: cache.maxSize,
      keys: cache.keys(),
      memoryUsage: this.estimateMemoryUsage(cache),
    };
  },

  estimateMemoryUsage(cache) {
    let size = 0;
    for (const [key, value] of cache.cache.entries()) {
      size += JSON.stringify(key).length;
      size += JSON.stringify(value).length;
    }
    return size;
  },

  getAllStats() {
    return {
      apiCache: this.getStats(apiCache),
      computeCache: this.getStats(computeCache),
      imageCache: this.getStats(imageCache),
    };
  },
};

export default {
  MemoryCache,
  apiCache,
  computeCache,
  imageCache,
  memoize,
  memoizeWithOptions,
  localStorageCache,
  sessionStorageCache,
  createApiCache,
  batchCache,
  cacheStats,
};
