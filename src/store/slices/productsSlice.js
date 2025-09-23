import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  items: [],
  categories: [],
  currentProduct: null,
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
  },
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  setCategories,
  setFilters,
  clearFilters,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
