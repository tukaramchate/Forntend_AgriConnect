import React, { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Categories.css';

// Mock categories data
const categoriesData = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    description: 'Fresh organic vegetables from local farms',
    image: '/api/placeholder/400/250',
    icon: '🥬',
    count: 125,
    featured: true,
    subcategories: [
      { id: 'leafy-greens', name: 'Leafy Greens', count: 28 },
      { id: 'root-vegetables', name: 'Root Vegetables', count: 35 },
      { id: 'tomatoes', name: 'Tomatoes', count: 15 },
      { id: 'peppers', name: 'Peppers', count: 12 },
      { id: 'onions-garlic', name: 'Onions & Garlic', count: 18 },
      { id: 'exotic-vegetables', name: 'Exotic Vegetables', count: 17 }
    ]
  },
  {
    id: 'fruits',
    name: 'Fruits',
    description: 'Sweet and nutritious seasonal fruits',
    image: '/api/placeholder/400/250',
    icon: '🍎',
    count: 89,
    featured: true,
    subcategories: [
      { id: 'citrus', name: 'Citrus Fruits', count: 18 },
      { id: 'berries', name: 'Berries', count: 12 },
      { id: 'tropical', name: 'Tropical Fruits', count: 25 },
      { id: 'stone-fruits', name: 'Stone Fruits', count: 15 },
      { id: 'apples-pears', name: 'Apples & Pears', count: 19 }
    ]
  },
  {
    id: 'grains',
    name: 'Grains & Cereals',
    description: 'Organic grains and cereals for healthy living',
    image: '/api/placeholder/400/250',
    icon: '🌾',
    count: 67,
    featured: false,
    subcategories: [
      { id: 'rice', name: 'Rice', count: 15 },
      { id: 'wheat', name: 'Wheat', count: 12 },
      { id: 'millets', name: 'Millets', count: 18 },
      { id: 'oats-barley', name: 'Oats & Barley', count: 10 },
      { id: 'quinoa-others', name: 'Quinoa & Others', count: 12 }
    ]
  },
  {
    id: 'herbs',
    name: 'Herbs & Spices',
    description: 'Fresh herbs and aromatic spices',
    image: '/api/placeholder/400/250',
    icon: '🌿',
    count: 45,
    featured: false,
    subcategories: [
      { id: 'fresh-herbs', name: 'Fresh Herbs', count: 20 },
      { id: 'dried-spices', name: 'Dried Spices', count: 15 },
      { id: 'spice-blends', name: 'Spice Blends', count: 10 }
    ]
  },
  {
    id: 'dairy',
    name: 'Dairy Products',
    description: 'Fresh dairy products from local farms',
    image: '/api/placeholder/400/250',
    icon: '🥛',
    count: 32,
    featured: true,
    subcategories: [
      { id: 'milk', name: 'Milk', count: 8 },
      { id: 'cheese', name: 'Cheese', count: 12 },
      { id: 'yogurt', name: 'Yogurt', count: 7 },
      { id: 'butter-ghee', name: 'Butter & Ghee', count: 5 }
    ]
  },
  {
    id: 'tools',
    name: 'Farm Tools',
    description: 'Quality tools for farming and gardening',
    image: '/api/placeholder/400/250',
    icon: '🔧',
    count: 78,
    featured: false,
    subcategories: [
      { id: 'hand-tools', name: 'Hand Tools', count: 25 },
      { id: 'power-tools', name: 'Power Tools', count: 15 },
      { id: 'irrigation', name: 'Irrigation Equipment', count: 20 },
      { id: 'seeds-fertilizers', name: 'Seeds & Fertilizers', count: 18 }
    ]
  }
];

