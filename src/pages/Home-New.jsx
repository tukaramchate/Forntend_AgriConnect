import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import Loader, { CardSkeleton } from '../components/Loader';
import { Button, Card, CardBody, Badge } from '../components/ui';
import '../styles/design-system.css';

// Mock data for development - TODO: Replace with API calls
const mockProducts = [
  {
    id: 1,
    name: 'Fresh Organic Tomatoes',
    price: 45,
    originalPrice: 60,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format',
    rating: 4.5,
    description:
      'Fresh organic tomatoes grown without pesticides from local farms',
    category: 'Vegetables',
    farmer: 'Ramesh Kumar',
    unit: 'kg',
    inStock: true,
    isOrganic: true,
    freshness: 'Fresh Today',
  },
  {
    id: 2,
    name: 'Sweet Golden Corn',
    price: 30,
    image:
      'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop&auto=format',
    rating: 4.2,
    description: 'Sweet and juicy corn perfect for grilling or boiling',
    category: 'Vegetables',
    farmer: 'Sunita Devi',
    unit: 'kg',
    inStock: true,
    isOrganic: false,
    freshness: 'Harvested Today',
  },
  {
    id: 3,
    name: 'Pure Farm Fresh Milk',
    price: 60,
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format',
    rating: 4.8,
    description: 'Pure farm fresh milk from grass-fed cows',
    category: 'Dairy',
    farmer: 'Gopal Singh',
    unit: 'liter',
    inStock: true,
    isOrganic: true,
    freshness: 'Fresh Morning',
  },
  {
    id: 4,
    name: 'Organic Red Apples',
    price: 120,
    originalPrice: 150,
    image:
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format',
    rating: 4.6,
    description: 'Crisp organic apples from the valleys of Kashmir',
    category: 'Fruits',
    farmer: 'Mohammad Ali',
    unit: 'kg',
    inStock: true,
    isOrganic: true,
    freshness: 'Premium Quality',
  },
  {
    id: 5,
    name: 'Fresh Spinach Leaves',
    price: 25,
    image:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop&auto=format',
    rating: 4.3,
    description: 'Nutrient-rich spinach leaves perfect for salads and cooking',
    category: 'Vegetables',
    farmer: 'Lakshmi Reddy',
    unit: 'bunch',
    inStock: true,
    isOrganic: true,
    freshness: 'Harvested This Morning',
  },
  {
    id: 6,
    name: 'Organic Honey',
    price: 350,
    image:
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&auto=format',
    rating: 4.9,
    description: 'Pure organic honey from free-range beehives',
    category: 'Organic',
    farmer: 'Vikram Bee Farm',
    unit: '500g jar',
    inStock: true,
    isOrganic: true,
    freshness: 'Fresh Harvest',
  },
  {
    id: 7,
    name: 'Farm Fresh Eggs',
    price: 80,
    image:
      'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&h=300&fit=crop&auto=format',
    rating: 4.7,
    description: 'Free-range chicken eggs from happy, healthy hens',
    category: 'Dairy',
    farmer: 'Green Valley Farm',
    unit: 'dozen',
    inStock: true,
    isOrganic: false,
    freshness: 'Fresh Daily',
  },
  {
    id: 8,
    name: 'Organic Carrots',
    price: 40,
    image:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop&auto=format',
    rating: 4.4,
    description: 'Sweet and crunchy organic carrots perfect for snacking',
    category: 'Vegetables',
    farmer: "Nature's Best Farm",
    unit: 'kg',
    inStock: true,
    isOrganic: true,
    freshness: 'Garden Fresh',
  },
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    {
      id: 1,
      name: 'Vegetables',
      icon: '🥕',
      count: 45,
      description: 'Fresh local vegetables',
      color: 'from-green-400 to-green-600',
    },
    {
      id: 2,
      name: 'Fruits',
      icon: '🍎',
      count: 32,
      description: 'Seasonal fresh fruits',
      color: 'from-red-400 to-red-600',
    },
    {
      id: 3,
      name: 'Dairy',
      icon: '🥛',
      count: 18,
      description: 'Farm fresh dairy products',
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 4,
      name: 'Grains',
      icon: '🌾',
      count: 23,
      description: 'Organic grains & cereals',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      id: 5,
      name: 'Organic',
      icon: '🌱',
      count: 56,
      description: 'Certified organic produce',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      id: 6,
      name: 'Herbs',
      icon: '🌿',
      count: 28,
      description: 'Fresh aromatic herbs',
      color: 'from-lime-400 to-lime-600',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'AgriConnect has completely changed how I shop for groceries. The freshness and quality is unmatched!',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b96b2c8b?w=64&h=64&fit=crop&auto=format',
    },
    {
      id: 2,
      name: 'Rajesh Patel',
      location: 'Delhi',
      text: "Supporting local farmers while getting the freshest produce - it's a win-win situation.",
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&auto=format',
    },
    {
      id: 3,
      name: 'Anita Kumar',
      location: 'Bangalore',
      text: 'The farmer stories and transparency about sourcing makes me feel connected to my food.',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format',
    },
  ];

  const farmerSpotlights = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      location: 'Punjab',
      specialty: 'Organic Vegetables',
      image:
        'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&h=300&fit=crop&auto=format',
      description: '20+ years of organic farming experience',
      products: ['Tomatoes', 'Peppers', 'Cucumbers'],
    },
    {
      id: 2,
      name: 'Sunita Devi',
      location: 'Haryana',
      specialty: 'Dairy Products',
      image:
        'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=300&h=300&fit=crop&auto=format',
      description: 'Traditional dairy farming with modern techniques',
      products: ['Fresh Milk', 'Yogurt', 'Cheese'],
    },
    {
      id: 3,
      name: 'Mohammad Ali',
      location: 'Kashmir',
      specialty: 'Premium Fruits',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format',
      description: 'High-altitude fruit cultivation specialist',
      products: ['Apples', 'Walnuts', 'Saffron'],
    },
  ];

  const { isAuthenticated } = useSelector((state) => state.auth || {});

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturedProducts(mockProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading) {
    return (
      <div
        className='min-h-screen'
        style={{ backgroundColor: 'var(--neutral-50)' }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <main className='min-h-screen' role='main'>
      {/* Hero Section */}
      <section
        className='relative overflow-hidden'
        style={{
          background:
            'linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%)',
        }}
      >
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div
            className='absolute top-10 left-10 w-20 h-20 rounded-full opacity-10 animate-pulse'
            style={{ backgroundColor: 'var(--primary-500)' }}
          ></div>
          <div
            className='absolute bottom-10 right-10 w-32 h-32 rounded-full opacity-10 animate-pulse'
            style={{ backgroundColor: 'var(--secondary-500)' }}
          ></div>
          <div
            className='absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-10 animate-pulse delay-1000'
            style={{ backgroundColor: 'var(--primary-600)' }}
          ></div>
        </div>

        <div className='container relative py-20 lg:py-32'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Hero Content */}
            <div className='text-center lg:text-left'>
              <Badge variant='success' className='mb-6 text-base px-4 py-2'>
                🌱 Farm Fresh & Organic
              </Badge>

              <h1
                className='text-5xl lg:text-6xl font-bold mb-6'
                style={{
                  color: 'var(--neutral-900)',
                  lineHeight: 'var(--leading-tight)',
                }}
              >
                Fresh From
                <span className='block' style={{ color: 'var(--primary-500)' }}>
                  Farm to Table
                </span>
              </h1>

              <p
                className='text-xl mb-8'
                style={{
                  color: 'var(--neutral-600)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                Connect directly with local farmers and get fresh, organic
                produce delivered to your doorstep. Supporting farmers, serving
                freshness.
              </p>

              {/* Hero Features */}
              <div className='flex flex-wrap justify-center lg:justify-start gap-4 mb-8'>
                {[
                  { icon: '🌿', text: 'Organic & Fresh' },
                  { icon: '🚛', text: 'Fast Delivery' },
                  { icon: '💰', text: 'Fair Prices' },
                  { icon: '🤝', text: 'Direct from Farmers' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm'
                  >
                    <span className='text-lg'>{feature.icon}</span>
                    <span
                      className='text-sm font-medium'
                      style={{ color: 'var(--neutral-700)' }}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Link to='/products'>
                  <Button
                    variant='primary'
                    size='lg'
                    className='w-full sm:w-auto'
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
                        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z'
                      />
                    </svg>
                    Shop Now
                  </Button>
                </Link>
                <Link to='/about'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='w-full sm:w-auto'
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
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className='relative'>
              <div className='relative bg-white rounded-3xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500'>
                <img
                  src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&auto=format'
                  alt='Fresh vegetables and fruits from local farmers'
                  className='w-full h-80 lg:h-96 object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                <div className='absolute bottom-4 left-4 right-4'>
                  <div className='bg-white/90 backdrop-blur-sm rounded-lg p-4'>
                    <p
                      className='text-sm font-medium'
                      style={{ color: 'var(--neutral-900)' }}
                    >
                      ✨ Fresh delivery in 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div
                className='absolute -top-4 -left-4 text-white rounded-xl p-4 shadow-lg'
                style={{ backgroundColor: 'var(--primary-600)' }}
              >
                <div className='text-2xl font-bold'>500+</div>
                <div className='text-sm opacity-90'>Happy Farmers</div>
              </div>
              <div
                className='absolute -bottom-4 -right-4 text-white rounded-xl p-4 shadow-lg'
                style={{ backgroundColor: 'var(--secondary-500)' }}
              >
                <div className='text-2xl font-bold'>10K+</div>
                <div className='text-sm opacity-90'>Satisfied Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-20 bg-white'>
        <div className='container'>
          <div className='text-center mb-12'>
            <Badge variant='info' className='mb-4'>
              Fresh Categories
            </Badge>
            <h2
              className='text-4xl font-bold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              Shop by Category
            </h2>
            <p className='text-lg' style={{ color: 'var(--neutral-600)' }}>
              Discover fresh produce from various categories, all sourced
              directly from local farmers
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.name.toLowerCase()}`}
              >
                <Card className='text-center p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer'>
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className='text-3xl'>{category.icon}</span>
                  </div>
                  <h3
                    className='font-semibold mb-2'
                    style={{ color: 'var(--neutral-900)' }}
                  >
                    {category.name}
                  </h3>
                  <p
                    className='text-sm mb-2'
                    style={{ color: 'var(--neutral-600)' }}
                  >
                    {category.description}
                  </p>
                  <Badge variant='success' className='text-xs'>
                    {category.count} items
                  </Badge>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        className='py-20'
        style={{ backgroundColor: 'var(--neutral-50)' }}
      >
        <div className='container'>
          <div className='text-center mb-12'>
            <Badge variant='success' className='mb-4'>
              Best Sellers
            </Badge>
            <h2
              className='text-4xl font-bold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              Featured Products
            </h2>
            <p className='text-lg' style={{ color: 'var(--neutral-600)' }}>
              Discover our most popular and freshest products, hand-picked by
              our farmers
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          <div className='text-center'>
            <Link to='/products'>
              <Button variant='outline' size='lg'>
                Browse All Products
                <svg
                  className='w-5 h-5 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Farmer Spotlights Section */}
      <section className='py-20 bg-white'>
        <div className='container'>
          <div className='text-center mb-12'>
            <Badge variant='warning' className='mb-4'>
              Meet Our Farmers
            </Badge>
            <h2
              className='text-4xl font-bold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              Farmer Spotlights
            </h2>
            <p className='text-lg' style={{ color: 'var(--neutral-600)' }}>
              Get to know the dedicated farmers who bring you the freshest
              produce
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {farmerSpotlights.map((farmer) => (
              <Card key={farmer.id} className='overflow-hidden group'>
                <div className='relative h-48 overflow-hidden'>
                  <img
                    src={farmer.image}
                    alt={`${farmer.name} - ${farmer.specialty} farmer`}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
                  <Badge variant='success' className='absolute top-4 left-4'>
                    {farmer.specialty}
                  </Badge>
                </div>
                <CardBody>
                  <h3
                    className='text-xl font-bold mb-2'
                    style={{ color: 'var(--neutral-900)' }}
                  >
                    {farmer.name}
                  </h3>
                  <p
                    className='text-sm mb-2'
                    style={{ color: 'var(--neutral-500)' }}
                  >
                    📍 {farmer.location}
                  </p>
                  <p className='mb-4' style={{ color: 'var(--neutral-600)' }}>
                    {farmer.description}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {farmer.products.map((product, index) => (
                      <Badge key={index} variant='info' className='text-xs'>
                        {product}
                      </Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className='py-20'
        style={{ backgroundColor: 'var(--neutral-50)' }}
      >
        <div className='container'>
          <div className='text-center mb-12'>
            <Badge variant='info' className='mb-4'>
              Our Promise
            </Badge>
            <h2
              className='text-4xl font-bold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              Why Choose AgriConnect?
            </h2>
            <p className='text-lg' style={{ color: 'var(--neutral-600)' }}>
              We're committed to connecting you with the finest local produce
              while supporting our farming community
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              {
                icon: '🌾',
                title: 'Direct from Farmers',
                description:
                  'Cut out middlemen and get better prices. Support local farmers while getting the freshest produce.',
                highlight: 'Better Prices',
              },
              {
                icon: '🥬',
                title: 'Fresh & Organic',
                description:
                  'Fresh produce harvested and delivered within 24 hours. Certified organic options available.',
                highlight: '24-hour Fresh',
              },
              {
                icon: '🚚',
                title: 'Fast Delivery',
                description:
                  'Same-day delivery for local orders, next-day for nearby areas. Track your order in real-time.',
                highlight: 'Same-day Delivery',
              },
              {
                icon: '🛡️',
                title: 'Quality Assured',
                description:
                  'Every product is quality checked before delivery. 100% satisfaction guaranteed or money back.',
                highlight: '100% Guarantee',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className='text-center p-6 group hover:shadow-lg transition-all duration-300'
              >
                <div
                  className='w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300'
                  style={{ backgroundColor: 'var(--primary-100)' }}
                >
                  <span className='text-3xl'>{feature.icon}</span>
                </div>
                <h3
                  className='text-xl font-bold mb-2'
                  style={{ color: 'var(--neutral-900)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className='mb-4'
                  style={{
                    color: 'var(--neutral-600)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {feature.description}
                </p>
                <Badge variant='success' className='text-sm'>
                  {feature.highlight}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-white'>
        <div className='container'>
          <div className='text-center mb-12'>
            <Badge variant='warning' className='mb-4'>
              Happy Customers
            </Badge>
            <h2
              className='text-4xl font-bold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              What Our Customers Say
            </h2>
            <p className='text-lg' style={{ color: 'var(--neutral-600)' }}>
              Real reviews from satisfied customers across India
            </p>
          </div>

          <div className='max-w-4xl mx-auto'>
            <div className='relative overflow-hidden rounded-2xl'>
              <div
                className='flex transition-transform duration-500 ease-in-out'
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className='w-full flex-shrink-0'>
                    <Card className='p-8 text-center'>
                      <div className='flex justify-center mb-4'>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className='w-5 h-5 text-yellow-400'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                      <blockquote
                        className='text-xl mb-6'
                        style={{
                          color: 'var(--neutral-700)',
                          lineHeight: 'var(--leading-relaxed)',
                        }}
                      >
                        "{testimonial.text}"
                      </blockquote>
                      <div className='flex items-center justify-center'>
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className='w-12 h-12 rounded-full mr-4'
                        />
                        <div>
                          <div
                            className='font-semibold'
                            style={{ color: 'var(--neutral-900)' }}
                          >
                            {testimonial.name}
                          </div>
                          <div
                            className='text-sm'
                            style={{ color: 'var(--neutral-500)' }}
                          >
                            {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className='flex justify-center mt-6 space-x-2'>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide
                      ? 'bg-primary-500'
                      : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section
          className='py-20 text-white'
          style={{
            background:
              'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
          }}
        >
          <div className='container text-center'>
            <h2 className='text-4xl font-bold mb-4'>
              Ready to taste the freshness?
            </h2>
            <p className='text-xl mb-8 opacity-90'>
              Join thousands of satisfied customers who trust AgriConnect for
              their daily fresh produce needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/register'>
                <Button
                  variant='secondary'
                  size='lg'
                  className='bg-white text-primary-600 hover:bg-neutral-100'
                >
                  Get Started Today
                </Button>
              </Link>
              <Link to='/products'>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-white text-white hover:bg-white/10'
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;
