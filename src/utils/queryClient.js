import { QueryClient } from '@tanstack/react-query';
import { apiMethods } from '@/api/api';

// Configure React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data stays fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time: how long data stays in cache (10 minutes)
      cacheTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in production
      refetchOnWindowFocus: import.meta.env.VITE_ENVIRONMENT === 'production',
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Background refetch interval (5 minutes)
      refetchInterval: 5 * 60 * 1000,
    },
    mutations: {
      // Retry failed mutations 2 times
      retry: 2,
      // Retry delay for mutations
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Query keys factory for consistent naming
export const queryKeys = {
  // Auth
  auth: {
    user: () => ['auth', 'user'],
    profile: () => ['auth', 'profile'],
  },

  // Products
  products: {
    all: () => ['products'],
    list: (filters) => ['products', 'list', filters],
    detail: (id) => ['products', 'detail', id],
    categories: () => ['products', 'categories'],
    search: (query) => ['products', 'search', query],
  },

  // Orders
  orders: {
    all: () => ['orders'],
    list: (filters) => ['orders', 'list', filters],
    detail: (id) => ['orders', 'detail', id],
    user: (userId) => ['orders', 'user', userId],
  },

  // Cart
  cart: {
    items: () => ['cart', 'items'],
    count: () => ['cart', 'count'],
  },

  // Wishlist
  wishlist: {
    items: () => ['wishlist', 'items'],
    count: () => ['wishlist', 'count'],
  },

  // Admin
  admin: {
    dashboard: () => ['admin', 'dashboard'],
    users: () => ['admin', 'users'],
    analytics: () => ['admin', 'analytics'],
  },

  // Farmer
  farmer: {
    dashboard: () => ['farmer', 'dashboard'],
    products: () => ['farmer', 'products'],
    orders: () => ['farmer', 'orders'],
  },
};

// Common query functions
export const queryFunctions = {
  // Generic fetch function
  fetchData: async (endpoint, params = {}) => {
    const response = await apiMethods.get(endpoint, params);
    return response.data;
  },

  // Fetch with error handling
  fetchWithErrorHandling: async (endpoint, params = {}) => {
    try {
      const response = await apiMethods.get(endpoint, params);
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message || 'An error occurred',
      };
    }
  },

  // Paginated fetch
  fetchPaginated: async (
    endpoint,
    { page = 1, limit = 10, ...params } = {}
  ) => {
    const response = await apiMethods.get(endpoint, {
      page,
      limit,
      ...params,
    });
    return response.data;
  },
};

// Mutation functions
export const mutationFunctions = {
  // Generic create function
  createData: async (endpoint, data) => {
    const response = await apiMethods.post(endpoint, data);
    return response.data;
  },

  // Generic update function
  updateData: async (endpoint, data) => {
    const response = await apiMethods.put(endpoint, data);
    return response.data;
  },

  // Generic delete function
  deleteData: async (endpoint) => {
    const response = await apiMethods.delete(endpoint);
    return response.data;
  },

  // Upload file
  uploadFile: async (endpoint, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiMethods.upload(endpoint, formData, onProgress);
    return response.data;
  },
};

// Error handling utilities
export const queryUtils = {
  // Handle query error
  handleQueryError: (error) => {
    console.error('Query Error:', error);

    // Show user-friendly error message
    const message =
      error?.type === 'NETWORK_ERROR'
        ? 'Network connection failed. Please check your internet connection.'
        : error?.message || 'An unexpected error occurred';

    // You can integrate with a toast/notification system here
    if (window.showToast) {
      window.showToast(message, 'error');
    }

    return message;
  },

  // Handle mutation error
  handleMutationError: (error) => {
    console.error('Mutation Error:', error);

    let message = 'An error occurred while processing your request';

    switch (error?.type) {
      case 'VALIDATION_ERROR':
        message = 'Please check your input and try again';
        break;
      case 'UNAUTHORIZED':
        message = 'Please log in to continue';
        break;
      case 'FORBIDDEN':
        message = 'You do not have permission to perform this action';
        break;
      case 'NETWORK_ERROR':
        message =
          'Network connection failed. Please check your internet connection';
        break;
      default:
        message = error?.message || message;
    }

    // You can integrate with a toast/notification system here
    if (window.showToast) {
      window.showToast(message, 'error');
    }

    return message;
  },

  // Invalidate related queries
  invalidateQueries: (queryKey) => {
    queryClient.invalidateQueries({ queryKey });
  },

  // Refetch queries
  refetchQueries: (queryKey) => {
    queryClient.refetchQueries({ queryKey });
  },

  // Clear cache
  clearCache: () => {
    queryClient.clear();
  },
};

// Optimistic update utilities
export const optimisticUtils = {
  // Add item to list optimistically
  addToList: (queryKey, newItem) => {
    queryClient.setQueryData(queryKey, (oldData) => {
      if (!oldData) return [newItem];
      return Array.isArray(oldData) ? [...oldData, newItem] : [newItem];
    });
  },

  // Update item in list optimistically
  updateInList: (queryKey, itemId, updatedItem) => {
    queryClient.setQueryData(queryKey, (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      return oldData.map((item) =>
        item.id === itemId ? { ...item, ...updatedItem } : item
      );
    });
  },

  // Remove item from list optimistically
  removeFromList: (queryKey, itemId) => {
    queryClient.setQueryData(queryKey, (oldData) => {
      if (!oldData || !Array.isArray(oldData)) return oldData;
      return oldData.filter((item) => item.id !== itemId);
    });
  },
};

export default queryClient;
