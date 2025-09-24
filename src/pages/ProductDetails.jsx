import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
} from '../store/slices/wishlistSlice';
import Loader from '../components/Loader';
import productAPI from '../api/productApi';
import mockProducts from '../data/products';
import ReviewSystem from '../components/social/reviews/ReviewSystem';
import SocialShare from '../components/social/sharing/SocialShare';

function ProductDetailsSkeleton() {
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Breadcrumb Skeleton */}
      <div className='flex items-center gap-2 mb-8'>
        <div className='h-4 w-12 bg-secondary-200 rounded animate-pulse'></div>
        <div className='h-4 w-4 bg-secondary-200 rounded animate-pulse'></div>
        <div className='h-4 w-16 bg-secondary-200 rounded animate-pulse'></div>
        <div className='h-4 w-4 bg-secondary-200 rounded animate-pulse'></div>
        <div className='h-4 w-24 bg-secondary-200 rounded animate-pulse'></div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Image Gallery Skeleton */}
        <div className='space-y-4'>
          <div className='aspect-square bg-secondary-200 rounded-xl animate-pulse'></div>
          <div className='grid grid-cols-4 gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='aspect-square bg-secondary-200 rounded-lg animate-pulse'
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className='space-y-6'>
          <div className='h-8 w-3/4 bg-secondary-200 rounded animate-pulse'></div>
          <div className='flex items-center gap-4'>
            <div className='h-5 w-24 bg-secondary-200 rounded animate-pulse'></div>
            <div className='h-5 w-16 bg-secondary-200 rounded animate-pulse'></div>
          </div>
          <div className='h-6 w-32 bg-secondary-200 rounded animate-pulse'></div>
          <div className='space-y-2'>
            <div className='h-4 w-full bg-secondary-200 rounded animate-pulse'></div>
            <div className='h-4 w-5/6 bg-secondary-200 rounded animate-pulse'></div>
            <div className='h-4 w-4/6 bg-secondary-200 rounded animate-pulse'></div>
          </div>
          <div className='flex gap-4'>
            <div className='h-12 w-32 bg-secondary-200 rounded-lg animate-pulse'></div>
            <div className='h-12 w-32 bg-secondary-200 rounded-lg animate-pulse'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StarRating = ({
  rating,
  size = 'md',
  showRating = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className='flex items-center'>
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-secondary-300'
            }`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </div>
      {showRating && (
        <span className='text-sm text-secondary-600 font-medium'>{rating}</span>
      )}
    </div>
  );
};

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const previousActiveElementRef = useRef(null);

  const isInWishlist = wishlistItems.some((item) => item.id === product?.id);
  const cartItem = cartItems.find((item) => item.id === product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from API first, fallback to mock data
        try {
          const productData = await productAPI.getProductById(id);
          setProduct(productData);

          // Fetch related products based on category
          try {
            const relatedData = await productAPI.getProducts({
              category: productData.category,
              limit: 4,
              exclude: [id],
            });
            setRelatedProducts(relatedData.products || []);
          } catch {
            // Use other mock products as related products
            const related = mockProducts
              .filter(
                (p) =>
                  p.id !== parseInt(id) && p.category === productData.category
              )
              .slice(0, 4);
            setRelatedProducts(related);
          }
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError);
          // Fallback to mock data - find product by ID
          const mockProduct = mockProducts.find((p) => p.id === parseInt(id));
          if (mockProduct) {
            // Enhance mock product with additional details for component compatibility
            setProduct({
              ...mockProduct,
              image: mockProduct.images?.[0] || mockProduct.image,
              gallery: mockProduct.images || [mockProduct.image],
              rating: mockProduct.rating || 0,
              reviewCount: mockProduct.reviews || 0,
              stock: mockProduct.stockCount || 50,
              unit: 'kg',
              isOrganic: mockProduct.organic || false,
              freshness: 'Fresh Today',
              description:
                mockProduct.longDescription || mockProduct.description,
              features: [
                mockProduct.organic
                  ? 'Organically grown without pesticides'
                  : 'Grown with care',
                'Harvested at peak ripeness',
                'Rich in vitamins and antioxidants',
                'Perfect for cooking and salads',
                'Fresh from the farm within 24 hours',
              ],
              farmer: {
                name:
                  typeof mockProduct.farmer === 'string'
                    ? mockProduct.farmer
                    : mockProduct.farmer?.name || 'Local Farmer',
                farm: 'Green Valley Farm',
                location: mockProduct.location || 'Local Farm',
                rating: 4.8,
                verified: true,
                image:
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format&faces=crop',
                totalProducts: 15,
                yearsExperience: 8,
              },
              reviews: [
                {
                  id: 1,
                  customer: 'Priya Sharma',
                  rating: 5,
                  comment: 'Excellent quality! Very fresh and tasty.',
                  date: '2025-01-20',
                  verified: true,
                  helpful: 12,
                },
                {
                  id: 2,
                  customer: 'Amit Patel',
                  rating: 4,
                  comment: 'Good quality, reasonable price. Will order again.',
                  date: '2025-01-18',
                  verified: true,
                  helpful: 8,
                },
              ],
              nutritionFacts: mockProduct.nutritionFacts
                ? Object.entries(mockProduct.nutritionFacts).map(
                    ([name, value]) => ({
                      name: name.charAt(0).toUpperCase() + name.slice(1),
                      value:
                        typeof value === 'number'
                          ? `${value}${name === 'calories' ? '' : 'g'}`
                          : value,
                    })
                  )
                : [
                    { name: 'Calories', value: '18 per 100g' },
                    { name: 'Vitamin C', value: '14mg' },
                    { name: 'Potassium', value: '237mg' },
                    { name: 'Fiber', value: '1.2g' },
                  ],
            });

            // Get related products from mock data
            const related = mockProducts
              .filter(
                (p) =>
                  p.id !== parseInt(id) && p.category === mockProduct.category
              )
              .slice(0, 4);
            setRelatedProducts(related);
          } else {
            // If product not found in mock data either, show error
            setProduct(null);
            setError('Product not found');
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
        setError('Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    dispatch(
      addToCart({
        ...product,
        quantity,
        addedAt: new Date().toISOString(),
      })
    );

    setIsAddingToCart(false);
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const openLightbox = (index = 0) => {
    previousActiveElementRef.current = document.activeElement;
    setSelectedImage(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    // restore focus to previously focused element when lightbox closes
    const prev = previousActiveElementRef.current;
    if (prev && typeof prev.focus === 'function') prev.focus();
  };

  useEffect(() => {
    if (!showLightbox) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((s) => (s + 1) % product.gallery.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImage(
          (s) => (s - 1 + product.gallery.length) % product.gallery.length
        );
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showLightbox, product]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-secondary-50'>
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-secondary-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-24 h-24 mx-auto mb-6 bg-secondary-200 rounded-full flex items-center justify-center'>
            <svg
              className='w-12 h-12 text-secondary-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-secondary-900 mb-2'>
            {error || 'Product Not Found'}
          </h2>
          <p className='text-secondary-600 mb-6'>
            {error
              ? 'There was an error loading the product.'
              : "We couldn't find the product you're looking for."}
          </p>
          <div className='flex gap-3 justify-center'>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-700 transition-colors duration-200'
            >
              Try Again
            </button>
            <Link
              to='/products'
              className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200'
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-secondary-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Breadcrumb */}
        <nav
          className='flex items-center gap-2 mb-8 text-sm'
          aria-label='breadcrumb'
        >
          <Link
            to='/'
            className='text-secondary-600 hover:text-primary-600 transition-colors duration-200'
          >
            Home
          </Link>
          <svg
            className='w-4 h-4 text-secondary-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
          <Link
            to='/products'
            className='text-secondary-600 hover:text-primary-600 transition-colors duration-200'
          >
            Products
          </Link>
          <svg
            className='w-4 h-4 text-secondary-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5l7 7-7 7'
            />
          </svg>
          <span className='text-secondary-900 font-medium'>{product.name}</span>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          {/* Image Gallery */}
          <div className='space-y-4'>
            <div className='aspect-square bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden'>
              <button
                type='button'
                onClick={() => openLightbox(selectedImage)}
                className='w-full h-full block text-left'
                aria-label={`Open gallery for ${product.name}`}
              >
                <img
                  src={product.gallery[selectedImage]}
                  alt={product.name}
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                />
              </button>
            </div>
            <div className='grid grid-cols-4 gap-2'>
              {product.gallery.map((image, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => setSelectedImage(index)}
                  aria-pressed={selectedImage === index}
                  aria-label={`${product.name} view ${index + 1}`}
                  className={`aspect-square rounded-lg overflow-hidden border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 transition-colors duration-200 ${
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className='space-y-6'>
            {/* Product Title and Rating */}
            <div>
              <div className='flex items-center gap-2 mb-2'>
                {product.isOrganic && (
                  <span className='inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>
                    🌱 Organic
                  </span>
                )}
                <span className='inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
                  {product.freshness}
                </span>
              </div>
              <h1 className='text-3xl lg:text-4xl font-bold text-secondary-900 mb-4'>
                {product.name}
              </h1>
              <div className='flex items-center gap-4 mb-4'>
                <StarRating rating={product.rating} size='lg' />
                <span className='text-sm text-secondary-600'>
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-primary-600'>
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className='text-xl text-secondary-400 line-through'>
                  ₹{product.originalPrice}
                </span>
              )}
              <span className='text-lg text-secondary-600'>
                / {product.unit}
              </span>
              {product.originalPrice && (
                <span className='inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full'>
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className='flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span
                className={`font-medium ${
                  product.stock > 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} ${product.unit} available)`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div>
              <p className='text-secondary-700 leading-relaxed mb-4'>
                {showFullDescription
                  ? product.description
                  : `${product.description.slice(0, 150)}${product.description.length > 150 ? '...' : ''}`}
                {product.description.length > 150 && (
                  <button
                    type='button'
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className='text-primary-600 hover:text-primary-700 font-medium ml-2'
                    aria-expanded={showFullDescription}
                    aria-controls='product-full-description'
                    title={showFullDescription ? 'Show less' : 'Read more'}
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </p>

              {/* Features */}
              <div className='space-y-2'>
                {product.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <svg
                      className='w-5 h-5 text-green-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    <span className='text-sm text-secondary-700'>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className='bg-white rounded-lg border border-secondary-200 p-4'>
              <label className='block text-sm font-medium text-secondary-700 mb-3'>
                Quantity
              </label>
              <div className='flex items-center gap-4'>
                <div className='flex items-center border border-secondary-300 rounded-lg'>
                  <button
                    type='button'
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className='p-2 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                    aria-label='Decrease quantity'
                    title='Decrease quantity'
                  >
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
                        d='M20 12H4'
                      />
                    </svg>
                  </button>
                  <input
                    type='number'
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    min='1'
                    max={product.stock}
                    className='w-16 text-center border-0 focus:ring-0'
                    aria-label='Product quantity'
                  />
                  <button
                    type='button'
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className='p-2 hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                    aria-label='Increase quantity'
                    title='Increase quantity'
                  >
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
                  </button>
                </div>
                <span className='text-secondary-600'>{product.unit}</span>
                <div className='text-right'>
                  <div className='text-sm text-secondary-600'>Total</div>
                  <div className='text-lg font-semibold text-secondary-900'>
                    ₹{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <button
                type='button'
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  product.stock === 0
                    ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                    : isAddingToCart
                      ? 'bg-primary-500 text-white cursor-wait'
                      : 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                } shadow-lg`}
                aria-busy={isAddingToCart}
                aria-label={
                  product.stock === 0 ? 'Out of stock' : 'Add to cart'
                }
              >
                {isAddingToCart ? (
                  <div className='flex items-center justify-center gap-2'>
                    <svg
                      className='w-5 h-5 animate-spin'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    Adding...
                  </div>
                ) : cartItem ? (
                  `In Cart (${cartItem.quantity})`
                ) : (
                  'Add to Cart'
                )}
              </button>

              <button
                type='button'
                onClick={handleWishlistToggle}
                className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                  isInWishlist
                    ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                    : 'border-secondary-300 text-secondary-700 hover:border-secondary-400 hover:bg-secondary-50'
                }`}
                aria-pressed={isInWishlist}
                aria-label={
                  isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                <svg
                  className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
                  fill='none'
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
            </div>

            {/* Social Share */}
            <div className='mt-6'>
              <SocialShare
                title={product.name}
                description={product.description}
                url={window.location.href}
                image={product.images?.[0]}
              />
            </div>

            {/* Farmer Information */}
            <div className='bg-white rounded-xl border border-secondary-200 p-6'>
              <h3 className='text-lg font-semibold text-secondary-900 mb-4'>
                Sold by
              </h3>
              <div className='flex items-start gap-4'>
                <img
                  src={product.farmer.image}
                  alt={product.farmer.name}
                  className='w-16 h-16 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <h4 className='font-semibold text-secondary-900'>
                      {product.farmer.name}
                    </h4>
                    {product.farmer.verified && (
                      <svg
                        className='w-5 h-5 text-blue-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                  <p className='text-secondary-600 mb-2'>
                    {product.farmer.farm}, {product.farmer.location}
                  </p>
                  <div className='flex items-center gap-4 text-sm'>
                    <StarRating rating={product.farmer.rating} size='sm' />
                    <span className='text-secondary-600'>
                      {product.farmer.totalProducts} products
                    </span>
                    <span className='text-secondary-600'>
                      {product.farmer.yearsExperience} years exp.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className='bg-white rounded-xl border border-secondary-200 overflow-hidden'>
          <div className='border-b border-secondary-200'>
            <nav
              className='flex'
              role='tablist'
              aria-label='Product details tabs'
            >
              {[
                { id: 'description', label: 'Description' },
                { id: 'nutrition', label: 'Nutrition Facts' },
                { id: 'reviews', label: `Reviews (${product.reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type='button'
                  role='tab'
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tab-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className='p-6'>
            {activeTab === 'description' && (
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-secondary-900 mb-3'>
                    Product Description
                  </h3>
                  <p className='text-secondary-700 leading-relaxed'>
                    {product.description}
                  </p>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-secondary-900 mb-3'>
                    Key Features
                  </h3>
                  <ul className='space-y-2'>
                    {product.features.map((feature, index) => (
                      <li key={index} className='flex items-center gap-3'>
                        <svg
                          className='w-5 h-5 text-green-500'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                        <span className='text-secondary-700'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className='text-lg font-semibold text-secondary-900 mb-4'>
                  Nutrition Facts
                </h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {product.nutritionFacts.map((fact, index) => (
                    <div
                      key={index}
                      className='bg-secondary-50 rounded-lg p-4 text-center'
                    >
                      <div className='text-lg font-semibold text-secondary-900'>
                        {fact.value}
                      </div>
                      <div className='text-sm text-secondary-600'>
                        {fact.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewSystem
                productId={product.id}
                productName={product.name}
                existingReviews={product.reviews}
                averageRating={product.rating}
                totalReviews={product.reviewCount}
              />
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className='mt-16 border-t border-secondary-200 pt-16'>
          <div className='max-w-7xl mx-auto px-4'>
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-bold text-secondary-900 mb-2'>
                You might also like
              </h2>
              <p className='text-secondary-600'>
                Similar products from the same category
              </p>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden'
                >
                  <Link to={`/products/${relatedProduct.id}`} className='block'>
                    <div className='aspect-square overflow-hidden'>
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className='w-full h-full object-cover hover:scale-105 transition-transform duration-200'
                      />
                    </div>
                    <div className='p-4'>
                      <h3 className='font-semibold text-secondary-900 mb-1 line-clamp-2'>
                        {relatedProduct.name}
                      </h3>
                      <p className='text-sm text-secondary-600 mb-2'>
                        by{' '}
                        {typeof relatedProduct.farmer === 'string'
                          ? relatedProduct.farmer
                          : relatedProduct.farmer?.name}
                      </p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-lg font-bold text-primary-600'>
                            ₹{relatedProduct.price}
                          </span>
                          {relatedProduct.originalPrice && (
                            <span className='text-sm text-secondary-500 line-through'>
                              ₹{relatedProduct.originalPrice}
                            </span>
                          )}
                        </div>
                        {relatedProduct.rating && (
                          <div className='flex items-center gap-1'>
                            <span className='text-yellow-400'>★</span>
                            <span className='text-sm text-secondary-600'>
                              {relatedProduct.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox modal */}
      {showLightbox && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-60 bg-black bg-opacity-70 flex items-center justify-center p-4'
        >
          <div className='relative max-w-4xl w-full'>
            <button
              type='button'
              onClick={closeLightbox}
              className='absolute top-2 right-2 p-2 text-white bg-black bg-opacity-30 rounded'
              aria-label='Close image preview'
            >
              ✕
            </button>

            <div className='bg-black rounded'>
              <img
                src={product.gallery[selectedImage]}
                alt={`${product.name} view ${selectedImage + 1}`}
                className='w-full h-[70vh] object-contain'
              />
            </div>

            <div className='absolute inset-x-0 top-1/2 flex items-center justify-between pointer-events-none'>
              <button
                type='button'
                onClick={() =>
                  setSelectedImage(
                    (s) =>
                      (s - 1 + product.gallery.length) % product.gallery.length
                  )
                }
                className='pointer-events-auto text-white p-3 bg-black bg-opacity-30 rounded-l'
                aria-label='Previous image'
              >
                ‹
              </button>
              <button
                type='button'
                onClick={() =>
                  setSelectedImage((s) => (s + 1) % product.gallery.length)
                }
                className='pointer-events-auto text-white p-3 bg-black bg-opacity-30 rounded-r'
                aria-label='Next image'
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
