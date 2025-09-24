import React, { useState } from 'react';
import { Button, Input, Badge } from '../ui';
import '../../styles/design-system.css';

const AdvancedSearch = ({ onSearch, onFilter, filters, categories }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    isOrganic: false,
    inStock: true,
    rating: 0,
    sortBy: 'relevance',
    ...filters,
  });

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low_high', label: 'Price: Low to High' },
    { value: 'price_high_low', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      priceRange: [0, 1000],
      isOrganic: false,
      inStock: true,
      rating: 0,
      sortBy: 'relevance',
    };
    setLocalFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.isOrganic) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 1000)
      count++;
    return count;
  };

  return (
    <div
      className='bg-white border-b'
      style={{ borderColor: 'var(--neutral-200)' }}
    >
      <div className='container py-6'>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className='mb-6'>
          <div className='relative max-w-2xl mx-auto'>
            <div className='flex'>
              <div className='relative flex-1'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search for fresh produce, farmers, or categories...'
                  className='input pr-12 text-lg py-4'
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  <svg
                    className='w-6 h-6'
                    style={{ color: 'var(--neutral-400)' }}
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
                </div>
              </div>
              <Button
                type='submit'
                variant='primary'
                className='ml-4 px-8 py-4'
              >
                Search
              </Button>
            </div>

            {/* Quick Search Suggestions */}
            <div
              className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg border border-t-0 z-10 hidden group-focus-within:block'
              style={{ borderColor: 'var(--neutral-200)' }}
            >
              <div className='p-4'>
                <div
                  className='text-sm font-medium mb-2'
                  style={{ color: 'var(--neutral-700)' }}
                >
                  Popular Searches
                </div>
                <div className='flex flex-wrap gap-2'>
                  {[
                    'Organic Vegetables',
                    'Fresh Fruits',
                    'Farm Milk',
                    'Local Honey',
                    'Seasonal Produce',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        onSearch(suggestion);
                      }}
                      className='text-sm px-3 py-1 rounded-full border hover:bg-primary-50 transition-colors'
                      style={{
                        borderColor: 'var(--neutral-300)',
                        color: 'var(--neutral-600)',
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Filter Toggle and Sort */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className='relative'
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
                  d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-2V11.414a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z'
                />
              </svg>
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge
                  variant='success'
                  className='absolute -top-2 -right-2 text-xs'
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>

            {getActiveFilterCount() > 0 && (
              <Button
                variant='ghost'
                onClick={clearFilters}
                className='text-sm'
              >
                Clear All
              </Button>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-sm' style={{ color: 'var(--neutral-600)' }}>
              Sort by:
            </span>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className='input py-2 text-sm'
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {isFilterOpen && (
          <div
            className='mt-6 p-6 bg-neutral-50 rounded-lg border'
            style={{ borderColor: 'var(--neutral-200)' }}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {/* Category Filter */}
              <div>
                <label
                  className='block text-sm font-medium mb-2'
                  style={{ color: 'var(--neutral-700)' }}
                >
                  Category
                </label>
                <select
                  value={localFilters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                  className='input'
                >
                  <option value=''>All Categories</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label
                  className='block text-sm font-medium mb-2'
                  style={{ color: 'var(--neutral-700)' }}
                >
                  Price Range (₹)
                </label>
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    value={localFilters.priceRange[0]}
                    onChange={(e) =>
                      handleFilterChange('priceRange', [
                        parseInt(e.target.value),
                        localFilters.priceRange[1],
                      ])
                    }
                    className='input text-sm'
                    placeholder='Min'
                    min='0'
                  />
                  <span className='text-neutral-500'>-</span>
                  <input
                    type='number'
                    value={localFilters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange('priceRange', [
                        localFilters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className='input text-sm'
                    placeholder='Max'
                    min='0'
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label
                  className='block text-sm font-medium mb-2'
                  style={{ color: 'var(--neutral-700)' }}
                >
                  Minimum Rating
                </label>
                <div className='flex items-center gap-1'>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`w-8 h-8 rounded ${
                        localFilters.rating >= rating
                          ? 'text-yellow-400'
                          : 'text-neutral-300 hover:text-yellow-300'
                      } transition-colors`}
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
                  {localFilters.rating > 0 && (
                    <span
                      className='ml-2 text-sm'
                      style={{ color: 'var(--neutral-600)' }}
                    >
                      {localFilters.rating}+ stars
                    </span>
                  )}
                </div>
              </div>

              {/* Special Filters */}
              <div>
                <label
                  className='block text-sm font-medium mb-2'
                  style={{ color: 'var(--neutral-700)' }}
                >
                  Special Filters
                </label>
                <div className='space-y-2'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={localFilters.isOrganic}
                      onChange={(e) =>
                        handleFilterChange('isOrganic', e.target.checked)
                      }
                      className='mr-2 rounded'
                      style={{ accentColor: 'var(--primary-500)' }}
                    />
                    <span className='text-sm'>Organic Only</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={localFilters.inStock}
                      onChange={(e) =>
                        handleFilterChange('inStock', e.target.checked)
                      }
                      className='mr-2 rounded'
                      style={{ accentColor: 'var(--primary-500)' }}
                    />
                    <span className='text-sm'>In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            <span
              className='text-sm font-medium'
              style={{ color: 'var(--neutral-700)' }}
            >
              Active Filters:
            </span>
            {localFilters.category && (
              <Badge variant='info' className='text-xs'>
                Category: {localFilters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className='ml-1 hover:text-red-600'
                >
                  ×
                </button>
              </Badge>
            )}
            {localFilters.isOrganic && (
              <Badge variant='success' className='text-xs'>
                Organic
                <button
                  onClick={() => handleFilterChange('isOrganic', false)}
                  className='ml-1 hover:text-red-600'
                >
                  ×
                </button>
              </Badge>
            )}
            {localFilters.rating > 0 && (
              <Badge variant='warning' className='text-xs'>
                {localFilters.rating}+ stars
                <button
                  onClick={() => handleFilterChange('rating', 0)}
                  className='ml-1 hover:text-red-600'
                >
                  ×
                </button>
              </Badge>
            )}
            {(localFilters.priceRange[0] > 0 ||
              localFilters.priceRange[1] < 1000) && (
              <Badge variant='error' className='text-xs'>
                ₹{localFilters.priceRange[0]} - ₹{localFilters.priceRange[1]}
                <button
                  onClick={() => handleFilterChange('priceRange', [0, 1000])}
                  className='ml-1 hover:text-red-600'
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
