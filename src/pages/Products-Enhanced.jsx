import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import Loader, { CardSkeleton } from '../components/Loader';
import AdvancedSearch from '../components/search/AdvancedSearch';
import SmartSuggestions from '../components/search/SmartSuggestions';
import CategoryNavigation from '../components/search/CategoryNavigation';
import { Button, Card, CardBody, Badge, Alert } from '../components/ui';
import productAPI from '../api/productApi';
import mockProducts from '../data/products';
import '../styles/design-system.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    isOrganic: false,
    inStock: true,
    rating: 0,
    sortBy: 'relevance'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  
  const productsPerPage = 12;
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  // Mock categories for the navigation
  const categories = [
    { id: 'vegetables', name: 'Vegetables', count: 45 },
    { id: 'fruits', name: 'Fruits', count: 32 },
    { id: 'dairy', name: 'Dairy', count: 18 },
    { id: 'grains', name: 'Grains', count: 23 },
    { id: 'organic', name: 'Organic', count: 56 },
    { id: 'herbs', name: 'Herbs', count: 28 }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFiltersAndSort = () => {
      let filtered = [...products];

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (typeof product.farmer === 'string' ? product.farmer.toLowerCase().includes(query) : product.farmer?.name?.toLowerCase().includes(query))
        );
      }

      // Apply category filter
      if (activeCategory || filters.category) {
        const categoryToFilter = activeCategory || filters.category;
        filtered = filtered.filter(product =>
          product.category.toLowerCase() === categoryToFilter.toLowerCase()
        );
      }

      // Apply price range filter
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        filtered = filtered.filter(product =>
          product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
        );
      }

      // Apply organic filter
      if (filters.isOrganic) {
        filtered = filtered.filter(product => product.isOrganic);
      }

      // Apply in stock filter
      if (filters.inStock) {
        filtered = filtered.filter(product => product.inStock);
      }

      // Apply rating filter
      if (filters.rating > 0) {
        filtered = filtered.filter(product => product.rating >= filters.rating);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low_high':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_high_low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // Mock sorting by newest - in production, would use actual date
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'popular':
          // Mock sorting by popularity - in production, would use actual popularity metric
          filtered.sort((a, b) => b.rating * (b.reviews || 10) - a.rating * (a.reviews || 10));
          break;
        default:
          // 'relevance' - keep current order or sort by rating if there's a search query
          if (searchQuery.trim()) {
            filtered.sort((a, b) => b.rating - a.rating);
          }
          break;
      }

      setFilteredProducts(filtered);
      setTotalResults(filtered.length);
      setCurrentPage(1); // Reset to first page when filters change
    };

    applyFiltersAndSort();
  }, [products, searchQuery, filters, activeCategory]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch from API first, fallback to mock data
      try {
        const response = await productAPI.getAllProducts();
        setProducts(response.data || mockProducts);
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError);
        setProducts(mockProducts);
      }
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };



  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Add to recent searches
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleSuggestionClick = (suggestion, type) => {
    if (type === 'category') {
      setActiveCategory(suggestion.toLowerCase());
      setSearchQuery('');
    } else {
      setSearchQuery(suggestion);
      setActiveCategory('');
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCategorySelect = (category) => {
    if (typeof category === 'string') {
      setActiveCategory(category);
    } else {
      setActiveCategory(category.id || category.name);
    }
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('');
    setFilters({
      category: '',
      priceRange: [0, 1000],
      isOrganic: false,
      inStock: true,
      rating: 0,
      sortBy: 'relevance'
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--neutral-50)' }}>
        <div className="container py-12">
          <Alert variant="error" className="max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="font-semibold mb-2">Unable to Load Products</h2>
              <p className="mb-4">{error}</p>
              <Button onClick={fetchProducts} variant="primary">
                Try Again
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--neutral-50)' }}>
      {/* Hero Section */}
      <section className="relative py-16 text-white" style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)' }}>
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Fresh Products from Local Farmers
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover a wide variety of fresh, organic produce sourced directly from trusted farmers in your area
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: '🌿', text: 'Always Fresh' },
                { icon: '🚛', text: 'Fast Delivery' },
                { icon: '💰', text: 'Best Prices' },
                { icon: '🛡️', text: 'Quality Guaranteed' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search */}
      <AdvancedSearch
        onSearch={handleSearch}
        onFilter={handleFilter}
        filters={filters}
        categories={categories}
      />

      {/* Smart Suggestions */}
      {(searchQuery || (!searchQuery && !activeCategory)) && (
        <SmartSuggestions
          searchQuery={searchQuery}
          onSuggestionClick={handleSuggestionClick}
          recentSearches={recentSearches}
          userPreferences={user?.preferences}
        />
      )}

      {/* Category Navigation */}
      <CategoryNavigation
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Results Section */}
      <section className="py-12">
        <div className="container">
          
          {/* Results Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--neutral-900)' }}>
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 activeCategory ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Products` : 
                 'All Products'}
              </h2>
              <p style={{ color: 'var(--neutral-600)' }}>
                {totalResults} products found
                {(searchQuery || activeCategory) && (
                  <button
                    onClick={clearAllFilters}
                    className="ml-2 text-primary-600 hover:text-primary-700 underline"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            </div>

            {/* View Toggle (could add grid/list view here) */}
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--neutral-600)' }}>View:</span>
              <Button variant="ghost" size="sm" className="px-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--neutral-900)' }}>
                No products found
              </h3>
              <p className="mb-6" style={{ color: 'var(--neutral-600)' }}>
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={clearAllFilters} variant="primary">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    return (
                      <Button
                        key={page}
                        variant={isActive ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span style={{ color: 'var(--neutral-500)' }}>...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && filteredProducts.length > 0 && (
        <section className="py-16 text-white" style={{ background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%)' }}>
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Love what you see?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create an account to start shopping and enjoy exclusive member benefits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg" className="bg-white text-secondary-600 hover:bg-neutral-100">
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Products;