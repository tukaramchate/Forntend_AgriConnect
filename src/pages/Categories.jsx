import React from 'react';

export default function Categories() {
  const categories = [
    {
      id: 'vegetables',
      name: 'Vegetables',
      description: 'Fresh organic vegetables from local farms',
      icon: '🥬',
      count: 125,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'fruits',
      name: 'Fruits',
      description: 'Sweet and nutritious seasonal fruits',
      icon: '🍎',
      count: 89,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'grains',
      name: 'Grains & Cereals',
      description: 'Organic grains and cereals for healthy living',
      icon: '🌾',
      count: 67,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'dairy',
      name: 'Dairy Products',
      description: 'Fresh dairy from local farms',
      icon: '🥛',
      count: 45,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'herbs',
      name: 'Herbs & Spices',
      description: 'Aromatic herbs and premium spices',
      icon: '🌿',
      count: 38,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'nuts',
      name: 'Nuts & Seeds',
      description: 'Healthy nuts and seeds for nutrition',
      icon: '🥜',
      count: 29,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Categories</h1>
          <p className="text-xl opacity-90">Discover fresh products from local farmers</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer"
              // Removed unused onClick handler
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                    {category.count} items
                  </span>
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium">
                  Browse {category.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Categories Banner */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Why Choose Our Categories?</h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Each category features handpicked products from verified local farmers, ensuring freshness and quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Fresh Delivery</h3>
              <p className="text-secondary-600">Direct from farm to your doorstep within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Organic Quality</h3>
              <p className="text-secondary-600">Certified organic products with no harmful chemicals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Support Farmers</h3>
              <p className="text-secondary-600">Direct support to local farming communities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

