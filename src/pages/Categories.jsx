import React, { useEffect, useState } from 'react';
import categoryAPI from '@/api/categoryApi';
import { categories as mockCategories } from '@/data/categories';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    categoryAPI.getCategories({ activeOnly: true, includeSubcategories: true, sort: 'name' })
      .then((data) => {
        if (isMounted) {
          setCategories(Array.isArray(data) && data.length ? data : mockCategories);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load categories. Showing mock data.');
          setCategories(mockCategories);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className='min-h-screen bg-secondary-50'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-primary-600 to-green-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Product Categories
          </h1>
          <p className='text-xl opacity-90'>
            Discover fresh products from local farmers
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className='max-w-7xl mx-auto px-4 py-12'>
        {loading ? (
          <div className='text-center py-12 text-lg text-secondary-600'>Loading categories...</div>
        ) : error ? (
          <div className='text-center py-6 text-red-600'>{error}</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {categories.map((category) => (
              <div
                key={category.id}
                className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer'
              >
                <div className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='text-4xl mb-2'>{category.icon || '📦'}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${category.color || 'bg-gray-100 text-gray-800'}`}
                    >
                      {category.count || category.product_count || 0} items
                    </span>
                  </div>
                  <h3 className='text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors'>
                    {category.name}
                  </h3>
                  <p className='text-secondary-600 text-sm leading-relaxed'>
                    {category.description}
                  </p>
                </div>
                <div className='px-6 pb-6'>
                  <button className='w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'>
                    Browse {category.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Categories Banner */}
      <div className='bg-white py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-secondary-900 mb-4'>
              Why Choose Our Categories?
            </h2>
            <p className='text-secondary-600 max-w-2xl mx-auto'>
              Each category features handpicked products from verified local
              farmers, ensuring freshness and quality.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🚚</span>
              </div>
              <h3 className='text-xl font-semibold text-secondary-900 mb-2'>
                Fresh Delivery
              </h3>
              <p className='text-secondary-600'>
                Direct from farm to your doorstep within 24 hours
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🌱</span>
              </div>
              <h3 className='text-xl font-semibold text-secondary-900 mb-2'>
                Organic Quality
              </h3>
              <p className='text-secondary-600'>
                Certified organic products with no harmful chemicals
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>👨‍🌾</span>
              </div>
              <h3 className='text-xl font-semibold text-secondary-900 mb-2'>
                Support Farmers
              </h3>
              <p className='text-secondary-600'>
                Direct support to local farming communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
