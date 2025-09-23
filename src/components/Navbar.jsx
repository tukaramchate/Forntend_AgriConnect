import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';

/**
 * Modern, accessible Navbar with enhanced UI/UX
 * Features: Search, cart/wishlist indicators, user menu, responsive design
 */
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Get state from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  // Navigation menu items
  const menuItems = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/products', label: 'Products', icon: '🌾' },
    { to: '/categories', label: 'Categories', icon: '📦' },
    { to: '/about', label: 'About', icon: 'ℹ️' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Debounced search
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/products?search=${encodeURIComponent(value.trim())}`);
      }
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <nav className='ac-navbar' role='navigation' aria-label='Main navigation'>
      <div className='ac-navbar__container' ref={menuRef}>
        {/* Brand Logo */}
        <Link to='/' className='ac-navbar__brand' aria-label='AgriConnect home'>
          <img src={logo} alt='' className='ac-navbar__logo' />
          <span className='ac-navbar__brand-text'>AgriConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-8'>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `ac-navbar__link ${isActive ? 'ac-navbar__link--active' : ''}`
              }
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              <span className='mr-2 text-lg' aria-hidden='true'>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Search Bar (Desktop) */}
        <form
          className='ac-navbar__search hidden lg:flex'
          role='search'
          onSubmit={handleSearchSubmit}
          aria-label='Search products'
        >
          <div className='relative w-full'>
            <input
              ref={searchRef}
              className='ac-navbar__search-input'
              type='search'
              placeholder='Search products, seeds, tools...'
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label='Search products'
            />
            <button 
              type='submit' 
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-primary-600 transition-colors' 
              aria-label='Search'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className='ac-navbar__actions'>
          {/* Wishlist */}
          <Link 
            to='/wishlist' 
            className='ac-navbar__action group'
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <svg className='w-6 h-6 group-hover:text-red-500 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
            </svg>
            {wishlistCount > 0 && (
              <span className='ac-navbar__badge bg-red-500'>{wishlistCount}</span>
            )}
          </Link>

          {/* Cart */}
          <Link 
            to='/cart' 
            className='ac-navbar__action group'
            aria-label={`Shopping cart (${cartCount} items)`}
          >
            <svg className='w-6 h-6 group-hover:text-primary-600 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01' />
            </svg>
            {cartCount > 0 && (
              <span className='ac-navbar__badge bg-primary-600'>{cartCount}</span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className='relative'>
              <button 
                onClick={toggleUserMenu}
                className='ac-navbar__action'
                aria-label={`User menu for ${user?.name || 'User'}`}
                aria-expanded={isUserMenuOpen}
                aria-haspopup='true'
              >
                <div className='w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium'>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>
              
              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 z-50'>
                  <div className='py-2'>
                    <div className='px-4 py-3 border-b border-secondary-100'>
                      <p className='text-sm font-medium text-secondary-900'>Hi, {user?.name || 'User'}</p>
                      <p className='text-xs text-secondary-500'>{user?.email}</p>
                    </div>
                    
                    {user?.role === 'farmer' && (
                      <Link 
                        to='/farmer-dashboard' 
                        className='block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className='mr-3'>🌾</span>Dashboard
                      </Link>
                    )}
                    
                    {user?.role === 'admin' && (
                      <Link 
                        to='/admin-dashboard' 
                        className='block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors'
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className='mr-3'>⚙️</span>Admin Panel
                      </Link>
                    )}
                    
                    <Link 
                      to='/orders' 
                      className='block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors'
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className='mr-3'>📦</span>My Orders
                    </Link>
                    
                    <Link 
                      to='/profile' 
                      className='block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors'
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className='mr-3'>👤</span>Profile Settings
                    </Link>
                    
                    <div className='border-t border-secondary-100 mt-2'>
                      <button 
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                      >
                        <span className='mr-3'>🚪</span>Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='hidden sm:flex items-center gap-3'>
              <Link to='/login' className='ac-btn ac-btn--ghost ac-btn--sm'>
                Login
              </Link>
              <Link to='/register' className='ac-btn ac-btn--primary ac-btn--sm'>
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className='ac-navbar__mobile-toggle'
            onClick={toggleMobileMenu}
            aria-label='Toggle mobile menu'
            aria-expanded={isMobileMenuOpen}
            aria-controls='mobile-navigation'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {isMobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className='ac-navbar__mobile-menu'
          id='mobile-navigation'
          role='region'
          aria-label='Mobile navigation menu'
        >
          {/* Mobile Search */}
          <div className='ac-navbar__mobile-search lg:hidden'>
            <form onSubmit={handleSearchSubmit} role='search'>
              <div className='relative'>
                <input
                  type='search'
                  placeholder='Search products...'
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className='ac-navbar__search-input'
                  aria-label='Search products'
                />
                <button
                  type='submit'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-primary-600 transition-colors'
                  aria-label='Search'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Navigation Links */}
          <nav className='ac-navbar__mobile-nav'>
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className='ac-navbar__mobile-link'
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={location.pathname === item.to ? 'page' : undefined}
              >
                <span className='mr-3' aria-hidden='true'>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            
            {!isAuthenticated && (
              <>
                <NavLink
                  to='/login'
                  className='ac-navbar__mobile-link'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className='mr-3' aria-hidden='true'>🔑</span>
                  Login
                </NavLink>
                <NavLink
                  to='/register'
                  className='ac-navbar__mobile-link'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className='mr-3' aria-hidden='true'>📝</span>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </nav>
  );
}
