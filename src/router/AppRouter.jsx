import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { ToastContainer } from '../components/notifications';

// Import core pages directly for faster initial loading
import Home from '../pages/Home';
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import About from '../pages/About';

// Lazy load less frequently accessed pages
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Orders = lazy(() => import('../pages/Orders'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard-Enhanced'));
const FarmerDashboard = lazy(() => import('../pages/FarmerDashboard-Enhanced'));
const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const NotificationDemo = lazy(() => import('../pages/NotificationDemo'));
const OnboardingDemo = lazy(() => import('../pages/OnboardingDemo'));
const I18nDemo = lazy(() => import('../pages/I18nDemo'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Lazy load social components
const FarmerProfile = lazy(
  () => import('../components/social/profiles/FarmerProfile')
);
const CommunityFeed = lazy(
  () => import('../components/social/community/CommunityFeed')
);

// Lazy load subscription page
const Subscription = lazy(() => import('../pages/Subscription'));

// Import context
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

function AppRouter() {
  // Use contexts for global state management
  const { addItem: addToCart, itemCount: cartCount } = useCart();
  const {
    items: wishlistItems,
    addItem: addToWishlist,
    itemCount: wishlistCount,
  } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial app loading
  useEffect(() => {
    // Fetch initial data, check authentication, etc.
    const initializeApp = async () => {
      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleSearch = (query) => {
    // TODO: Implement search functionality
    // Navigate to products page with search query
    if (query.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
    }
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      <main className='ac-main'>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path='/'
              element={
                <Home onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
              }
            />

            <Route
              path='/products'
              element={
                <Products
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  wishlistItems={wishlistItems}
                />
              }
            />

            <Route
              path='/categories'
              element={
                <Categories
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  wishlistItems={wishlistItems}
                />
              }
            />

            <Route
              path='/products/:id'
              element={
                <ProductDetails
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  isInWishlist={(id) =>
                    wishlistItems.some((item) => item.id === id)
                  }
                />
              }
            />

            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/about' element={<About />} />
            <Route path='/notifications/demo' element={<NotificationDemo />} />
            <Route path='/onboarding/demo' element={<OnboardingDemo />} />
            <Route path='/i18n/demo' element={<I18nDemo />} />

            {/* Social Features Routes */}
            <Route path='/farmers/:farmerId' element={<FarmerProfile />} />
            <Route path='/community' element={<CommunityFeed />} />

            {/* Subscription & Loyalty Route */}
            <Route path='/subscription' element={<Subscription />} />

            {/* Protected routes */}
            <Route
              path='/checkout'
              element={
                isAuthenticated ? (
                  <Checkout />
                ) : (
                  <Login redirectTo='/checkout' />
                )
              }
            />

            <Route
              path='/orders'
              element={
                isAuthenticated ? <Orders /> : <Login redirectTo='/orders' />
              }
            />

            {/* User Dashboard */}
            <Route
              path='/dashboard'
              element={
                isAuthenticated ? (
                  <UserDashboard />
                ) : (
                  <Login redirectTo='/dashboard' />
                )
              }
            />

            {/* Auth routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Admin and Farmer routes with role-based protection */}
            <Route
              path='/admin/*'
              element={
                isAuthenticated && user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <NotFound />
                )
              }
            />

            <Route
              path='/farmer/*'
              element={
                isAuthenticated && user?.role === 'farmer' ? (
                  <FarmerDashboard />
                ) : (
                  <NotFound />
                )
              }
            />

            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <ToastContainer />
    </>
  );
}

export default AppRouter;
