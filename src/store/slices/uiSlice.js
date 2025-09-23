import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Toast notifications
  toasts: [],

  // Loading states for different operations
  loading: {
    global: false,
    page: false,
    component: {},
  },

  // Modal states
  modals: {
    login: false,
    register: false,
    productDetail: false,
    checkout: false,
    profile: false,
  },

  // Theme and appearance
  theme: 'light',
  sidebarOpen: false,

  // Search and filters
  searchQuery: '',
  activeFilters: {},

  // Pagination
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0,
  },

  // Sorting
  sorting: {
    field: 'createdAt',
    order: 'desc',
  },

  // Device and viewport
  isMobile: window.innerWidth < 768,
  screenSize: 'md',
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toast notifications
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: 'info',
        duration: 5000,
        ...action.payload,
      };
      state.toasts.push(toast);
    },

    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },

    clearToasts: (state) => {
      state.toasts = [];
    },

    // Loading states
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },

    setPageLoading: (state, action) => {
      state.loading.page = action.payload;
    },

    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      state.loading.component[component] = loading;
    },

    // Modal states
    openModal: (state, action) => {
      const modalName = action.payload;
      if (modalName in state.modals) {
        state.modals[modalName] = true;
      }
    },

    closeModal: (state, action) => {
      const modalName = action.payload;
      if (modalName in state.modals) {
        state.modals[modalName] = false;
      }
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal] = false;
      });
    },

    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },

    // Sidebar
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Search and filters
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setActiveFilters: (state, action) => {
      state.activeFilters = action.payload;
    },

    addFilter: (state, action) => {
      const { key, value } = action.payload;
      state.activeFilters[key] = value;
    },

    removeFilter: (state, action) => {
      const key = action.payload;
      delete state.activeFilters[key];
    },

    clearFilters: (state) => {
      state.activeFilters = {};
    },

    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    },

    // Sorting
    setSorting: (state, action) => {
      state.sorting = action.payload;
    },

    setSortField: (state, action) => {
      const field = action.payload;
      if (state.sorting.field === field) {
        state.sorting.order = state.sorting.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.sorting.field = field;
        state.sorting.order = 'asc';
      }
    },

    // Device and viewport
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },

    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
  },
});

// Export actions
export const {
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
  setPageLoading,
  setComponentLoading,
  openModal,
  closeModal,
  closeAllModals,
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setSearchQuery,
  setActiveFilters,
  addFilter,
  removeFilter,
  clearFilters,
  setPagination,
  setCurrentPage,
  setItemsPerPage,
  setSorting,
  setSortField,
  setIsMobile,
  setScreenSize,
} = uiSlice.actions;

// Selectors
export const selectUI = (state) => state.ui;
export const selectToasts = (state) => state.ui.toasts;
export const selectLoading = (state) => state.ui.loading;
export const selectModals = (state) => state.ui.modals;
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectActiveFilters = (state) => state.ui.activeFilters;
export const selectPagination = (state) => state.ui.pagination;
export const selectSorting = (state) => state.ui.sorting;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectScreenSize = (state) => state.ui.screenSize;

export default uiSlice.reducer;
