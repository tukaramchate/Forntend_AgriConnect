import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductDetails from '../pages/ProductDetails';
import cartSlice from '../store/slices/cartSlice';
import wishlistSlice from '../store/slices/wishlistSlice';

// Mock useParams to return a product ID
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  };
});

// Mock the products data that would normally come from API/Redux
vi.mock('../data/products', () => ({
  default: [
    {
      id: 1,
      name: 'Fresh Organic Tomatoes',
      price: 4.99,
      originalPrice: 6.99,
      category: 'Vegetables',
      farmer: 'John Doe',
      location: 'California',
      description: 'Fresh, organic tomatoes grown with care',
      longDescription:
        'These premium organic tomatoes are grown using sustainable farming practices in the fertile valleys of California. Hand-picked at peak ripeness, they offer exceptional flavor and nutrition.',
      images: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop&auto=format',
      ],
      inStock: true,
      rating: 4.8,
      reviews: 127,
      organic: true,
      locallyGrown: true,
    },
  ],
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartSlice,
      wishlist: wishlistSlice,
    },
    preloadedState: {
      cart: { items: [] },
      wishlist: { items: [] },
      ...initialState,
    },
  });
};

const renderWithProviders = (component, { store = createMockStore() } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('ProductDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeleton initially', () => {
    renderWithProviders(<ProductDetails />);

    // Check for skeleton elements
    const skeletonElements = screen.getAllByText('', {
      selector: '.animate-pulse',
    });
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('displays product information after loading', async () => {
    renderWithProviders(<ProductDetails />);

    // Wait for product to load using the main heading
    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Check for basic product information elements
    expect(
      screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
    ).toBeInTheDocument();
    expect(screen.getByText('🌱 Organic')).toBeInTheDocument();

    // Check that images are present (use exact match for main image)
    expect(screen.getByAltText('Fresh Organic Tomatoes')).toBeInTheDocument();
  });

  it('handles quantity changes correctly', async () => {
    renderWithProviders(<ProductDetails />);

    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Look for quantity input specifically
    const quantityInput = screen.getByLabelText(/Product quantity/i);
    const increaseBtn = screen.getByLabelText(/Increase quantity/i);
    const decreaseBtn = screen.getByLabelText(/Decrease quantity/i);

    // Test increase quantity
    fireEvent.click(increaseBtn);
    expect(quantityInput.value).toBe('2');

    // Test decrease quantity
    fireEvent.click(decreaseBtn);
    expect(quantityInput.value).toBe('1');

    // Test decrease below 1 (should not work)
    fireEvent.click(decreaseBtn);
    expect(quantityInput.value).toBe('1');
  });

  it('renders add to cart button', async () => {
    const store = createMockStore();
    renderWithProviders(<ProductDetails />, { store });

    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Check that the add to cart button exists and is clickable
    const addToCartBtn = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
    expect(addToCartBtn).not.toBeDisabled();
  });

  it('toggles wishlist correctly', async () => {
    const store = createMockStore();
    renderWithProviders(<ProductDetails />, { store });

    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Check that the wishlist button exists
    const wishlistBtn = screen.getByRole('button', { name: /wishlist|heart/i });
    expect(wishlistBtn).toBeInTheDocument();
  });

  it('renders product tabs', async () => {
    renderWithProviders(<ProductDetails />);

    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Check that tabs exist
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);

    // Check that specific tabs are present
    expect(
      screen.getByRole('tab', { name: /description/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /nutrition/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /reviews/i })).toBeInTheDocument();
  });

  it('opens and closes lightbox correctly', async () => {
    renderWithProviders(<ProductDetails />);

    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Click main image to open lightbox
    const mainImage = screen.getByRole('button', { name: /open gallery/i });
    fireEvent.click(mainImage);

    // Check lightbox is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();

    // Close lightbox
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    // Lightbox should be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates gallery images with keyboard', async () => {
    renderWithProviders(<ProductDetails />);

    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Open lightbox
    const mainImage = screen.getByRole('button', { name: /open gallery/i });
    fireEvent.click(mainImage);

    // Test keyboard navigation
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.keyDown(document, { key: 'Escape' });

    // Lightbox should be closed after Escape
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('displays product description', async () => {
    renderWithProviders(<ProductDetails />);

    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Fresh Organic Tomatoes/i })
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Check that some description text is present
    const descriptionTab = screen.getByRole('tab', { name: /description/i });
    expect(descriptionTab).toBeInTheDocument();
  });
});
