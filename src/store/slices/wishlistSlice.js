import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiMethods } from '@/api/api';

// Async thunks
export const fetchWishlistItems = createAsyncThunk(
  'wishlist/fetchWishlistItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get('/wishlist');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist items');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post('/wishlist/add', { productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      await apiMethods.delete(`/wishlist/items/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  itemCount: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist items
      .addCase(fetchWishlistItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.itemCount = state.items.length;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        const newItem = action.payload;
        if (!state.items.find((item) => item.productId === newItem.productId)) {
          state.items.push(newItem);
          state.itemCount = state.items.length;
        }
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        const productId = action.payload;
        state.items = state.items.filter(
          (item) => item.productId !== productId
        );
        state.itemCount = state.items.length;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlist = (state) => state.wishlist;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistItemCount = (state) => state.wishlist.itemCount;
export const selectWishlistIsLoading = (state) => state.wishlist.isLoading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
