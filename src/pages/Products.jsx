import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: 45,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Tomatoes",
    rating: 4.5,
    category: "vegetables"
  },
  {
    id: 2,
    name: "Sweet Corn",
    price: 30,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Corn",
    rating: 4.2,
    category: "vegetables"
  },
  {
    id: 3,
    name: "Fresh Milk",
    price: 60,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Milk",
    rating: 4.8,
    category: "dairy"
  },
  {
    id: 4,
    name: "Organic Apples",
    price: 120,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Apples",
    rating: 4.6,
    category: "fruits"
  },
  {
    id: 5,
    name: "Basmati Rice",
    price: 85,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Rice",
    rating: 4.3,
    category: "grains"
  },
  {
    id: 6,
    name: "Pure Honey",
    price: 200,
    image: "https://via.placeholder.com/300x200/0b6b2e/ffffff?text=Honey",
    rating: 4.7,
    category: "organic"
  }
];

const categories = [
  { id: "all", name: "All Products" },
  { id: "vegetables", name: "Vegetables" },
  { id: "fruits", name: "Fruits" },
  { id: "dairy", name: "Dairy" },
  { id: "grains", name: "Grains" },
  { id: "organic", name: "Organic" }
];

const MAX_PRICE = 250;

function Products({ onAddToCart, onAddToWishlist }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch = searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price <= priceRange;
        const matchesRating = product.rating >= minRating;
        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low": return a.price - b.price;
          case "price-high": return b.price - a.price;
          case "rating": return b.rating - a.rating;
          default: return a.name.localeCompare(b.name);
        }
      });
  }, [products, selectedCategory, searchQuery, priceRange, minRating, sortBy]);

  const handleViewProduct = (product) => {
    console.log('Viewing product:', product);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange(MAX_PRICE);
    setMinRating(0);
    setSortBy("name");
  };

  return (
    <div className="ac-products-page">
      <div className="ac-container">
        <div className="ac-products-header">
          <h1 className="ac-page-title">Our Products</h1>
          <p className="ac-page-subtitle">Discover fresh, high-quality produce direct from local farms.</p>
        </div>

        <div className="ac-products-layout">
          {/* Filters Sidebar */}
          <aside className="ac-products-sidebar">
            <div className="ac-filter-group">
              <h3 className="ac-filter-title">Categories</h3>
              <div className="ac-category-list">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`ac-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="ac-filter-group">
              <h3 className="ac-filter-title">Price Range</h3>
              <label htmlFor="price-range">Up to ₹{priceRange}</label>
              <input
                type="range"
                id="price-range"
                min="0"
                max={MAX_PRICE}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="ac-price-slider"
              />
            </div>

            <div className="ac-filter-group">
              <h3 className="ac-filter-title">Rating</h3>
              <div className="ac-rating-filter">
                {[4, 3, 2, 1].map(star => (
                  <button
                    key={star}
                    className={`ac-rating-btn ${minRating === star ? 'active' : ''}`}
                    onClick={() => setMinRating(minRating === star ? 0 : star)}
                  >
                    {star} ★ & up
                  </button>
                ))}
              </div>
            </div>
            <button onClick={resetFilters} className="ac-btn ac-btn--ghost ac-btn--full">Reset Filters</button>
          </aside>

          {/* Main Content */}
          <main className="ac-products-main">
            <div className="ac-products-controls">
              <div className="ac-search-filter">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ac-search-input"
                  aria-label="Search products"
                />
              </div>
              <div className="ac-sort-filter">
                <label htmlFor="sort-by">Sort by:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ac-sort-select"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="ac-results-info">
              <p>Showing {filteredAndSortedProducts.length} of {products.length} products</p>
            </div>

            <div className="ac-products-grid">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <div key={i} className="ac-skeleton-card" />)
              ) : filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                    onView={handleViewProduct}
                  />
                ))
              ) : (
                <div className="ac-no-products">
                  <h3>No Products Found</h3>
                  <p>Try adjusting your filters to find what you're looking for.</p>
                  <button onClick={resetFilters} className="ac-btn ac-btn--primary">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Products;
