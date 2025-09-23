import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import store from '@/store/store';
import { queryClient } from '@utils/queryClient';
import AppErrorBoundary from '@components/ErrorBoundary';

// Import CSS
// Using Tailwind classes only; removed component CSS imports

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

function App() {
  return (
    <AppErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <AppRouter />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </AppErrorBoundary>
  );
}

export default App;
