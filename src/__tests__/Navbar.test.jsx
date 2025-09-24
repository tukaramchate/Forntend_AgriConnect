import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../components/Navbar';

// Mock the store slices to avoid API import issues
const authSlice = {
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
};

const cartSlice = {
  name: 'cart',
  initialState: { items: [] },
  reducers: {},
};

const wishlistSlice = {
  name: 'wishlist',
  initialState: { items: [] },
  reducers: {},
};

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/', search: '' }),
  };
});

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = authSlice.initialState, action) => {
        switch (action.type) {
          case 'auth/logoutUser':
            return authSlice.reducers.logoutUser(state);
          default:
            return state;
        }
      },
      cart: (state = cartSlice.initialState) => state,
      wishlist: (state = wishlistSlice.initialState) => state,
    },
    preloadedState: {
      auth: { user: null, isAuthenticated: false },
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

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders logo and navigation links', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('AgriConnect')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('shows login/register buttons when user not authenticated', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    const authenticatedStore = createMockStore({
      auth: { 
        user: { name: 'John Doe', role: 'customer' }, 
        isAuthenticated: true 
      },
    });
    
    renderWithProviders(<Navbar />, { store: authenticatedStore });
    
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });

  it('opens and closes user menu correctly', () => {
    const authenticatedStore = createMockStore({
      auth: { 
        user: { name: 'John Doe', role: 'customer' }, 
        isAuthenticated: true 
      },
    });
    
    renderWithProviders(<Navbar />, { store: authenticatedStore });
    
    const userMenuButton = screen.getByLabelText('User menu');
    
    // Menu should be closed initially
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // Open menu
    fireEvent.click(userMenuButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Close menu by clicking outside
    fireEvent.click(document.body);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('shows dashboard link for farmer/admin users', () => {
    const farmerStore = createMockStore({
      auth: { 
        user: { name: 'John Farmer', role: 'farmer' }, 
        isAuthenticated: true 
      },
    });
    
    renderWithProviders(<Navbar />, { store: farmerStore });
    
    const userMenuButton = screen.getByLabelText('User menu');
    fireEvent.click(userMenuButton);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    renderWithProviders(<Navbar />);
    
    const searchInput = screen.getByLabelText('Search products');
    
    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'tomatoes' } });
    
    // Submit search form
    const searchForm = searchInput.closest('form');
    fireEvent.submit(searchForm);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?search=tomatoes');
  });

  it('opens and closes mobile menu correctly', () => {
    renderWithProviders(<Navbar />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    
    // Menu should be closed initially
    expect(screen.queryByText('mobile-menu')).not.toBeInTheDocument();
    
    // Open menu
    fireEvent.click(mobileMenuButton);
    // Check for mobile search box (there are multiple search boxes - desktop and mobile)
    expect(screen.getAllByRole('searchbox', { name: 'Search products' }).length).toBeGreaterThan(0);
    
    // Close menu
    fireEvent.click(mobileMenuButton);
  });

  it('displays cart and wishlist counts', () => {
    const storeWithItems = createMockStore({
      cart: { items: [{ id: 1 }, { id: 2 }] },
      wishlist: { items: [{ id: 3 }] },
    });
    
    renderWithProviders(<Navbar />, { store: storeWithItems });
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Cart count
    expect(screen.getByText('1')).toBeInTheDocument(); // Wishlist count
  });

  it('closes menus when Escape key is pressed', () => {
    const authenticatedStore = createMockStore({
      auth: { 
        user: { name: 'John Doe', role: 'customer' }, 
        isAuthenticated: true 
      },
    });
    
    renderWithProviders(<Navbar />, { store: authenticatedStore });
    
    // Open user menu
    const userMenuButton = screen.getByLabelText('User menu');
    fireEvent.click(userMenuButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    
    // Press Escape to close
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    const authenticatedStore = createMockStore({
      auth: { 
        user: { name: 'John Doe', role: 'customer' }, 
        isAuthenticated: true 
      },
    });
    
    renderWithProviders(<Navbar />, { store: authenticatedStore });
    
    // Open user menu and click logout
    const userMenuButton = screen.getByLabelText('User menu');
    fireEvent.click(userMenuButton);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    // Should navigate to home
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders(<Navbar />);
    
    // Check main navigation has proper role
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Check search has proper labels
    expect(screen.getByLabelText('Search products')).toBeInTheDocument();
    
    // Check buttons have proper ARIA attributes
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  });
});