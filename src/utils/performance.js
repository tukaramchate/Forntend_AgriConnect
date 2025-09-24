// Performance monitoring and optimization utilities

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Send metrics to analytics service
      console.log(`${entry.name}: ${entry.value}`);
      
      // You can send to Google Analytics, DataDog, etc.
      if (window.gtag) {
        window.gtag('event', entry.name, {
          value: Math.round(entry.name === 'CLS' ? entry.value * 1000 : entry.value),
          event_category: 'Web Vitals',
          event_label: entry.id,
          non_interaction: true,
        });
      }
    }
  });

  // Observe Core Web Vitals
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (e) {
    console.warn('Performance Observer not supported:', e);
  }
};

// Performance marks for custom metrics
export const performanceMark = (name) => {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(name);
  }
};

export const performanceMeasure = (name, startMark, endMark) => {
  if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measure = window.performance.getEntriesByName(name, 'measure')[0];
      console.log(`${name}: ${measure.duration}ms`);
      return measure.duration;
    } catch (e) {
      console.warn('Performance measure failed:', e);
    }
  }
  return 0;
};

// Resource loading performance
export const trackResourceLoading = () => {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 1000) { // Log slow resources (>1s)
        console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['resource'] });
  } catch (e) {
    console.warn('Resource Performance Observer not supported:', e);
  }
};

// Memory usage tracking
export const trackMemoryUsage = () => {
  if (typeof window === 'undefined' || !window.performance.memory) return;

  const memory = window.performance.memory;
  const memoryInfo = {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  };

  console.log('Memory usage:', memoryInfo);
  return memoryInfo;
};

// Bundle loading performance
export const trackBundlePerformance = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const navigationEntry = window.performance.getEntriesByType('navigation')[0];
    
    const timing = {
      dns: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
      connection: navigationEntry.connectEnd - navigationEntry.connectStart,
      response: navigationEntry.responseEnd - navigationEntry.responseStart,
      dom: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
      load: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
      total: navigationEntry.loadEventEnd - navigationEntry.navigationStart,
    };

    console.log('Page load timing:', timing);
    
    // Track bundle sizes from resource timing
    const resources = window.performance.getEntriesByType('resource');
    const jsResources = resources.filter(resource => resource.name.includes('.js'));
    const cssResources = resources.filter(resource => resource.name.includes('.css'));
    
    const bundleInfo = {
      jsCount: jsResources.length,
      cssCount: cssResources.length,
      totalTransferSize: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      jsTransferSize: jsResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      cssTransferSize: cssResources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
    };

    console.log('Bundle info:', bundleInfo);
    return { timing, bundleInfo };
  });
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    // Fallback for environments without IntersectionObserver
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    };
  }

  return new IntersectionObserver(callback, defaultOptions);
};

// Debounce function for performance optimization
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Preload critical resources
export const preloadResource = (href, as = 'script', crossorigin = null) => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  
  document.head.appendChild(link);
};

// Prefetch non-critical resources
export const prefetchResource = (href) => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
};

// Initialize all performance tracking
export const initPerformanceMonitoring = () => {
  trackWebVitals();
  trackResourceLoading();
  trackBundlePerformance();
  
  // Track memory usage every 30 seconds in development
  if (import.meta.env.DEV) {
    setInterval(trackMemoryUsage, 30000);
  }
};

export default {
  trackWebVitals,
  performanceMark,
  performanceMeasure,
  trackResourceLoading,
  trackMemoryUsage,
  trackBundlePerformance,
  createLazyLoadObserver,
  debounce,
  throttle,
  preloadResource,
  prefetchResource,
  initPerformanceMonitoring
};