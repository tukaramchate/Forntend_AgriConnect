import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiMethods } from '@/api/api';

// Async thunks for cart operations
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiMethods.get('/cart');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch cart items');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, options = {} }, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post('/cart/add', {
        productId,
        quantity,
        options,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await apiMethods.put(`/cart/items/${itemId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await apiMethods.delete(`/cart/items/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to remove item from cart'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await apiMethods.delete('/cart');
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await apiMethods.post('/cart/coupon', {
        code: couponCode,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to apply coupon');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  coupon: null,
  itemCount: 0,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Helper functions
const calculateCartTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    itemCount,
  };
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateItemQuantityLocally: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        const totals = calculateCartTotals(state.items);
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;
        state.total =
          state.subtotal + state.tax + state.shipping - state.discount;
        state.lastUpdated = new Date().toISOString();
      }
    },
    removeItemLocally: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      const totals = calculateCartTotals(state.items);
      state.subtotal = totals.subtotal;
      state.itemCount = totals.itemCount;
      state.total =
        state.subtotal + state.tax + state.shipping - state.discount;
      state.lastUpdated = new Date().toISOString();
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      state.total = state.subtotal + state.tax + state.shipping;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.tax = action.payload.tax || 0;
        state.shipping = action.payload.shipping || 0;
        state.discount = action.payload.discount || 0;
        state.coupon = action.payload.coupon || null;
        const totals = calculateCartTotals(state.items);
        state.itemCount = totals.itemCount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const newItem = action.payload;
        const existingItemIndex = state.items.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            JSON.stringify(item.options) === JSON.stringify(newItem.options)
        );

        if (existingItemIndex >= 0) {
          state.items[existingItemIndex].quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }

        const totals = calculateCartTotals(state.items);
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;
        state.total =
          state.subtotal + state.tax + state.shipping - state.discount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedItem = action.payload;
        const itemIndex = state.items.findIndex(
          (item) => item.id === updatedItem.id
        );

        if (itemIndex >= 0) {
          state.items[itemIndex] = updatedItem;
        }

        const totals = calculateCartTotals(state.items);
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;
        state.total =
          state.subtotal + state.tax + state.shipping - state.discount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const itemId = action.payload;
        state.items = state.items.filter((item) => item.id !== itemId);

        const totals = calculateCartTotals(state.items);
        state.subtotal = totals.subtotal;
        state.itemCount = totals.itemCount;
        state.total =
          state.subtotal + state.tax + state.shipping - state.discount;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.total = 0;
        state.subtotal = 0;
        state.tax = 0;
        state.shipping = 0;
        state.discount = 0;
        state.coupon = null;
        state.itemCount = 0;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Apply coupon
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupon = action.payload.coupon;
        state.discount = action.payload.discount;
        state.total =
          state.subtotal + state.tax + state.shipping - state.discount;
        state.error = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  updateItemQuantityLocally,
  removeItemLocally,
  removeCoupon,
} = cartSlice.actions;

// Selectors
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartIsLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;
export const selectCartCoupon = (state) => state.cart.coupon;

export default cartSlice.reducer;
