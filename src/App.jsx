import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import LocalizedLayout from './components/layout/LocalizedLayout';
import store from '@/store/store';
import { queryClient } from '@utils/queryClient';
import AppErrorBoundary from '@components/common/ErrorBoundary';

// Performance utilities removed for simplified structure

// Import CSS
// Using Tailwind classes only; removed component CSS imports

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './contexts/NotificationContext';
// Onboarding provider removed for simplified structure

// Accessibility wrapper removed for simplified structure

// Feedback system removed for simplified structure
import { ToastContainer } from './components/notifications';

function App() {
  useEffect(() => {
    // Simplified initialization

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
              <NotificationProvider>
                <CartProvider>
                  <WishlistProvider>
                    <LocalizedLayout>
                      <AppRouter />

                      {/* Global feedback and error handling containers */}
                      <ToastContainer position='top-right' />
                    </LocalizedLayout>
                  </WishlistProvider>
                </CartProvider>
              </NotificationProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </AppErrorBoundary>
  );
}

export default App;
