import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Home.css';

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: 45,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Tomatoes",
    rating: 4.5,
    description: "Fresh organic tomatoes from local farms"
  },
  {
    id: 2,
    name: "Sweet Corn",
    price: 30,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Corn",
    rating: 4.2,
    description: "Sweet and juicy corn"
  },
  {
    id: 3,
    name: "Fresh Milk",
    price: 60,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Milk",
    rating: 4.8,
    description: "Pure farm fresh milk"
  },
  {
    id: 4,
    name: "Organic Apples",
    price: 120,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Apples",
    rating: 4.6,
    description: "Organic apples from Kashmir"
  }
];

function Home({ onAddToCart = () => {}, onAddToWishlist = () => {} }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const t = setTimeout(() => {
      setFeaturedProducts(mockProducts);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleViewProduct = (product) => {
    console.log('Viewing product:', product);
  };

  return (
    <main className="ac-home" role="main">
      {/* Hero Section */}
      <section className="ac-hero" aria-label="Hero">
        <div className="ac-container ac-hero__wrap">
          <div className="ac-hero__content">
            <h1 className="ac-hero__title">
              Fresh From Farm to Your Table
            </h1>
            <p className="ac-hero__subtitle">
              Connect directly with local farmers and get fresh, organic produce delivered to your doorstep.
            </p>
            <div className="ac-hero__actions">
              <Link to="/products" className="ac-btn ac-btn--primary" aria-label="Shop now">
                Shop Now
              </Link>
              <Link to="/about" className="ac-btn ac-btn--ghost" aria-label="Learn more about AgriConnect">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="ac-featured" aria-labelledby="featured-heading">
        <div className="ac-container">
          <div className="ac-section-head">
            <h2 id="featured-heading" className="ac-section-title">Featured Products</h2>
            <Link to="/products" className="ac-link-sm">View all</Link>
          </div>

          <div className="ac-products-grid" role="list" aria-live="polite">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="ac-skeleton-card" role="status" aria-hidden="true" />
                ))
              : featuredProducts.map(product => (
                  <div key={product.id} role="listitem">
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onAddToWishlist={onAddToWishlist}
                      onView={handleViewProduct}
                    />
                  </div>
                ))
            }
          </div>

          <div className="ac-featured__more">
            <Link to="/products" className="ac-btn ac-btn--outline">
              Browse all products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="ac-features" aria-labelledby="features-heading">
        <div className="ac-container">
          <h2 id="features-heading" className="ac-section-title">Why Choose AgriConnect?</h2>
          <div className="ac-features__grid">
            <div className="ac-feature" role="article" aria-label="Direct from farmers">
              <div className="ac-feature__icon">🌾</div>
              <h3>Direct from Farmers</h3>
              <p>Cut out middlemen and get better prices for farmers and customers.</p>
            </div>
            <div className="ac-feature" role="article" aria-label="Fresh and organic">
              <div className="ac-feature__icon">🥬</div>
              <h3>Fresh & Organic</h3>
              <p>Fresh produce harvested and delivered within 24 hours.</p>
            </div>
            <div className="ac-feature" role="article" aria-label="Fast delivery">
              <div className="ac-feature__icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Same-day delivery for local orders, next-day for nearby areas.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
