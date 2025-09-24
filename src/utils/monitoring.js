// Performance monitoring and analytics utilities

// Initialize performance monitoring
let isInitialized = false;
let performanceData = {
  vitals: {},
  errors: [],
  resources: [],
  navigation: {},
  custom: {}
};

// Configuration
const config = {
  enableVitals: true,
  enableResourceTiming: true,
  enableErrorTracking: true,
  enableCustomMetrics: true,
  samplingRate: 1.0, // 100% sampling by default
  endpoint: null, // Set this to send data to analytics service
  batchSize: 10,
  flushInterval: 30000 // 30 seconds
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (!config.enableVitals || typeof window === 'undefined') return;

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const metric = {
        name: entry.name,
        value: entry.value,
        rating: getRating(entry.name, entry.value),
        timestamp: Date.now(),
        id: entry.id
      };

      performanceData.vitals[entry.name] = metric;
      
      // Send real-time vital metrics
      if (config.endpoint) {
        sendMetric('vital', metric);
      }

      // Log to console in development
      if (import.meta.env.DEV) {
        console.log(`${entry.name}: ${entry.value} (${metric.rating})`);
      }
    }
  });

  // Observe different performance entry types
  try {
    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
  } catch (error) {
    console.warn('Performance Observer not supported:', error);
  }

  // CLS tracking
  trackCLS();
  
  // FID tracking
  trackFID();
  
  // LCP tracking
  trackLCP();
};

// Cumulative Layout Shift tracking
const trackCLS = () => {
  if (!('PerformanceObserver' in window)) return;

  let clsValue = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        performanceData.vitals.CLS = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          timestamp: Date.now()
        };
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    console.warn('CLS tracking not supported:', error);
  }
};

// First Input Delay tracking
const trackFID = () => {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fid = entry.processingStart - entry.startTime;
      performanceData.vitals.FID = {
        name: 'FID',
        value: fid,
        rating: getRating('FID', fid),
        timestamp: Date.now()
      };
    }
  });

  try {
    observer.observe({ entryTypes: ['first-input'] });
  } catch (error) {
    console.warn('FID tracking not supported:', error);
  }
};

// Largest Contentful Paint tracking
const trackLCP = () => {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    performanceData.vitals.LCP = {
      name: 'LCP',
      value: lastEntry.startTime,
      rating: getRating('LCP', lastEntry.startTime),
      timestamp: Date.now(),
      element: lastEntry.element?.tagName || 'unknown'
    };
  });

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (error) {
    console.warn('LCP tracking not supported:', error);
  }
};

// Resource timing tracking
export const trackResourceTiming = () => {
  if (!config.enableResourceTiming || typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const resource = {
        name: entry.name,
        type: entry.initiatorType,
        duration: entry.duration,
        size: entry.transferSize || 0,
        cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
        timestamp: Date.now()
      };

      performanceData.resources.push(resource);

      // Track slow resources
      if (entry.duration > 1000) { // Slower than 1 second
        trackCustomMetric('slow-resource', {
          url: entry.name,
          duration: entry.duration,
          type: entry.initiatorType
        });
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['resource'] });
  } catch (error) {
    console.warn('Resource timing not supported:', error);
  }
};

// Error tracking
export const trackError = (error, context = {}) => {
  if (!config.enableErrorTracking) return;

  const errorData = {
    message: error.message || 'Unknown error',
    stack: error.stack || '',
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    context,
    type: error.name || 'Error'
  };

  performanceData.errors.push(errorData);

  // Send error immediately
  if (config.endpoint) {
    sendMetric('error', errorData);
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Tracked error:', errorData);
  }
};

// Custom metrics tracking
export const trackCustomMetric = (name, value, context = {}) => {
  if (!config.enableCustomMetrics) return;

  const metric = {
    name,
    value,
    context,
    timestamp: Date.now()
  };

  if (!performanceData.custom[name]) {
    performanceData.custom[name] = [];
  }
  performanceData.custom[name].push(metric);

  // Send custom metric
  if (config.endpoint) {
    sendMetric('custom', metric);
  }
};

// User timing API wrapper
export const markStart = (name) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(`${name}-start`);
  }
};

export const markEnd = (name) => {
  if ('performance' in window && 'mark' in performance && 'measure' in performance) {
    const endMark = `${name}-end`;
    performance.mark(endMark);
    
    try {
      performance.measure(name, `${name}-start`, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      
      trackCustomMetric(`timing-${name}`, measure.duration);
      return measure.duration;
    } catch (error) {
      console.warn(`Failed to measure ${name}:`, error);
    }
  }
  return 0;
};

// Navigation timing
export const getNavigationTiming = () => {
  if (!('performance' in window) || !performance.navigation) return null;

  const timing = performance.timing;
  const navigation = performance.navigation;

  return {
    // Page load times
    domainLookup: timing.domainLookupEnd - timing.domainLookupStart,
    connect: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    domProcessing: timing.domComplete - timing.domLoading,
    
    // Total times
    pageLoad: timing.loadEventEnd - timing.navigationStart,
    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
    
    // Navigation info
    type: navigation.type,
    redirectCount: navigation.redirectCount
  };
};

// Memory usage tracking
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
      usage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
    };
  }
  return null;
};

