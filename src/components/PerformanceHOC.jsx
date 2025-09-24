// Higher-Order Component for performance monitoring integration
import React, { useEffect, useRef } from 'react';
import { initializeMonitoring, trackCustomMetric, markStart, markEnd } from '../utils/monitoring';
import { metaManager } from '../utils/seo';

// HOC to add performance monitoring to components
export const withPerformanceMonitoring = (WrappedComponent, options = {}) => {
  const {
    componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component',
    trackRender = true,
    trackMount = true,
    trackUnmount = true,
    seoData = null
  } = options;

  const MonitoredComponent = (props) => {
    const mountTime = useRef(null);
    const renderCount = useRef(0);

    useEffect(() => {
      // Initialize monitoring on first mount
      if (!window.__AGRICONNECT_MONITORING_INITIALIZED__) {
        initializeMonitoring({
          enableVitals: true,
          enableResourceTiming: true,
          enableErrorTracking: true,
          enableCustomMetrics: true,
          endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT
        });
        window.__AGRICONNECT_MONITORING_INITIALIZED__ = true;
      }

      if (trackMount) {
        mountTime.current = performance.now();
        markStart(`${componentName}-mount`);
        
        // Track component mount
        trackCustomMetric(`component-mount`, componentName, {
          timestamp: Date.now(),
          url: window.location.pathname
        });
      }

      // Set SEO data if provided
      if (seoData) {
        metaManager.setSEOData(seoData);
      }

      return () => {
        if (trackUnmount) {
          const unmountTime = performance.now();
          const mountDuration = mountTime.current ? unmountTime - mountTime.current : 0;
          
          markEnd(`${componentName}-mount`);
          
          // Track component unmount and lifetime
          trackCustomMetric(`component-unmount`, componentName, {
            lifetime: mountDuration,
            renderCount: renderCount.current,
            timestamp: Date.now()
          });
        }
      };
    }, []);

    useEffect(() => {
      if (trackRender) {
        renderCount.current += 1;
        
        // Track render performance
        const renderStart = performance.now();
        
        // Use requestAnimationFrame to measure actual render time
        requestAnimationFrame(() => {
          const renderEnd = performance.now();
          const renderTime = renderEnd - renderStart;
          
          trackCustomMetric(`component-render`, componentName, {
            renderTime,
            renderCount: renderCount.current,
            timestamp: Date.now(),
            url: window.location.pathname
          });
        });
      }
    });

    return <WrappedComponent {...props} />;
  };

  MonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  MonitoredComponent.WrappedComponent = WrappedComponent;

  return MonitoredComponent;
};

