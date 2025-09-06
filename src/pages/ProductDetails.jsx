import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import './ProductDetails.css';

// Mock data for development
const mockProduct = {
  id: 1,
  name: "Fresh Organic Tomatoes",
  price: 45,
  image: "/src/assets/icons/box.svg",
  gallery: [
    "/src/assets/icons/box.svg",
    "/src/assets/icons/box.svg",
    "/src/assets/icons/box.svg",
  ],
  rating: 4.5,
  description: "Fresh organic tomatoes from local farms. These tomatoes are grown without any chemical pesticides and are harvested at peak ripeness for the best flavor and nutritional value.",
  category: "vegetables",
  stock: 50,
  unit: "kg",
  farmer: {
    name: "Rajesh Kumar",
    farm: "Green Valley Farm",
    location: "Punjab",
    rating: 4.8,
    verified: true
  },
  reviews: [
    {
      id: 1,
      customer: "Priya Sharma",
      rating: 5,
      comment: "Excellent quality tomatoes! Very fresh and tasty.",
      date: "2025-08-15"
    },
    {
      id: 2,
      customer: "Amit Patel",
      rating: 4,
      comment: "Good quality, reasonable price. Will order again.",
      date: "2025-08-10"
    }
  ]
};

function ProductDetailsSkeleton() {
  return (
    <div className="ac-product-details-skeleton">
      <div className="ac-skeleton-image"></div>
      <div className="ac-skeleton-info">
        <div className="ac-skeleton-text large"></div>
        <div className="ac-skeleton-text medium"></div>
        <div className="ac-skeleton-text"></div>
        <div className="ac-skeleton-text"></div>
        <div className="ac-skeleton-text small"></div>
        <div className="ac-skeleton-actions">
          <div className="ac-skeleton-button"></div>
          <div className="ac-skeleton-button"></div>
        </div>
      </div>
    </div>
  );
}


function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setProduct(mockProduct);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    onAddToCart({ ...product, quantity });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="ac-container">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="ac-container ac-error">
        <h2>Product Not Found</h2>
        <p>We couldn't find the product you're looking for.</p>
        <Link to="/products" className="ac-btn ac-btn--primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <main className="ac-product-details">
      <div className="ac-container">
        <nav className="ac-breadcrumb" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <section className="ac-product-details__content" aria-labelledby="product-title">
          <div className="ac-product-details__image">
            <img
              src={product.image}
              alt={product.name}
              className="ac-product-image"
            />
          </div>

          <div className="ac-product-details__info">
            <h1 id="product-title" className="ac-product-title">{product.name}</h1>
            
            <div className="ac-product-rating">
              <div className="ac-stars" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                {"★".repeat(Math.floor(product.rating))}
                {"☆".repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="ac-rating-text">({product.rating})</span>
              <a href="#reviews" className="ac-review-count">{product.reviews.length} reviews</a>
            </div>

            <div className="ac-product-price">
              <span className="ac-price">₹{product.price}</span>
              <span className="ac-unit">/ {product.unit}</span>
            </div>

            <div className="ac-product-stock">
              <span className={`ac-stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} ${product.unit} available)` : 'Out of Stock'}
              </span>
            </div>

            <p className="ac-product-description">{product.description}</p>

            <div className="ac-quantity-selector">
              <label htmlFor="quantity" className="ac-quantity-label">Quantity</label>
              <div className="ac-quantity-controls">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="ac-quantity-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                  className="ac-quantity-input"
                  aria-label="Product quantity"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="ac-quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="ac-unit-label">{product.unit}</span>
              </div>
            </div>

            <div className="ac-product-actions">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdded}
                className={`ac-btn ac-btn--primary ac-btn--large ${isAdded ? 'ac-btn--added' : ''}`}
              >
                {isAdded ? 'Added ✓' : 'Add to Cart'}
              </button>
              <button className="ac-btn ac-btn--ghost ac-btn--large">
                ♡ Add to Wishlist
              </button>
            </div>

            <div className="ac-farmer-info">
              <h3 className="ac-farmer-info-title">Sold by</h3>
              <div className="ac-farmer-card">
                <div className="ac-farmer-details">
                  <h4>{product.farmer.name}</h4>
                  <p>{product.farmer.farm}, {product.farmer.location}</p>
                  <div className="ac-farmer-rating">
                    <span className="ac-stars">{"★".repeat(Math.floor(product.farmer.rating))}</span>
                    <span>({product.farmer.rating})</span>
                  </div>
                </div>
                {product.farmer.verified && (
                  <div className="ac-verified-badge">✓ Verified</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="ac-reviews-section" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading">Customer Reviews</h2>
          {product.reviews.length > 0 ? (
            <div className="ac-reviews-list">
              {product.reviews.map(review => (
                <article key={review.id} className="ac-review-item">
                  <header className="ac-review-header">
                    <span className="ac-reviewer-name">{review.customer}</span>
                    <div className="ac-review-rating" aria-label={`Rated ${review.rating} out of 5 stars`}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <time dateTime={review.date} className="ac-review-date">{new Date(review.date).toLocaleDateString()}</time>
                  </header>
                  <p className="ac-review-comment">{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="ac-no-reviews">No reviews yet. Be the first to review this product!</p>
          )}
          
          <div className="ac-review-form-container">
            <h3>Write a Review</h3>
            <form className="ac-review-form">
              <div className="ac-form-group">
                <label htmlFor="review-rating">Your Rating</label>
                {/* A real implementation would use a star rating component */}
                <select id="review-rating" className="ac-form-input">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div className="ac-form-group">
                <label htmlFor="review-comment">Your Review</label>
                <textarea id="review-comment" rows="4" className="ac-form-textarea" placeholder="Tell us what you think..."></textarea>
              </div>
              <button type="submit" className="ac-btn ac-btn--primary">Submit Review</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;