// Device and connection info
export const getDeviceInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    // Screen info
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    
    // Connection info
    connectionType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0,
    saveData: connection?.saveData || false,
    
    // Device info
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    maxTouchPoints: navigator.maxTouchPoints || 0
  };
};

// Rating system for Web Vitals
const getRating = (metric, value) => {
  const thresholds = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 250 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 }
  };

  const threshold = thresholds[metric];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

// Send metrics to analytics endpoint
const sendMetric = async (type, data) => {
  if (!config.endpoint || Math.random() > config.samplingRate) return;

  try {
    await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        deviceInfo: getDeviceInfo()
      })
    });
  } catch (error) {
    console.warn('Failed to send metric:', error);
  }
};

// Session management
let sessionId = null;
const getSessionId = () => {
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
};

// Initialize monitoring
export const initializeMonitoring = (options = {}) => {
  if (isInitialized) return;

  // Update configuration
  Object.assign(config, options);

  // Set up global error handlers
  if (config.enableErrorTracking) {
    window.addEventListener('error', (event) => {
      trackError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      trackError(new Error(event.reason), {
        type: 'unhandledrejection'
      });
    });
  }

  // Start tracking
  trackWebVitals();
  trackResourceTiming();

  // Store navigation timing
  performanceData.navigation = getNavigationTiming();

  // Set up periodic flushing
  if (config.endpoint && config.flushInterval > 0) {
    setInterval(() => {
      flushMetrics();
    }, config.flushInterval);
  }

  isInitialized = true;
};

// Flush collected metrics
export const flushMetrics = async () => {
  if (!config.endpoint || !performanceData) return;

  const dataToSend = {
    ...performanceData,
    deviceInfo: getDeviceInfo(),
    memory: getMemoryUsage(),
    sessionId: getSessionId(),
    timestamp: Date.now()
  };

  try {
    await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });

    // Clear sent data
    performanceData = {
      vitals: performanceData.vitals, // Keep vitals
      errors: [],
      resources: [],
      navigation: performanceData.navigation, // Keep navigation
      custom: {}
    };
  } catch (error) {
    console.warn('Failed to flush metrics:', error);
  }
};

// Get current performance data
export const getPerformanceData = () => ({
  ...performanceData,
  deviceInfo: getDeviceInfo(),
  memory: getMemoryUsage(),
  sessionId: getSessionId()
});

// Performance budget checker
export const checkPerformanceBudget = (budgets = {}) => {
  const defaultBudgets = {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    resourceCount: 100,
    totalResourceSize: 2 * 1024 * 1024, // 2MB
  };

  const activeBudgets = { ...defaultBudgets, ...budgets };
  const violations = [];

  // Check Web Vitals
  Object.entries(performanceData.vitals).forEach(([metric, data]) => {
    if (activeBudgets[metric] && data.value > activeBudgets[metric]) {
      violations.push({
        type: 'vital',
        metric,
        actual: data.value,
        budget: activeBudgets[metric],
        violation: data.value - activeBudgets[metric]
      });
    }
  });

  // Check resource counts and sizes
  const resourceCount = performanceData.resources.length;
  const totalResourceSize = performanceData.resources.reduce((sum, r) => sum + r.size, 0);

  if (resourceCount > activeBudgets.resourceCount) {
    violations.push({
      type: 'resource',
      metric: 'resourceCount',
      actual: resourceCount,
      budget: activeBudgets.resourceCount,
      violation: resourceCount - activeBudgets.resourceCount
    });
  }

  if (totalResourceSize > activeBudgets.totalResourceSize) {
    violations.push({
      type: 'resource',
      metric: 'totalResourceSize',
      actual: totalResourceSize,
      budget: activeBudgets.totalResourceSize,  
      violation: totalResourceSize - activeBudgets.totalResourceSize
    });
  }

  return {
    passed: violations.length === 0,
    violations,
    summary: {
      vitals: performanceData.vitals,
      resourceCount,
      totalResourceSize
    }
  };
};

export default {
  initializeMonitoring,
  trackWebVitals,
  trackResourceTiming,
  trackError,
  trackCustomMetric,
  markStart,
  markEnd,
  getNavigationTiming,
  getMemoryUsage,
  getDeviceInfo,
  getPerformanceData,
  flushMetrics,
  checkPerformanceBudget
};