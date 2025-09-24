import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import LocalizedLayout from './components/LocalizedLayout';
import store from '@/store/store';
import { queryClient } from '@utils/queryClient';
import AppErrorBoundary from '@components/ErrorBoundary';

// Import performance utilities
import { initializeMonitoring } from '@utils/monitoring';
import { withPerformanceMonitoring } from '@components/PerformanceHOC';
import { seoData, metaManager } from '@utils/seo';

// Import CSS
// Using Tailwind classes only; removed component CSS imports

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { OnboardingProvider } from './contexts/onboarding/OnboardingContext';

// Import accessibility wrapper
import { AccessibilityWrapper } from './components/accessibility';

// Import feedback and error handling components
import { ToastContainer } from '@components/feedback/FeedbackSystem';
import { ErrorNotificationContainer } from '@components/errors/ErrorNotification';
import '@components/feedback/FeedbackSystem.css';
import '@components/errors/ErrorNotification.css';

function App() {
  // Initialize performance monitoring on app start
  useEffect(() => {
    // Initialize monitoring with configuration
    initializeMonitoring({
      enableVitals: true,
      enableResourceTiming: true,
      enableErrorTracking: true,
      enableCustomMetrics: true,
      endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
      samplingRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% sampling in production
    });

    // Set default SEO data
    metaManager.setSEOData(seoData.home);

    // Register service worker
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <AppErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <OnboardingProvider>
                <NotificationProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <AccessibilityWrapper>
                        <LocalizedLayout>
                          <AppRouter />

                          {/* Global feedback and error handling containers */}
                          <ToastContainer position='top-right' />
                          <ErrorNotificationContainer />
                        </LocalizedLayout>
                      </AccessibilityWrapper>
                    </WishlistProvider>
                  </CartProvider>
                </NotificationProvider>
              </OnboardingProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </AppErrorBoundary>
  );
}

// Apply performance monitoring to the App component
const EnhancedApp = withPerformanceMonitoring(App, {
  componentName: 'App',
  trackMount: true,
  trackRender: true,
  trackUnmount: false, // App rarely unmounts
});

EnhancedApp.displayName = 'EnhancedApp';
export default EnhancedApp;