// Mock products data for category view
const mockProducts = [
  {
    id: 1,
    name: 'Fresh Organic Tomatoes',
    price: 45,
    image: '/api/placeholder/300/200',
    rating: 4.5,
    description: 'Fresh organic tomatoes from local farms',
    inStock: true,
    unit: 'kg',
    category: 'vegetables'
  },
  {
    id: 2,
    name: 'Premium Carrots',
    price: 35,
    image: '/api/placeholder/300/200',
    rating: 4.2,
    description: 'Sweet and crunchy organic carrots',
    inStock: true,
    unit: 'kg',
    category: 'vegetables'
  },
  {
    id: 3,
    name: 'Fresh Spinach',
    price: 25,
    image: '/api/placeholder/300/200',
    rating: 4.7,
    description: 'Nutrient-rich fresh spinach leaves',
    inStock: true,
    unit: 'bunch',
    category: 'vegetables'
  }
];

function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  // Get current category data
  const currentCategory = useMemo(() => {
    return categoriesData.find(cat => cat.id === selectedCategory);
  }, [selectedCategory]);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = categoriesData;
    
    if (searchQuery) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'count':
          return b.count - a.count;
        case 'featured':
          return b.featured - a.featured;
        default:
          return 0;
      }
    });
  }, [searchQuery, sortBy]);

  // Get products for selected category
  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return mockProducts.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    setSearchParams({ category: categoryId });
  }, [setSearchParams]);

  // Handle subcategory selection
  const handleSubcategorySelect = useCallback((subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setSearchParams({ 
      category: selectedCategory, 
      subcategory: subcategoryId 
    });
  }, [selectedCategory, setSearchParams]);

  // Handle back to categories
  const handleBackToCategories = useCallback(() => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchParams({});
  }, [setSearchParams]);

  // Handle cart operations
  const handleAddToCart = useCallback((product) => {
    console.log('Adding to cart:', product);
    // Implement cart logic here
  }, []);

  const handleAddToWishlist = useCallback((product) => {
    console.log('Adding to wishlist:', product);
    // Implement wishlist logic here
  }, []);

  // Breadcrumb component
  const Breadcrumb = () => (
    <nav className="ac-breadcrumb" aria-label="Breadcrumb">
      <ol className="ac-breadcrumb__list">
        <li className="ac-breadcrumb__item">
          <Link to="/" className="ac-breadcrumb__link">Home</Link>
        </li>
        <li className="ac-breadcrumb__item">
          <button
            onClick={handleBackToCategories}
            className="ac-breadcrumb__link ac-breadcrumb__link--button"
          >
            Categories
          </button>
        </li>
        {currentCategory && (
          <li className="ac-breadcrumb__item">
            <span className="ac-breadcrumb__current">{currentCategory.name}</span>
          </li>
        )}
        {selectedSubcategory && (
          <li className="ac-breadcrumb__item">
            <span className="ac-breadcrumb__current">
              {currentCategory?.subcategories?.find(sub => sub.id === selectedSubcategory)?.name}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );

  return (
    <div className="ac-categories-page">
      <div className="ac-container">
        <Breadcrumb />

        {!selectedCategory ? (
          // Categories overview
          <>
            <div className="ac-categories-header">
              <div className="ac-categories-hero">
                <h1 className="ac-categories-title">Shop by Categories</h1>
                <p className="ac-categories-subtitle">
                  Discover fresh produce and quality farm products organized by category
                </p>
              </div>

              <div className="ac-categories-controls">
                <div className="ac-search-container">
                  <input
                    type="search"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ac-search-input"
                    aria-label="Search categories"
                  />
                  <svg className="ac-search-icon" viewBox="0 0 24 24" width="20" height="20">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" fill="none"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor"/>
                  </svg>
                </div>

                <div className="ac-sort-container">
                  <label htmlFor="sort-select" className="ac-visually-hidden">Sort categories</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="ac-sort-select"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="count">Sort by Product Count</option>
                    <option value="featured">Featured First</option>
                  </select>
                </div>

                <div className="ac-view-toggle">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`ac-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    aria-label="Grid view"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <rect x="3" y="3" width="7" height="7" stroke="currentColor" fill="none"/>
                      <rect x="14" y="3" width="7" height="7" stroke="currentColor" fill="none"/>
                      <rect x="14" y="14" width="7" height="7" stroke="currentColor" fill="none"/>
                      <rect x="3" y="14" width="7" height="7" stroke="currentColor" fill="none"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`ac-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    aria-label="List view"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor"/>
                      <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor"/>
                      <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor"/>
                      <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor"/>
                      <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor"/>
                      <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Categories */}
            <section className="ac-featured-categories">
              <h2 className="ac-section-title">Featured Categories</h2>
              <div className="ac-featured-grid">
                {categoriesData.filter(cat => cat.featured).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="ac-featured-card"
                  >
                    <div className="ac-featured-card__image">
                      <img src={category.image} alt="" loading="lazy" />
                      <div className="ac-featured-card__overlay">
                        <span className="ac-featured-card__icon">{category.icon}</span>
                      </div>
                    </div>
                    <div className="ac-featured-card__content">
                      <h3 className="ac-featured-card__title">{category.name}</h3>
                      <p className="ac-featured-card__count">{category.count} products</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* All Categories */}
            <section className="ac-all-categories">
              <h2 className="ac-section-title">All Categories</h2>
              <div className={`ac-categories-grid ${viewMode === 'list' ? 'ac-categories-grid--list' : ''}`}>
                {filteredCategories.map((category) => (
                  <article
                    key={category.id}
                    className="ac-category-card"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="ac-category-card__image">
                      <img src={category.image} alt="" loading="lazy" />
                      <div className="ac-category-card__icon">{category.icon}</div>
                      {category.featured && (
                        <div className="ac-category-card__badge">Featured</div>
                      )}
                    </div>

                    <div className="ac-category-card__content">
                      <h3 className="ac-category-card__title">{category.name}</h3>
                      <p className="ac-category-card__description">{category.description}</p>
                      <div className="ac-category-card__meta">
                        <span className="ac-category-card__count">{category.count} products</span>
                        <svg className="ac-category-card__arrow" viewBox="0 0 24 24" width="16" height="16">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" fill="none"/>
                        </svg>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          // Category detail view
          <>
            <div className="ac-category-detail-header">
              <button
                onClick={handleBackToCategories}
                className="ac-back-btn"
                aria-label="Back to categories"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" fill="none"/>
                </svg>
                Back to Categories
              </button>

              <div className="ac-category-hero">
                <div className="ac-category-hero__icon">{currentCategory?.icon}</div>
                <div className="ac-category-hero__content">
                  <h1 className="ac-category-hero__title">{currentCategory?.name}</h1>
                  <p className="ac-category-hero__description">{currentCategory?.description}</p>
                  <div className="ac-category-hero__stats">
                    <span>{currentCategory?.count} products available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {currentCategory?.subcategories && (
              <section className="ac-subcategories">
                <h2 className="ac-section-title">Subcategories</h2>
                <div className="ac-subcategories-grid">
                  <button
                    onClick={() => setSelectedSubcategory('')}
                    className={`ac-subcategory-btn ${!selectedSubcategory ? 'active' : ''}`}
                  >
                    All {currentCategory.name}
                    <span className="ac-subcategory-count">{currentCategory.count}</span>
                  </button>
                  {currentCategory.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategorySelect(subcategory.id)}
                      className={`ac-subcategory-btn ${selectedSubcategory === subcategory.id ? 'active' : ''}`}
                    >
                      {subcategory.name}
                      <span className="ac-subcategory-count">{subcategory.count}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Products */}
            <section className="ac-category-products">
              <div className="ac-products-header">
                <h2 className="ac-section-title">
                  {selectedSubcategory 
                    ? currentCategory?.subcategories?.find(sub => sub.id === selectedSubcategory)?.name 
                    : `${currentCategory?.name} Products`
                  }
                </h2>
                <div className="ac-products-controls">
                  <select className="ac-sort-select">
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Best Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              <div className="ac-products-grid">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ))}
              </div>

              {categoryProducts.length === 0 && (
                <div className="ac-no-products">
                  <div className="ac-no-products__icon">📦</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or check back later for new products.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default Categories;