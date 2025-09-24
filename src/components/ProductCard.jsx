import React, { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
} from '../store/slices/wishlistSlice';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationService } from '../services/notifications/NotificationService';
import LazyImage from './LazyImage';

// Format currency for Indian market
function formatINR(value) {
  if (value == null) return '—';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}

// Star rating component
const StarRating = ({ rating = 0, maxStars = 5 }) => {
  return (
    <div
      className='flex items-center gap-1'
      role='img'
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {[...Array(maxStars)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : index < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-secondary-300'
          }`}
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
          />
        </svg>
      ))}
      <span className='ml-1 text-sm text-secondary-600'>
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

function ProductCard({
  product = {},
  className = '',
  showQuickActions = true,
  layout = 'default', // 'default', 'compact', 'wide'
}) {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { showSuccess, showError, showInfo } = useNotifications();

  const {
    id,
    name,
    price,
    image,
    rating = 0,
    description,
    badge,
    inStock = true,
    unit = 'kg',
    discount,
    originalPrice,
    category,
    farmer,
    isOrganic = false,
    freshness = 'Fresh',
  } = product;

  const [imgSrc] = useState(
    image ||
      `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format`
  );
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isInWishlist = wishlistItems?.some((item) => item.id === id) || false;
  
  // Fallback image for LazyImage component
  const fallbackSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format';

  const handleAddToCart = useCallback(async () => {
    if (!inStock || isAddingToCart) return;

    setIsAddingToCart(true);
    setIsAnimating(true);

    try {
      dispatch(addToCart({ ...product, quantity: 1 }));

      // Show success notification
      showSuccess(`${name} has been added to your cart`);

      // Visual feedback animation
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add item to cart. Please try again.');
      setIsAnimating(false);
    } finally {
      setIsAddingToCart(false);
    }
  }, [dispatch, product, inStock, isAddingToCart, showSuccess, showError, name]);

  const handleWishlistToggle = useCallback(() => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
      showInfo(`${name} has been removed from your wishlist`);
    } else {
      dispatch(addToWishlist(product));
      showSuccess(`${name} has been added to your wishlist`);
    }
  }, [dispatch, isInWishlist, id, product, showSuccess, showInfo, name]);

  const discountPercentage =
    originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : discount;

  return (
    <article
      className={`group bg-white rounded-xl shadow-md border border-secondary-200 overflow-hidden 
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className} 
        ${!inStock ? 'opacity-75' : ''}`}
      data-product-id={id}
      data-layout={layout}
      role='article'
      aria-label={`Product: ${name}`}
    >
      {/* Image Container */}
      <div className='relative aspect-square overflow-hidden bg-secondary-100'>
        {/* Badges */}
        <div className='absolute top-3 left-3 z-10 flex flex-wrap gap-2'>
          {isOrganic && (
            <span className='bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full'>
              🌱 Organic
            </span>
          )}
          {badge && (
            <span className='bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full'>
              {badge}
            </span>
          )}
          {discountPercentage && (
            <span className='bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full'>
              -{discountPercentage}%
            </span>
          )}
          {!inStock && (
            <span className='bg-secondary-500 text-white text-xs font-medium px-2 py-1 rounded-full'>
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          type='button'
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center 
            transition-all duration-200 ${
              isInWishlist
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-white/80 backdrop-blur-sm text-secondary-600 hover:bg-white hover:text-red-600'
            }`}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isInWishlist}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isInWishlist ? 'scale-110' : 'group-hover:scale-110'}`}
            fill={isInWishlist ? 'currentColor' : 'none'}
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
            />
          </svg>
        </button>

        {/* Product Image */}
        <Link to={`/products/${id}`} className='block w-full h-full'>
          <LazyImage
            src={imgSrc}
            fallbackSrc={fallbackSrc}
            alt={name}
            className='w-full h-full object-cover transition-all duration-300 group-hover:scale-105'
            placeholderClassName='w-full h-full bg-secondary-200 flex items-center justify-center'
            errorClassName='w-full h-full bg-secondary-200 flex items-center justify-center text-secondary-400'
            fadeDuration={300}
            quality={85}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>

        {/* Quick Action Overlay (optional) */}
        {showQuickActions && (
          <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <div className='transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
              <button
                type='button'
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  !inStock
                    ? 'bg-secondary-400 text-secondary-200 cursor-not-allowed'
                    : isAddingToCart
                      ? 'bg-primary-700 text-white cursor-wait'
                      : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
                } ${isAnimating ? 'ring-2 ring-primary-300' : ''}`}
                aria-label={inStock ? 'Add to cart' : 'Out of stock'}
                aria-busy={isAddingToCart}
                title={inStock ? 'Add to cart' : 'Out of stock'}
              >
                {isAddingToCart ? (
                  <>
                    <svg
                      className='w-4 h-4 animate-spin'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Adding...
                  </>
                ) : !inStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
                      />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='p-4'>
        {/* Category & Freshness */}
        <div className='flex items-center justify-between mb-2'>
          {category && (
            <span className='text-xs text-primary-600 font-medium uppercase tracking-wide'>
              {category}
            </span>
          )}
          <span className='text-xs text-green-600 font-medium'>
            {freshness}
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/products/${id}`}>
          <h3 className='font-semibold text-secondary-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors'>
            {name}
          </h3>
        </Link>

        {/* Description */}
        {description && (
          <p className='text-sm text-secondary-600 mb-3 line-clamp-2'>
            {description}
          </p>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className='mb-3'>
            <StarRating rating={rating} />
          </div>
        )}

        {/* Farmer Info */}
        {farmer && (
          <div className='flex items-center gap-2 mb-3 text-sm text-secondary-600'>
            <span>🧑‍🌾</span>
            <span>by {typeof farmer === 'string' ? farmer : farmer.name}</span>
            {typeof farmer === 'object' && farmer.verified && (
              <span className="text-green-600 font-medium" title="Verified Farmer">
                ✓
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <span className='text-lg font-bold text-secondary-900'>
              {formatINR(price)}
            </span>
            {unit && (
              <span className='text-sm text-secondary-500'>/{unit}</span>
            )}
            {originalPrice && originalPrice !== price && (
              <span className='text-sm text-secondary-400 line-through'>
                {formatINR(originalPrice)}
              </span>
            )}
          </div>

          {/* Quick Add Button (Mobile) */}
          <button
            type='button'
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
            className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              !inStock
                ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                : isAddingToCart
                  ? 'bg-primary-700 text-white cursor-wait'
                  : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
            }`}
            aria-label={inStock ? 'Add to cart' : 'Out of stock'}
            aria-busy={isAddingToCart}
          >
            {isAddingToCart ? (
              <svg
                className='w-4 h-4 animate-spin'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
            ) : (
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
