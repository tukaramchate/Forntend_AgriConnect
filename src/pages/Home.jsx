import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import Loader, { CardSkeleton } from '../components/Loader';
import { Button, Card, CardBody, Badge } from '../components/ui';
import { createMonitoredRoute } from '../components/PerformanceHOC';
import { seoData } from '../utils/seo';
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
];

const heroFeatures = [
  { icon: '🌿', text: 'Organic & Fresh' },
  { icon: '🚛', text: 'Fast Delivery' },
  { icon: '💰', text: 'Fair Prices' },
  { icon: '🤝', text: 'Direct from Farmers' },
];

const whyChooseUs = [
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
];

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate API call for featured products
    const fetchFeaturedProducts = async () => {
      try {
        // Simulate loading time
        await new Promise((resolve) => setTimeout(resolve, 800));
        setFeaturedProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className='min-h-screen' role='main'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full'></div>
          <div className='absolute bottom-10 right-10 w-32 h-32 bg-emerald-500 rounded-full'></div>
          <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-teal-500 rounded-full'></div>
        </div>

        <div className='relative max-w-7xl mx-auto px-4 py-16 lg:py-24'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Hero Content */}
            <div className='text-center lg:text-left'>
              <div className='mb-6'>
                <span className='inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                  🌱 Fresh & Organic
                </span>
              </div>

              <h1 className='text-4xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight'>
                {t('home.hero.title1', 'Fresh From')}
                <span className='text-primary-600 block'>{t('home.hero.title2', 'Farm to Table')}</span>
              </h1>

              <p className='text-lg lg:text-xl text-secondary-700 mb-8 leading-relaxed max-w-2xl'>
                {t('home.hero.subtitle', 'Connect directly with local farmers and get fresh, organic produce delivered to your doorstep. Supporting farmers, serving freshness.')}
              </p>

              {/* Hero Features */}
              <div className='flex flex-wrap justify-center lg:justify-start gap-4 mb-8'>
                {heroFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg'
                  >
                    <span className='text-lg'>{feature.icon}</span>
                    <span className='text-sm font-medium text-secondary-700'>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Link
                  to='/products'
                  className='inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl'
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
                </Link>
                <Link
                  to='/about'
                  className='inline-flex items-center justify-center px-8 py-4 bg-white text-secondary-900 rounded-xl font-semibold text-lg border-2 border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200'
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
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className='relative'>
              <div className='relative bg-white rounded-3xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500'>
                <img
                  src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&auto=format'
                  alt='Fresh vegetables and fruits'
                  className='w-full h-80 lg:h-96 object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                <div className='absolute bottom-4 left-4 right-4'>
                  <div className='bg-white/90 backdrop-blur-sm rounded-lg p-4'>
                    <p className='text-sm font-medium text-secondary-900'>
                      ✨ Fresh delivery in 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className='absolute -top-4 -left-4 bg-primary-600 text-white rounded-xl p-4 shadow-lg'>
                <div className='text-2xl font-bold'>500+</div>
                <div className='text-sm opacity-90'>Happy Farmers</div>
              </div>
              <div className='absolute -bottom-4 -right-4 bg-green-600 text-white rounded-xl p-4 shadow-lg'>
                <div className='text-2xl font-bold'>1000+</div>
                <div className='text-sm opacity-90'>Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section
        className='py-16 lg:py-24 bg-white'
        aria-labelledby='featured-heading'
      >
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <span className='text-primary-600 font-semibold text-lg'>
              Best Sellers
            </span>
            <h2
              id='featured-heading'
              className='text-3xl lg:text-4xl font-bold text-secondary-900 mt-2 mb-4'
            >
              Featured Products
            </h2>
            <p className='text-secondary-600 text-lg max-w-2xl mx-auto'>
              Discover our most popular and freshest products, hand-picked by
              our farmers
            </p>
          </div>

          {/* Products Grid */}
          <div
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12'
            role='list'
            aria-live='polite'
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              : featuredProducts.map((product) => (
                  <div key={product.id} role='listitem'>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          {/* View All CTA */}
          <div className='text-center'>
            <Link
              to='/products'
              className='inline-flex items-center gap-2 px-8 py-4 bg-secondary-100 text-secondary-900 rounded-xl font-semibold hover:bg-secondary-200 transition-colors duration-200'
            >
              Browse All Products
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
                  d='M17 8l4 4m0 0l-4 4m4-4H3'
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className='py-16 lg:py-24 bg-secondary-50'
        aria-labelledby='features-heading'
      >
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <span className='text-primary-600 font-semibold text-lg'>
              Our Promise
            </span>
            <h2
              id='features-heading'
              className='text-3xl lg:text-4xl font-bold text-secondary-900 mt-2 mb-4'
            >
              Why Choose AgriConnect?
            </h2>
            <p className='text-secondary-600 text-lg max-w-2xl mx-auto'>
              We're committed to connecting you with the finest local produce
              while supporting our farming community
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {whyChooseUs.map((feature, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center group'
                role='article'
                aria-label={feature.title}
              >
                <div className='w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300'>
                  <span className='text-3xl'>{feature.icon}</span>
                </div>
                <h3 className='text-xl font-bold text-secondary-900 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-secondary-600 mb-3 leading-relaxed'>
                  {feature.description}
                </p>
                <span className='inline-block text-primary-600 font-semibold text-sm bg-primary-50 px-3 py-1 rounded-full'>
                  {feature.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className='py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white'>
          <div className='max-w-4xl mx-auto px-4 text-center'>
            <h2 className='text-3xl lg:text-4xl font-bold mb-4'>
              Ready to taste the freshness?
            </h2>
            <p className='text-xl mb-8 opacity-90'>
              Join thousands of satisfied customers who trust AgriConnect for
              their daily fresh produce needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                to='/register'
                className='inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg hover:bg-secondary-100 transition-colors duration-200'
              >
                Get Started Today
              </Link>
              <Link
                to='/products'
                className='inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors duration-200'
              >
                Browse Products
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

// Apply performance monitoring and SEO
const MonitoredHome = createMonitoredRoute(Home, {
  routeName: 'Home',
  seoData: seoData.home,
  trackPageView: true
});

MonitoredHome.displayName = 'MonitoredHome';
export default MonitoredHome;
