import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui';
import '../../styles/design-system.css';

const CategoryNavigation = ({ activeCategory, onCategorySelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const allCategories = [
    {
      id: 'vegetables',
      name: 'Vegetables',
      icon: '🥕',
      count: 145,
      description: 'Fresh local vegetables',
      color: 'from-green-400 to-green-600',
      subcategories: ['Leafy Greens', 'Root Vegetables', 'Seasonal Vegetables', 'Organic Vegetables']
    },
    {
      id: 'fruits',
      name: 'Fruits',
      icon: '🍎',
      count: 89,
      description: 'Seasonal fresh fruits',
      color: 'from-red-400 to-red-600',
      subcategories: ['Citrus Fruits', 'Stone Fruits', 'Berries', 'Tropical Fruits']
    },
    {
      id: 'dairy',
      name: 'Dairy',
      icon: '🥛',
      count: 34,
      description: 'Farm fresh dairy products',
      color: 'from-blue-400 to-blue-600',
      subcategories: ['Milk', 'Cheese', 'Yogurt', 'Butter']
    },
    {
      id: 'grains',
      name: 'Grains & Cereals',
      icon: '🌾',
      count: 67,
      description: 'Organic grains & cereals',
      color: 'from-yellow-400 to-yellow-600',
      subcategories: ['Rice', 'Wheat', 'Millets', 'Pulses']
    },
    {
      id: 'organic',
      name: 'Certified Organic',
      icon: '🌱',
      count: 156,
      description: 'Certified organic produce',
      color: 'from-emerald-400 to-emerald-600',
      subcategories: ['Organic Vegetables', 'Organic Fruits', 'Organic Grains', 'Organic Dairy']
    },
    {
      id: 'herbs',
      name: 'Herbs & Spices',
      icon: '🌿',
      count: 45,
      description: 'Fresh aromatic herbs & spices',
      color: 'from-lime-400 to-lime-600',
      subcategories: ['Fresh Herbs', 'Dried Spices', 'Medicinal Herbs', 'Cooking Herbs']
    },
    {
      id: 'honey',
      name: 'Honey & Natural',
      icon: '🍯',
      count: 23,
      description: 'Pure honey & natural products',
      color: 'from-amber-400 to-amber-600',
      subcategories: ['Raw Honey', 'Flavored Honey', 'Bee Products', 'Natural Sweeteners']
    },
    {
      id: 'beverages',
      name: 'Natural Beverages',
      icon: '🥤',
      count: 28,
      description: 'Fresh juices & natural drinks',
      color: 'from-purple-400 to-purple-600',
      subcategories: ['Fresh Juices', 'Herbal Teas', 'Natural Sodas', 'Health Drinks']
    }
  ];

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
  };

  return (
    <div className="bg-white border-b" style={{ borderColor: 'var(--neutral-200)' }}>
      <div className="container py-6">
        
        {/* Quick Category Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--neutral-900)' }}>
            Shop by Category
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium flex items-center gap-1 hover:text-primary-600 transition-colors"
            style={{ color: 'var(--primary-500)' }}
          >
            {isExpanded ? 'Show Less' : 'View All Categories'}
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Main Categories Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 ${!isExpanded ? 'mb-0' : ''}`}>
          {(isExpanded ? allCategories : allCategories.slice(0, 6)).map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                activeCategory === category.id 
                  ? 'border-primary-500 bg-primary-50 shadow-md' 
                  : 'border-neutral-200 hover:border-primary-300 bg-white'
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 rounded-xl group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--neutral-900)' }}>
                  {category.name}
                </h3>
                <p className="text-xs mb-2" style={{ color: 'var(--neutral-600)' }}>
                  {category.description}
                </p>
                <Badge 
                  variant={activeCategory === category.id ? 'success' : 'info'} 
                  className="text-xs"
                >
                  {category.count} items
                </Badge>
              </div>

              {/* Active Category Indicator */}
              {activeCategory === category.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary-500)' }}></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Subcategories for Active Category */}
        {activeCategory && isExpanded && (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-50)' }}>
            {(() => {
              const selected = allCategories.find(cat => cat.id === activeCategory);
              return selected ? (
                <div>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--neutral-900)' }}>
                    {selected.name} Subcategories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.subcategories.map((sub, index) => (
                      <button
                        key={index}
                        onClick={() => onCategorySelect({ ...selected, subcategory: sub })}
                        className="px-3 py-1 text-sm rounded-full border border-neutral-300 hover:border-primary-400 hover:bg-primary-50 transition-colors"
                        style={{ color: 'var(--neutral-700)' }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Featured Categories Banner */}
        {!activeCategory && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seasonal Highlight */}
            <div className="relative overflow-hidden rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)' }}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🍂</span>
                  <Badge variant="warning" className="text-xs">Seasonal</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Winter Harvest Special</h3>
                <p className="text-sm opacity-90 mb-4">
                  Fresh winter vegetables and citrus fruits now available
                </p>
                <button 
                  onClick={() => handleCategoryClick({ id: 'seasonal', name: 'Seasonal' })}
                  className="text-sm font-semibold px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Shop Now →
                </button>
              </div>
              <div className="absolute top-4 right-4 opacity-20">
                <span className="text-6xl">❄️</span>
              </div>
            </div>

            {/* Organic Highlight */}
            <div className="relative overflow-hidden rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%)' }}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌱</span>
                  <Badge variant="success" className="text-xs bg-white/20">Certified</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">100% Organic</h3>
                <p className="text-sm opacity-90 mb-4">
                  Certified organic produce from trusted farmers
                </p>
                <button 
                  onClick={() => handleCategoryClick({ id: 'organic', name: 'Certified Organic' })}
                  className="text-sm font-semibold px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Explore →
                </button>
              </div>
              <div className="absolute top-4 right-4 opacity-20">
                <span className="text-6xl">🌿</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-2xl font-bold" style={{ color: 'var(--primary-600)' }}>500+</div>
            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>Total Products</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-2xl font-bold" style={{ color: 'var(--info-600)' }}>50+</div>
            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>Local Farmers</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="text-2xl font-bold" style={{ color: 'var(--warning-600)' }}>24hrs</div>
            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>Fresh Delivery</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-2xl font-bold" style={{ color: 'var(--error-600)' }}>100%</div>
            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>Quality Assured</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;