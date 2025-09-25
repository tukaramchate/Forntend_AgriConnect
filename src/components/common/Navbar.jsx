import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logoutUser } from '@/store/slices/authSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.items.length);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Menu items memoized
  const menuItems = useMemo(
    () => [
      { to: '/', label: t('navigation.home') },
      { to: '/products', label: t('navigation.products') },
      { to: '/categories', label: t('navigation.categories') },
      { to: '/about', label: t('navigation.about') },
    ],
    [t]
  );

  // Inline SVG icons (small, dependency-free)
  const IconHeart = ({ className = 'h-6 w-6' }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
    >
      <path
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z'
      />
    </svg>
  );

  const IconCart = ({ className = 'h-6 w-6' }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
    >
      <path
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3 3h2l.4 2M7 13h10l4-8H5.4'
      />
      <circle cx='9' cy='20' r='1' />
      <circle cx='20' cy='20' r='1' />
    </svg>
  );

  const IconUser = ({ className = 'h-6 w-6' }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
    >
      <path
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16 11a4 4 0 10-8 0 4 4 0 008 0z'
      />
      <path
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6 20a6 6 0 0112 0'
      />
    </svg>
  );

  const IconMenu = ({ className = 'h-6 w-6' }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
    >
      <path
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M4 6h16M4 12h16M4 18h16'
      />
    </svg>
  );

  const IconX = ({ className = 'h-6 w-6' }) => (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
    >
      <path
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6 18L18 6M6 6l12 12'
      />
    </svg>
  );

  // Close menus on outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Sync search query with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  // Debounced search navigation
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, navigate]);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav
      className='bg-white shadow-md sticky top-0 z-50'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Logo */}
          <Link to='/' className='text-2xl font-bold text-blue-600'>
            AgriConnect
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-8'>
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${
                  location.pathname === item.to
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-current={
                  location.pathname === item.to ? 'page' : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <div className='hidden md:block flex-1 mx-4'>
            <form
              role='search'
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
              }}
            >
              <label htmlFor='nav-search' className='sr-only'>
                Search products
              </label>
              <input
                id='nav-search'
                name='search'
                type='search'
                placeholder='Search products...'
                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label='Search products'
              />
            </form>
          </div>

          {/* Right section */}
          <div className='flex items-center space-x-2'>
            {/* Wishlist */}
            <Link
              to='/wishlist'
              className='relative p-2 text-gray-700 hover:text-blue-600'
              aria-label='Wishlist'
            >
              <IconHeart className='h-6 w-6' />
              {wishlistCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to='/cart'
              className='relative p-2 text-gray-700 hover:text-blue-600'
              aria-label='Cart'
            >
              <IconCart className='h-6 w-6' />
              {cartCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications removed for simplified structure */}

            {/* Auth section */}
            {!user ? (
              <>
                <Link
                  to='/login'
                  className='px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition'
                >
                  Register
                </Link>
              </>
            ) : (
              <div className='relative' ref={userMenuRef}>
                <button
                  type='button'
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className='p-2 text-gray-700 hover:text-blue-600'
                  aria-haspopup='true'
                  aria-expanded={isUserMenuOpen}
                  aria-controls='user-menu'
                  aria-label='User menu'
                >
                  <IconUser className='h-6 w-6' />
                </button>
                {isUserMenuOpen && (
                  <div
                    id='user-menu'
                    className='absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-50'
                    role='menu'
                    aria-label='User menu'
                  >
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      role='menuitem'
                    >
                      Profile
                    </Link>
                    {(user.role === 'farmer' || user.role === 'admin') && (
                      <Link
                        to='/dashboard'
                        className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                        role='menuitem'
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      type='button'
                      className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                      role='menuitem'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type='button'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2 text-gray-700 hover:text-blue-600'
              aria-label='Toggle mobile menu'
              aria-controls='mobile-menu'
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <IconX className='h-6 w-6' />
              ) : (
                <IconMenu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id='mobile-menu'
          className='md:hidden bg-white border-t'
        >
          <div className='px-4 py-3 space-y-2'>
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block ${
                  location.pathname === item.to
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-current={
                  location.pathname === item.to ? 'page' : undefined
                }
              >
                {item.label}
              </Link>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                setIsMobileMenuOpen(false);
              }}
            >
              <label htmlFor='mobile-search' className='sr-only'>
                Search products
              </label>
              <input
                id='mobile-search'
                type='search'
                placeholder='Search products...'
                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label='Search products'
              />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
