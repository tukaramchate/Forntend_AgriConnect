import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
} from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import {
  Button,
  Card,
  CardBody,
  Badge,
  Modal,
  Alert,
  Breadcrumb,
} from '../components/ui';
import productAPI from '../api/productApi';
import mockProducts from '../data/products';
import '../styles/design-system.css';

const ProductDetailsEnhanced = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const { items: cartItems } = useSelector(
    (state) => state.cart || { items: [] }
  );
  const { items: wishlistItems } = useSelector(
    (state) => state.wishlist || { items: [] }
  );

  // Product images - use existing images array or create variants
  const productImages =
    product?.images?.length > 0
      ? product.images
      : [
          product?.image,
          product?.image?.replace('w=600', 'w=601'), // Slightly different versions
          product?.image?.replace('w=600', 'w=602'),
          product?.image?.replace('w=600', 'w=603'),
          product?.image?.replace('w=600', 'w=604'),
        ].filter(Boolean);

  // Mock nutritional information
  const nutritionalInfo = {
    calories: '25 per 100g',
    protein: '2.6g',
    carbs: '4.8g',
    fiber: '2.8g',
    vitamins: ['Vitamin C', 'Vitamin K', 'Folate'],
    minerals: ['Potassium', 'Iron', 'Magnesium'],
  };

  // Mock sustainability badges
  const sustainabilityBadges = [
    { label: 'Organic Certified', icon: '🌱', color: 'success' },
    { label: 'Carbon Neutral', icon: '🌍', color: 'info' },
    { label: 'Water Efficient', icon: '💧', color: 'info' },
    { label: 'Local Sourced', icon: '📍', color: 'warning' },
  ];

  // Mock farmer story
  const farmerStory = {
    name: 'Ramesh Kumar',
    experience: '20+ years',
    location: 'Punjab, India',
    specialty: 'Organic Vegetables',
    story:
      'I have been practicing organic farming for over two decades. My family has been farming this land for generations, and we believe in sustainable practices that not only produce the best quality vegetables but also preserve our soil for future generations.',
    achievements: [
      'Organic Certification',
      'Best Farmer Award 2023',
      'Sustainable Farming Pioneer',
    ],
    image:
      'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&h=300&fit=crop&auto=format',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try API first, fallback to mock data
        try {
          const response = await productAPI.getProduct(id);
          const productData = response.data;
          setProduct(productData);

          // Fetch related products
          const relatedResponse = await productAPI.getRelatedProducts(
            productData.category,
            id
          );
          setRelatedProducts(relatedResponse.data || []);
        } catch (apiError) {
          console.warn('API call failed, using mock data:', apiError);
          const mockProduct = mockProducts.find((p) => p.id === parseInt(id));
          if (mockProduct) {
            // Adapt mock product structure to match component expectations
            const adaptedProduct = {
              ...mockProduct,
              image: mockProduct.images?.[0] || mockProduct.image,
              unit: 'kg', // Default unit
              freshness: 'Fresh',
              isOrganic: mockProduct.organic || false,
            };
            setProduct(adaptedProduct);
            // Get related products from same category
            const related = mockProducts
              .filter(
                (p) =>
                  p.category === adaptedProduct.category &&
                  p.id !== adaptedProduct.id
              )
              .slice(0, 4)
              .map((p) => ({
                ...p,
                image: p.images?.[0] || p.image,
                unit: 'kg',
                freshness: 'Fresh',
                isOrganic: p.organic || false,
              }));
            setRelatedProducts(related);
          } else {
            throw new Error('Product not found');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          farmer: product.farmer,
          unit: product.unit,
        })
      );
    }
  };

  const handleWishlistToggle = () => {
    const isInWishlist = wishlistItems.some((item) => item.id === product?.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          farmer: product.farmer,
        })
      );
    }
  };

  const handleImageHover = (e) => {
    if (!isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // In production, submit review to API
    console.log('Review submitted:', newReview);
    setIsReviewModalOpen(false);
    setNewReview({ rating: 5, comment: '' });
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    {
      label: product?.category,
      href: `/categories/${product?.category?.toLowerCase()}`,
    },
    { label: product?.name },
  ];

  if (isLoading) {
    return (
      <div
        className='min-h-screen'
        style={{ backgroundColor: 'var(--neutral-50)' }}
      >
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        className='min-h-screen'
        style={{ backgroundColor: 'var(--neutral-50)' }}
      >
        <div className='container py-12'>
          <Alert variant='error' className='max-w-2xl mx-auto'>
            <div className='text-center'>
              <h2 className='font-semibold mb-2'>Product Not Found</h2>
              <p className='mb-4'>
                {error || 'The requested product could not be found.'}
              </p>
              <Link to='/products'>
                <Button variant='primary'>Browse Products</Button>
              </Link>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  const isInCart = cartItems.some((item) => item.id === product.id);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  return (
    <main
      className='min-h-screen'
      style={{ backgroundColor: 'var(--neutral-50)' }}
    >
      <div className='container py-8'>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className='mb-8' />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12'>
          {/* Image Gallery */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div className='relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg'>
              <img
                ref={imageRef}
                src={productImages[selectedImageIndex] || product.image}
                alt={product.name}
                className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : {}
                }
                onClick={() => setIsLightboxOpen(true)}
                onMouseMove={handleImageHover}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              />

              {/* Image Controls */}
              <div className='absolute top-4 right-4 flex gap-2'>
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className='p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors'
                  title='Fullscreen view'
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
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className='p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors'
                  title='Zoom'
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
                      d='M15 15l5 5m-5-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </button>
              </div>

              {/* 360° Badge */}
              <div className='absolute top-4 left-4'>
                <Badge variant='info' className='text-xs'>
                  360° View
                </Badge>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className='grid grid-cols-5 gap-2'>
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-primary-500 shadow-md'
                      : 'border-neutral-200 hover:border-primary-300'
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
            {/* Title and Rating */}
            <div>
              <div className='flex items-start justify-between mb-2'>
                <h1
                  className='text-3xl font-bold'
                  style={{ color: 'var(--neutral-900)' }}
                >
                  {product.name}
                </h1>
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-lg transition-colors ${
                    isInWishlist
                      ? 'text-red-500 bg-red-50 hover:bg-red-100'
                      : 'text-neutral-400 bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  <svg
                    className='w-6 h-6'
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
              </div>

              <div className='flex items-center gap-4 mb-4'>
                <div className='flex items-center gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-neutral-300'
                      }`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                  <span
                    className='ml-2 text-sm'
                    style={{ color: 'var(--neutral-600)' }}
                  >
                    {product.rating} ({Math.floor(Math.random() * 50) + 10}{' '}
                    reviews)
                  </span>
                </div>
                <Badge variant='success'>{product.freshness}</Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className='flex items-center gap-4'>
              <div
                className='text-3xl font-bold'
                style={{ color: 'var(--primary-600)' }}
              >
                ₹{product.price}
                <span
                  className='text-base font-normal ml-1'
                  style={{ color: 'var(--neutral-600)' }}
                >
                  per {product.unit}
                </span>
              </div>
              {product.originalPrice && (
                <div
                  className='text-lg line-through'
                  style={{ color: 'var(--neutral-400)' }}
                >
                  ₹{product.originalPrice}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className='flex flex-wrap gap-2'>
              {product.isOrganic && <Badge variant='success'>Organic</Badge>}
              {product.inStock && <Badge variant='info'>In Stock</Badge>}
              {sustainabilityBadges.map((badge, index) => (
                <Badge key={index} variant={badge.color} className='text-xs'>
                  {badge.icon} {badge.label}
                </Badge>
              ))}
            </div>

            {/* Short Description */}
            <div>
              <p
                style={{
                  color: 'var(--neutral-700)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                {showFullDescription
                  ? product.description
                  : `${product.description?.slice(0, 150)}...`}
                {product.description?.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className='ml-2 text-primary-600 hover:text-primary-700 font-medium'
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <label
                  className='font-medium'
                  style={{ color: 'var(--neutral-700)' }}
                >
                  Quantity:
                </label>
                <div
                  className='flex items-center border rounded-lg'
                  style={{ borderColor: 'var(--neutral-300)' }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='p-2 hover:bg-neutral-100 transition-colors'
                  >
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
                        d='M20 12H4'
                      />
                    </svg>
                  </button>
                  <span className='px-4 py-2 font-medium'>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className='p-2 hover:bg-neutral-100 transition-colors'
                  >
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
                        d='M12 4v16m8-8H4'
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className='flex gap-4'>
                <Button
                  onClick={handleAddToCart}
                  variant='primary'
                  size='lg'
                  className='flex-1'
                  disabled={!product.inStock}
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h7a1 1 0 001-1v-6m-8 0V9a1 1 0 011-1h6a1 1 0 011 1v4.01'
                    />
                  </svg>
                  {isInCart ? 'Update Cart' : 'Add to Cart'}
                </Button>

                <Button variant='outline' size='lg'>
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Farmer Info Card */}
            <Card className='p-4'>
              <div className='flex items-center gap-4'>
                <img
                  src={farmerStory.image}
                  alt={farmerStory.name}
                  className='w-16 h-16 rounded-full object-cover'
                />
                <div>
                  <div
                    className='font-semibold'
                    style={{ color: 'var(--neutral-900)' }}
                  >
                    {farmerStory.name}
                  </div>
                  <div
                    className='text-sm'
                    style={{ color: 'var(--neutral-600)' }}
                  >
                    {farmerStory.experience} • {farmerStory.location}
                  </div>
                  <Badge variant='warning' className='text-xs mt-1'>
                    {farmerStory.specialty}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className='mb-12'>
          <div
            className='border-b'
            style={{ borderColor: 'var(--neutral-200)' }}
          >
            <div className='flex gap-8'>
              {[
                { id: 'description', label: 'Description' },
                { id: 'nutrition', label: 'Nutrition Info' },
                { id: 'farmer', label: 'Farmer Story' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'shipping', label: 'Shipping & Returns' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className='py-8'>
            {selectedTab === 'description' && (
              <div className='prose max-w-none'>
                <h3 className='text-xl font-semibold mb-4'>
                  Product Description
                </h3>
                <p
                  className='mb-4'
                  style={{
                    color: 'var(--neutral-700)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {product.description}
                </p>
                <p
                  className='mb-4'
                  style={{
                    color: 'var(--neutral-700)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  This premium quality {product.name.toLowerCase()} is carefully
                  selected and harvested at the perfect time to ensure maximum
                  freshness and nutritional value. Our farmers use sustainable
                  farming practices that respect the environment while producing
                  the highest quality produce.
                </p>
                <h4 className='font-semibold mb-2'>Key Features:</h4>
                <ul
                  className='list-disc pl-6 space-y-1'
                  style={{ color: 'var(--neutral-700)' }}
                >
                  <li>Farm fresh and naturally grown</li>
                  <li>Harvested at peak ripeness</li>
                  <li>Carefully handled and packaged</li>
                  <li>Direct from farmer to your table</li>
                  <li>100% quality guaranteed</li>
                </ul>
              </div>
            )}

            {selectedTab === 'nutrition' && (
              <div>
                <h3 className='text-xl font-semibold mb-6'>
                  Nutritional Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <Card className='p-6'>
                    <h4 className='font-semibold mb-4'>Per 100g Serving</h4>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span>Calories</span>
                        <span className='font-medium'>
                          {nutritionalInfo.calories}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Protein</span>
                        <span className='font-medium'>
                          {nutritionalInfo.protein}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Carbohydrates</span>
                        <span className='font-medium'>
                          {nutritionalInfo.carbs}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Dietary Fiber</span>
                        <span className='font-medium'>
                          {nutritionalInfo.fiber}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className='p-6'>
                    <h4 className='font-semibold mb-4'>Vitamins & Minerals</h4>
                    <div className='space-y-4'>
                      <div>
                        <h5
                          className='text-sm font-medium mb-2'
                          style={{ color: 'var(--neutral-700)' }}
                        >
                          Rich in Vitamins:
                        </h5>
                        <div className='flex flex-wrap gap-2'>
                          {nutritionalInfo.vitamins.map((vitamin, index) => (
                            <Badge
                              key={index}
                              variant='success'
                              className='text-xs'
                            >
                              {vitamin}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5
                          className='text-sm font-medium mb-2'
                          style={{ color: 'var(--neutral-700)' }}
                        >
                          Essential Minerals:
                        </h5>
                        <div className='flex flex-wrap gap-2'>
                          {nutritionalInfo.minerals.map((mineral, index) => (
                            <Badge
                              key={index}
                              variant='info'
                              className='text-xs'
                            >
                              {mineral}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {selectedTab === 'farmer' && (
              <div>
                <h3 className='text-xl font-semibold mb-6'>Meet Your Farmer</h3>
                <Card className='p-6'>
                  <div className='flex flex-col md:flex-row gap-6'>
                    <img
                      src={farmerStory.image}
                      alt={farmerStory.name}
                      className='w-32 h-32 rounded-full object-cover mx-auto md:mx-0'
                    />
                    <div className='flex-1'>
                      <h4 className='text-xl font-semibold mb-2'>
                        {farmerStory.name}
                      </h4>
                      <div className='flex flex-wrap gap-2 mb-4'>
                        <Badge variant='warning'>
                          {farmerStory.experience}
                        </Badge>
                        <Badge variant='info'>📍 {farmerStory.location}</Badge>
                        <Badge variant='success'>{farmerStory.specialty}</Badge>
                      </div>
                      <p
                        className='mb-4'
                        style={{
                          color: 'var(--neutral-700)',
                          lineHeight: 'var(--leading-relaxed)',
                        }}
                      >
                        {farmerStory.story}
                      </p>
                      <div>
                        <h5 className='font-semibold mb-2'>Achievements:</h5>
                        <div className='flex flex-wrap gap-2'>
                          {farmerStory.achievements.map(
                            (achievement, index) => (
                              <Badge
                                key={index}
                                variant='success'
                                className='text-xs'
                              >
                                🏆 {achievement}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-xl font-semibold'>Customer Reviews</h3>
                  {isAuthenticated && (
                    <Button
                      onClick={() => setIsReviewModalOpen(true)}
                      variant='outline'
                    >
                      Write a Review
                    </Button>
                  )}
                </div>

                {/* Mock Reviews */}
                <div className='space-y-6'>
                  {[
                    {
                      name: 'Priya Sharma',
                      rating: 5,
                      date: '2 days ago',
                      comment:
                        'Excellent quality! Very fresh and exactly as described. Will definitely order again.',
                      verified: true,
                    },
                    {
                      name: 'Rajesh Kumar',
                      rating: 4,
                      date: '1 week ago',
                      comment:
                        'Good product, delivered on time. Packaging could be better but overall satisfied.',
                      verified: true,
                    },
                    {
                      name: 'Anita Gupta',
                      rating: 5,
                      date: '2 weeks ago',
                      comment:
                        'Amazing freshness! You can really taste the difference when it comes directly from the farm.',
                      verified: true,
                    },
                  ].map((review, index) => (
                    <Card key={index} className='p-6'>
                      <div className='flex justify-between items-start mb-3'>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='font-medium'>{review.name}</span>
                            {review.verified && (
                              <Badge variant='success' className='text-xs'>
                                ✓ Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className='flex items-center gap-2'>
                            <div className='flex'>
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400'
                                      : 'text-neutral-300'
                                  }`}
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                </svg>
                              ))}
                            </div>
                            <span
                              className='text-sm'
                              style={{ color: 'var(--neutral-500)' }}
                            >
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p style={{ color: 'var(--neutral-700)' }}>
                        {review.comment}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'shipping' && (
              <div>
                <h3 className='text-xl font-semibold mb-6'>
                  Shipping & Returns
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <Card className='p-6'>
                    <h4 className='font-semibold mb-4 flex items-center gap-2'>
                      <svg
                        className='w-5 h-5'
                        style={{ color: 'var(--primary-500)' }}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                        />
                      </svg>
                      Shipping Information
                    </h4>
                    <div
                      className='space-y-3 text-sm'
                      style={{ color: 'var(--neutral-700)' }}
                    >
                      <div className='flex justify-between'>
                        <span>Same Day Delivery:</span>
                        <span className='font-medium'>₹50 (within 25km)</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Next Day Delivery:</span>
                        <span className='font-medium'>₹30 (within 50km)</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Standard Delivery:</span>
                        <span className='font-medium'>₹20 (2-3 days)</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Free Shipping:</span>
                        <span className='font-medium'>Orders above ₹500</span>
                      </div>
                    </div>
                  </Card>

                  <Card className='p-6'>
                    <h4 className='font-semibold mb-4 flex items-center gap-2'>
                      <svg
                        className='w-5 h-5'
                        style={{ color: 'var(--success-500)' }}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                        />
                      </svg>
                      Return Policy
                    </h4>
                    <div
                      className='space-y-3 text-sm'
                      style={{ color: 'var(--neutral-700)' }}
                    >
                      <p>• 100% satisfaction guarantee</p>
                      <p>• Free returns within 24 hours of delivery</p>
                      <p>• Full refund for quality issues</p>
                      <p>• Easy return process - just call us</p>
                      <p>• Fresh produce quality assured</p>
                    </div>
                  </Card>
                </div>

                <div
                  className='mt-8 p-6 rounded-lg'
                  style={{ backgroundColor: 'var(--info-50)' }}
                >
                  <h4
                    className='font-semibold mb-2 flex items-center gap-2'
                    style={{ color: 'var(--info-700)' }}
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
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    Fresh Guarantee
                  </h4>
                  <p className='text-sm' style={{ color: 'var(--info-700)' }}>
                    All our produce is harvested fresh and delivered within
                    24-48 hours. If you're not completely satisfied with the
                    freshness and quality, we'll provide a full refund or
                    replacement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2
              className='text-2xl font-bold mb-8'
              style={{ color: 'var(--neutral-900)' }}
            >
              Related Products
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Image Lightbox Modal */}
      <Modal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title='Product Gallery'
        size='xl'
      >
        <div className='space-y-4'>
          <img
            src={productImages[selectedImageIndex] || product.image}
            alt={product.name}
            className='w-full h-96 object-contain rounded-lg'
          />
          <div className='grid grid-cols-5 gap-2'>
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square rounded border-2 overflow-hidden ${
                  selectedImageIndex === index
                    ? 'border-primary-500'
                    : 'border-neutral-200'
                }`}
              >
                <img
                  src={image}
                  alt=''
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title='Write a Review'
      >
        <form onSubmit={handleReviewSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Rating</label>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type='button'
                  onClick={() => setNewReview((prev) => ({ ...prev, rating }))}
                  className={`w-8 h-8 ${
                    rating <= newReview.rating
                      ? 'text-yellow-400'
                      : 'text-neutral-300'
                  }`}
                >
                  <svg
                    className='w-full h-full'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              className='input min-h-[100px] resize-y'
              placeholder='Share your experience with this product...'
              required
            />
          </div>
          <div className='flex gap-4'>
            <Button type='submit' variant='primary'>
              Submit Review
            </Button>
            <Button
              type='button'
              onClick={() => setIsReviewModalOpen(false)}
              variant='outline'
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default ProductDetailsEnhanced;
