import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Wishlist.css';

// Mock wishlist data
const mockWishlist = [
  { id: 11, name: 'Organic Bananas', price: 80, image: '/src/assets/icons/box.svg', rating: 4.4, unit: 'dozen', stock: 20 },
  { id: 12, name: 'Cold Pressed Mustard Oil', price: 320, image: '/src/assets/icons/box.svg', rating: 4.6, unit: 'liter', stock: 15 },
  { id: 4, name: "Organic Apples", price: 120, image: "/src/assets/icons/box.svg", rating: 4.6, unit: 'kg', stock: 0 }
];

function WishlistSkeleton() {
  return (
    <div className="ac-wishlist-skeleton">
      {Array.from({ length: 2 }).map((_, index) => (
        <div className="ac-wishlist-item-skeleton" key={index}>
          <div className="ac-skeleton-image"></div>
          <div className="ac-skeleton-details">
            <div className="ac-skeleton-text medium"></div>
            <div className="ac-skeleton-text small"></div>
            <div className="ac-skeleton-text x-small"></div>
          </div>
          <div className="ac-skeleton-actions">
            <div className="ac-skeleton-button"></div>
            <div className="ac-skeleton-button small"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Wishlist() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setItems(mockWishlist);
      setIsLoading(false);
    }, 800);
  }, []);

  const removeFromWishlist = (id) => {
    // Add a fade-out animation before removing
    const itemElement = document.getElementById(`wishlist-item-${id}`);
    if (itemElement) {
      itemElement.classList.add('removing');
      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== id));
      }, 300);
    } else {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const moveToCart = (product) => {
    console.log('Moving to cart:', product);
    // Here you would typically call an API to add to cart
    removeFromWishlist(product.id);
  };

  return (
    <div className="ac-wishlist-page">
      <div className="ac-container">
        <div className="ac-wishlist-header">
          <h1 className="ac-page-title">My Wishlist</h1>
          {!isLoading && <p className="ac-page-subtitle">{items.length} item(s) saved for later</p>}
        </div>

        {isLoading ? (
          <WishlistSkeleton />
        ) : items.length === 0 ? (
          <div className="ac-empty-wishlist">
            <div className="ac-empty-wishlist__icon">💖</div>
            <h2>Your Wishlist is Empty</h2>
            <p>Looks like you haven’t added anything to your wishlist yet. Start exploring and save your favorites!</p>
            <Link to="/products" className="ac-btn ac-btn--primary">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="ac-wishlist-items">
            {items.map(item => (
              <article key={item.id} id={`wishlist-item-${item.id}`} className="ac-wishlist-item">
                <Link to={`/products/${item.id}`} className="ac-wishlist-item__image-link">
                  <img src={item.image} alt={item.name} className="ac-wishlist-item__image" />
                </Link>
                <div className="ac-wishlist-item__details">
                  <h3 className="ac-item-name">
                    <Link to={`/products/${item.id}`}>{item.name}</Link>
                  </h3>
                  <div className="ac-item-price">₹{item.price} / {item.unit}</div>
                  <div className="ac-item-rating">
                    {"★".repeat(Math.floor(item.rating))}
                    {"☆".repeat(5 - Math.floor(item.rating))}
                    <span className="ac-rating-text">({item.rating})</span>
                  </div>
                  <div className={`ac-item-stock ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
                <div className="ac-wishlist-item__actions">
                  <button
                    className="ac-btn ac-btn--primary"
                    onClick={() => moveToCart(item)}
                    disabled={item.stock === 0}
                  >
                    Move to Cart
                  </button>
                  <button
                    className="ac-btn ac-btn--danger-outline"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;