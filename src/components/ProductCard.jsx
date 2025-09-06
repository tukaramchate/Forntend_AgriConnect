import React, { memo, useState, useCallback } from "react";
import { Link } from 'react-router-dom';
import './ProductCard.css';

function formatINR(value) {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en-IN", { 
      style: "currency", 
      currency: "INR", 
      maximumFractionDigits: 0 
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}

function ProductCard({ 
  product = {}, 
  onAddToCart = () => {}, 
  onAddToWishlist = () => {},
  isInWishlist = false,
  className = ""
}) {
  const { 
    id, 
    name, 
    price, 
    image, 
    rating = 0, 
    description, 
    badge, 
    inStock = true,
    unit = "kg",
    discount,
    originalPrice
  } = product;

  const [imgSrc, setImgSrc] = useState(image || `/api/placeholder/300/200`);
  const [imageLoading, setImageLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleImgError = useCallback(() => {
    setImgSrc(`/api/placeholder/300/200`);
    setImageLoading(false);
  }, []);

  const handleImgLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!inStock || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [onAddToCart, product, inStock, isAddingToCart]);

  const handleWishlistToggle = useCallback(() => {
    onAddToWishlist(product);
  }, [onAddToWishlist, product]);

  // const handleView = useCallback(() => {
  //   onView(product);
  // }, [onView, product]);

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="ac-star ac-star--filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="ac-star ac-star--half">★</span>);
      } else {
        stars.push(<span key={i} className="ac-star ac-star--empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <article 
      className={`ac-product-card ${!inStock ? "ac-product-card--out-of-stock" : ""} ${className}`} 
      data-id={id} 
      aria-labelledby={`prod-${id}-title`}
    >
      {badge && (
        <div className="ac-product-card__badge" aria-hidden="true">
          {badge}
        </div>
      )}

      {discount && (
        <div className="ac-product-card__discount" aria-hidden="true">
          -{discount}%
        </div>
      )}

      <div className="ac-product-card__media">
        {imageLoading && (
          <div className="ac-product-card__skeleton" aria-hidden="true">
            <div className="skeleton-animation"></div>
          </div>
        )}
        
        <Link to={`/products/${id}`} className="ac-product-card__image-link">
          <img
            src={imgSrc}
            alt={name || "product"}
            className={`ac-product-card__img ${imageLoading ? 'loading' : ''}`}
            onError={handleImgError}
            onLoad={handleImgLoad}
            loading="lazy"
          />
        </Link>

        <button
          className={`ac-product-card__wishlist ${isInWishlist ? 'ac-product-card__wishlist--active' : ''}`}
          onClick={handleWishlistToggle}
          type="button"
          aria-label={isInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className="ac-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path 
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 22l8.8-9.6a5.5 5.5 0 0 0 0-7.8z" 
              fill={isInWishlist ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {!inStock && (
          <div className="ac-product-card__overlay" aria-hidden="true">
            <span className="ac-product-card__out-of-stock">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="ac-product-card__body">
        <h3 id={`prod-${id}-title`} className="ac-product-card__title">
          <Link to={`/products/${id}`} className="ac-product-card__title-link">
            {name}
          </Link>
        </h3>

        {rating > 0 && (
          <div className="ac-product-card__rating" aria-label={`Rating ${rating} out of 5`}>
            <div className="ac-product-card__stars" aria-hidden="true">
              {renderStars()}
            </div>
            <span className="ac-product-card__rating-text">({rating})</span>
          </div>
        )}

        {description && (
          <p className="ac-product-card__description">
            {description.length > 80 ? `${description.substring(0, 80)}...` : description}
          </p>
        )}

        <div className="ac-product-card__footer">
          <div className="ac-product-card__pricing">
            <div className="ac-product-card__price">
              {formatINR(price)}
              {unit && <span className="ac-product-card__unit">/{unit}</span>}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="ac-product-card__original-price">
                {formatINR(originalPrice)}
              </div>
            )}
          </div>

          <div className="ac-product-card__actions">
            <button
              className="ac-btn ac-btn--primary ac-product-card__add-to-cart"
              onClick={handleAddToCart}
              type="button"
              disabled={!inStock || isAddingToCart}
              aria-disabled={!inStock || isAddingToCart}
              aria-label={inStock ? `Add ${name} to cart` : `${name} out of stock`}
            >
              {isAddingToCart ? (
                <>
                  <span className="ac-spinner" aria-hidden="true"></span>
                  Adding...
                </>
              ) : !inStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);