// HOC to add error boundary with performance tracking
export const withErrorBoundary = (WrappedComponent, options = {}) => {
  const {
    fallback: FallbackComponent,
    onError,
    trackErrors = true
  } = options;

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      if (trackErrors) {
        // Import tracking function dynamically to avoid circular dependencies
        import('../utils/monitoring').then(({ trackError }) => {
          trackError(error, {
            component: WrappedComponent.displayName || WrappedComponent.name,
            errorInfo,
            props: this.props,
            url: window.location.href
          });
        });
      }

      this.setState({ errorInfo });
      
      if (onError) {
        onError(error, errorInfo);
      }

      console.error('Component Error Boundary caught an error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        if (FallbackComponent) {
          return <FallbackComponent error={this.state.error} errorInfo={this.state.errorInfo} />;
        }
        
        return (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something went wrong. Please try refreshing the page.</p>
            {import.meta.env.DEV && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                <summary>Error Details (Development Only)</summary>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  ErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ErrorBoundary;
};

// HOC to add lazy loading with performance tracking
export const withLazyLoading = (importFunc, options = {}) => {
  const {
    loading: LoadingComponent,
    error: ErrorComponent,
    trackLoading = true
  } = options;

  const LazyComponent = React.lazy(async () => {
    if (trackLoading) {
      markStart('lazy-component-load');
    }

    try {
      const component = await importFunc();
      
      if (trackLoading) {
        const loadTime = markEnd('lazy-component-load');
        
        // Import tracking function dynamically
        import('../utils/monitoring').then(({ trackCustomMetric }) => {
          trackCustomMetric('lazy-component-load', component.default?.displayName || 'Unknown', {
            loadTime,
            timestamp: Date.now(),
            url: window.location.pathname
          });
        });
      }
      
      return component;
    } catch (error) {
      if (trackLoading) {
        import('../utils/monitoring').then(({ trackError }) => {
          trackError(error, {
            type: 'lazy-loading-error',
            timestamp: Date.now(),
            url: window.location.pathname
          });
        });
      }
      throw error;
    }
  });

  const SuspenseWrapper = (props) => (
    <React.Suspense
      fallback={LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>}
    >
      <LazyComponent {...props} />
    </React.Suspense>
  );

  return SuspenseWrapper;
};

// HOC to add image optimization with performance tracking
export const withImageOptimization = (WrappedComponent) => {
  const OptimizedComponent = (props) => {
    const imageRef = useRef(null);

    useEffect(() => {
      const img = imageRef.current;
      if (!img) return;

      const startTime = performance.now();
      
      const handleLoad = () => {
        const loadTime = performance.now() - startTime;
        
        import('../utils/monitoring').then(({ trackCustomMetric }) => {
          trackCustomMetric('image-load', img.src, {
            loadTime,
            width: img.naturalWidth,
            height: img.naturalHeight,
            timestamp: Date.now()
          });
        });
      };

      const handleError = () => {
        import('../utils/monitoring').then(({ trackError }) => {
          trackError(new Error(`Image load failed: ${img.src}`), {
            type: 'image-load-error',
            src: img.src,
            timestamp: Date.now()
          });
        });
      };

      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }, []);

    return <WrappedComponent {...props} ref={imageRef} />;
  };

  OptimizedComponent.displayName = `withImageOptimization(${WrappedComponent.displayName || WrappedComponent.name})`;
  return OptimizedComponent;
};

// Utility to create a performance-monitored route component
export const createMonitoredRoute = (Component, routeOptions = {}) => {
  const {
    routeName,
    seoData = null,
    preloadData = null,
    trackPageView = true
  } = routeOptions;

  const MonitoredRoute = (props) => {
    useEffect(() => {
      if (trackPageView) {
        import('../utils/monitoring').then(({ trackCustomMetric }) => {
          trackCustomMetric('page-view', routeName || window.location.pathname, {
            timestamp: Date.now(),
            referrer: document.referrer,
            userAgent: navigator.userAgent
          });
        });
      }

      // Preload data if specified
      if (preloadData && typeof preloadData === 'function') {
        preloadData().catch(error => {
          import('../utils/monitoring').then(({ trackError }) => {
            trackError(error, {
              type: 'data-preload-error',
              route: routeName || window.location.pathname,
              timestamp: Date.now()
            });
          });
        });
      }
    }, []);

    return <Component {...props} />;
  };

  // Apply performance monitoring and error boundary
  const EnhancedRoute = withErrorBoundary(
    withPerformanceMonitoring(MonitoredRoute, {
      componentName: routeName || 'Route',
      seoData
    })
  );

  return EnhancedRoute;
};

// Hook for manual performance tracking
export const usePerformanceTracking = () => {
  const trackEvent = (eventName, data = {}) => {
    import('../utils/monitoring').then(({ trackCustomMetric }) => {
      trackCustomMetric(eventName, data.value || eventName, {
        ...data,
        timestamp: Date.now(),
        url: window.location.pathname
      });
    });
  };

  const trackError = (error, context = {}) => {
    import('../utils/monitoring').then(({ trackError: trackErrorFunc }) => {
      trackErrorFunc(error, {
        ...context,
        timestamp: Date.now(),
        url: window.location.pathname
      });
    });
  };

  const measurePerformance = (name, fn) => {
    markStart(name);
    
    try {
      const result = fn();
      
      if (result && typeof result.then === 'function') {
        // Handle async functions
        return result.finally(() => {
          const duration = markEnd(name);
          trackEvent(`performance-${name}`, { duration });
        });
      } else {
        // Handle sync functions
        const duration = markEnd(name);
        trackEvent(`performance-${name}`, { duration });
        return result;
      }
    } catch (error) {
      const duration = markEnd(name);
      trackError(error, { 
        operation: name,
        duration,
        type: 'performance-measurement-error'
      });
      throw error;
    }
  };

  return {
    trackEvent,
    trackError,
    measurePerformance
  };
};

export default {
  withPerformanceMonitoring,
  withErrorBoundary,
  withLazyLoading,
  withImageOptimization,
  createMonitoredRoute,
  usePerformanceTracking
};