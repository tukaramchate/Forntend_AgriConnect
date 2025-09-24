import React, { useState, useEffect } from 'react';
import { Card, CardBody, Badge } from '../ui';
import '../../styles/design-system.css';

const SmartSuggestions = ({
  searchQuery,
  onSuggestionClick,
  recentSearches = [],
  userPreferences = {},
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock AI-powered suggestions - In real implementation, this would call an AI service
  const generateSmartSuggestions = (query) => {
    const baseSuggestions = [
      // Category-based suggestions
      {
        type: 'category',
        text: 'Organic Vegetables',
        icon: '🥬',
        confidence: 0.9,
      },
      { type: 'category', text: 'Fresh Fruits', icon: '🍎', confidence: 0.85 },
      { type: 'category', text: 'Dairy Products', icon: '🥛', confidence: 0.8 },

      // Product suggestions
      {
        type: 'product',
        text: 'Tomatoes',
        icon: '🍅',
        confidence: 0.95,
        description: 'Fresh organic tomatoes',
      },
      {
        type: 'product',
        text: 'Apples',
        icon: '🍎',
        confidence: 0.9,
        description: 'Crisp seasonal apples',
      },
      {
        type: 'product',
        text: 'Milk',
        icon: '🥛',
        confidence: 0.88,
        description: 'Farm fresh milk',
      },

      // Farmer suggestions
      {
        type: 'farmer',
        text: 'Ramesh Kumar Farm',
        icon: '👨‍🌾',
        confidence: 0.75,
        description: 'Organic vegetable specialist',
      },
      {
        type: 'farmer',
        text: 'Green Valley Dairy',
        icon: '🏡',
        confidence: 0.7,
        description: 'Premium dairy products',
      },

      // Seasonal suggestions
      {
        type: 'seasonal',
        text: 'Winter Vegetables',
        icon: '❄️',
        confidence: 0.8,
        description: 'Fresh winter harvest',
      },
      {
        type: 'seasonal',
        text: 'Citrus Fruits',
        icon: '🍊',
        confidence: 0.85,
        description: 'Vitamin C rich fruits',
      },
    ];

    if (!query) return baseSuggestions.slice(0, 5);

    // Simple matching algorithm - in production, use proper fuzzy search/AI
    const filtered = baseSuggestions.filter(
      (suggestion) =>
        suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.description?.toLowerCase().includes(query.toLowerCase())
    );

    // Sort by confidence and relevance
    return filtered.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
  };

  const trendingSuggestions = [
    { text: 'Organic Honey', trend: '+15%', icon: '🍯' },
    { text: 'Fresh Spinach', trend: '+12%', icon: '🥬' },
    { text: 'Farm Eggs', trend: '+8%', icon: '🥚' },
    { text: 'Seasonal Fruits', trend: '+20%', icon: '🍓' },
  ];

  const visualSearchSuggestions = [
    { text: 'Upload photo to identify produce', icon: '📷', action: 'camera' },
    { text: 'Scan barcode for product info', icon: '📱', action: 'barcode' },
    {
      text: 'Voice search: "Find organic tomatoes"',
      icon: '🎤',
      action: 'voice',
    },
  ];

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setSuggestions(generateSmartSuggestions(searchQuery));
        setIsLoading(false);
      }, 300);
    }, 150);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    onSuggestionClick(suggestion.text, suggestion.type);
  };

  const handleSpecialAction = (action) => {
    switch (action) {
      case 'camera':
        // In production, implement camera functionality
        alert('Visual search feature coming soon!');
        break;
      case 'barcode':
        alert('Barcode scanner feature coming soon!');
        break;
      case 'voice':
        // In production, implement voice search
        alert('Voice search feature coming soon!');
        break;
      default:
        break;
    }
  };

  return (
    <div className='p-6' style={{ backgroundColor: 'var(--neutral-50)' }}>
      <div className='max-w-4xl mx-auto'>
        {/* Search Suggestions */}
        {searchQuery && (
          <div className='mb-8'>
            <h3
              className='text-lg font-semibold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              Smart Suggestions
            </h3>
            {isLoading ? (
              <div className='flex items-center gap-2 text-neutral-500'>
                <div className='w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                Finding relevant results...
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className='text-left p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-white transition-all duration-200'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>{suggestion.icon}</span>
                      <div>
                        <div
                          className='font-medium'
                          style={{ color: 'var(--neutral-900)' }}
                        >
                          {suggestion.text}
                        </div>
                        {suggestion.description && (
                          <div
                            className='text-sm'
                            style={{ color: 'var(--neutral-600)' }}
                          >
                            {suggestion.description}
                          </div>
                        )}
                        <div className='flex items-center gap-2 mt-1'>
                          <Badge
                            variant={
                              suggestion.type === 'product'
                                ? 'success'
                                : suggestion.type === 'farmer'
                                  ? 'warning'
                                  : 'info'
                            }
                            className='text-xs'
                          >
                            {suggestion.type}
                          </Badge>
                          <span
                            className='text-xs'
                            style={{ color: 'var(--neutral-500)' }}
                          >
                            {Math.round(suggestion.confidence * 100)}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className='mb-8'>
            <h3
              className='text-lg font-semibold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              Recent Searches
            </h3>
            <div className='flex flex-wrap gap-2'>
              {recentSearches.slice(0, 6).map((search, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(search, 'recent')}
                  className='flex items-center gap-2 px-3 py-2 rounded-full border border-neutral-300 hover:border-primary-400 hover:bg-primary-50 transition-colors'
                >
                  <svg
                    className='w-4 h-4'
                    style={{ color: 'var(--neutral-500)' }}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span className='text-sm'>{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Now */}
        {!searchQuery && (
          <div className='mb-8'>
            <h3
              className='text-lg font-semibold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              🔥 Trending Now
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {trendingSuggestions.map((item, index) => (
                <Card
                  key={index}
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => onSuggestionClick(item.text, 'trending')}
                >
                  <CardBody className='text-center p-4'>
                    <div className='text-3xl mb-2'>{item.icon}</div>
                    <div
                      className='font-medium mb-1'
                      style={{ color: 'var(--neutral-900)' }}
                    >
                      {item.text}
                    </div>
                    <Badge variant='success' className='text-xs'>
                      {item.trend} this week
                    </Badge>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Visual Search Options */}
        {!searchQuery && (
          <div>
            <h3
              className='text-lg font-semibold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              🔍 Smart Search Options
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {visualSearchSuggestions.map((option, index) => (
                <Card
                  key={index}
                  className='cursor-pointer hover:shadow-md transition-all hover:scale-105'
                  onClick={() => handleSpecialAction(option.action)}
                >
                  <CardBody className='text-center p-6'>
                    <div className='text-4xl mb-3'>{option.icon}</div>
                    <div
                      className='font-medium'
                      style={{ color: 'var(--neutral-900)' }}
                    >
                      {option.text}
                    </div>
                    <div className='mt-3'>
                      <Badge variant='info' className='text-xs'>
                        Coming Soon
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {!searchQuery &&
          userPreferences &&
          Object.keys(userPreferences).length > 0 && (
            <div
              className='mt-8 p-6 rounded-lg'
              style={{ backgroundColor: 'var(--primary-50)' }}
            >
              <h3
                className='text-lg font-semibold mb-4'
                style={{ color: 'var(--primary-900)' }}
              >
                🤖 AI Recommendations for You
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
                  <span className='text-2xl'>🥗</span>
                  <div>
                    <div className='font-medium'>Fresh Salad Mix</div>
                    <div
                      className='text-sm'
                      style={{ color: 'var(--neutral-600)' }}
                    >
                      Based on your healthy eating preferences
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
                  <span className='text-2xl'>🥛</span>
                  <div>
                    <div className='font-medium'>Organic Dairy Bundle</div>
                    <div
                      className='text-sm'
                      style={{ color: 'var(--neutral-600)' }}
                    >
                      You order dairy products weekly
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SmartSuggestions;
