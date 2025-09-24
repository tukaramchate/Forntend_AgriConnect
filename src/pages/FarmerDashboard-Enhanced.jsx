import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import DashboardTable from '../components/dashboard/DashboardTable';
import ChartCard from '../components/dashboard/ChartCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import CommunityFeed from '../components/social/community/CommunityFeed';

const FarmerDashboardEnhanced = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const farmerStats = [
    {
      title: 'Monthly Revenue',
      value: '₹45,280',
      change: '+15.2%',
      changeType: 'positive',
      trend: 'vs last month',
      icon: '/src/assets/icons/credit-card.svg',
    },
    {
      title: 'Orders Received',
      value: '127',
      change: '+8',
      changeType: 'positive',
      trend: 'this week',
      icon: '/src/assets/icons/shopping-cart.svg',
    },
    {
      title: 'Active Products',
      value: '24',
      change: '+2',
      changeType: 'positive',
      trend: 'this month',
      icon: '/src/assets/icons/box.svg',
    },
    {
      title: 'Customer Rating',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive',
      trend: 'average rating',
      icon: '/src/assets/icons/star.svg',
    },
  ];

  const recentOrders = [
    {
      order_id: 'OD-1045',
      customer: 'Priya Sharma',
      items: 'Fresh Milk, Organic Honey',
      amount: '₹680',
      status: 'Pending',
      date: '2024-03-20',
    },
    {
      order_id: 'OD-1044',
      customer: 'Rahul Gupta',
      items: 'Organic Tomatoes',
      amount: '₹320',
      status: 'Processing',
      date: '2024-03-20',
    },
    {
      order_id: 'OD-1043',
      customer: 'Sunita Devi',
      items: 'Fresh Vegetables Mix',
      amount: '₹890',
      status: 'Delivered',
      date: '2024-03-19',
    },
  ];

  const inventoryItems = [
    {
      product_name: 'Fresh Milk',
      stock_level: '45 liters',
      price: '₹35/liter',
      status: 'In Stock',
      last_updated: '2 hours ago',
    },
    {
      product_name: 'Organic Tomatoes',
      stock_level: '12 kg',
      price: '₹40/kg',
      status: 'Low Stock',
      last_updated: '1 hour ago',
    },
    {
      product_name: 'Pure Honey',
      stock_level: '8 bottles',
      price: '₹180/bottle',
      status: 'Low Stock',
      last_updated: '3 hours ago',
    },
  ];

  const activities = [
    {
      type: 'order',
      title: 'New Order Received',
      description: 'Order #OD-1045 from Priya Sharma for ₹680',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      action: { label: 'Process Order', onClick: () => {} },
    },
    {
      type: 'payment',
      title: 'Payment Received',
      description: 'Payment of ₹890 for order #OD-1043 has been credited',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      type: 'alert',
      title: 'Low Stock Alert',
      description: 'Organic Tomatoes stock is running low (12 kg remaining)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: { label: 'Update Stock', onClick: () => {} },
    },
    {
      type: 'review',
      title: 'New Review',
      description: 'Sunita Devi rated your Fresh Vegetables Mix 5 stars',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      action: { label: 'View Review', onClick: () => {} },
    },
  ];

  const quickActions = [
    {
      title: 'Add Product',
      description: 'List new products',
      icon: '/src/assets/icons/plus.svg',
      onClick: () => {},
    },
    {
      title: 'Update Inventory',
      description: 'Manage stock levels',
      icon: '/src/assets/icons/box.svg',
      onClick: () => {},
    },
    {
      title: 'View Analytics',
      description: 'Sales & performance',
      icon: '/src/assets/icons/grid.svg',
      onClick: () => {},
    },
    {
      title: 'Customer Support',
      description: 'Help & messages',
      icon: '/src/assets/icons/help-circle.svg',
      onClick: () => {},
    },
  ];

  const orderHeaders = [
    'Order ID',
    'Customer',
    'Items',
    'Amount',
    'Status',
    'Date',
  ];
  const orderActions = [
    {
      label: 'Process',
      onClick: (order) => console.log('Process order:', order),
      icon: '/src/assets/icons/edit-2.svg',
    },
    {
      label: 'View',
      onClick: (order) => console.log('View order:', order),
      icon: '/src/assets/icons/eye.svg',
    },
  ];

  const inventoryHeaders = [
    'Product Name',
    'Stock Level',
    'Price',
    'Status',
    'Last Updated',
  ];
  const inventoryActions = [
    {
      label: 'Edit',
      onClick: (item) => console.log('Edit item:', item),
      icon: '/src/assets/icons/edit-2.svg',
    },
    {
      label: 'Update Stock',
      onClick: (item) => console.log('Update stock:', item),
      icon: '/src/assets/icons/refresh-cw.svg',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'community', label: 'Community' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <div className='min-h-screen bg-secondary-50'>
      {/* Header */}
      <div className='bg-white border-b border-secondary-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='py-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-secondary-900'>
                  Farmer Dashboard
                </h1>
                <p className='text-secondary-600 mt-1'>
                  Manage your farm business and track performance
                </p>
              </div>
              <div className='flex items-center space-x-4'>
                <div className='bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium'>
                  ✓ Verified Farmer
                </div>
                <button className='bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200'>
                  Add Product
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className='mt-6'>
              <nav className='flex space-x-8'>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {activeTab === 'overview' && (
          <div className='space-y-8'>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {farmerStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Column - 2/3 width */}
              <div className='lg:col-span-2 space-y-8'>
                {/* Recent Orders */}
                <DashboardTable
                  title='Recent Orders'
                  headers={orderHeaders}
                  data={recentOrders}
                  actions={orderActions}
                  emptyMessage='No orders yet. Your products will appear here when customers place orders.'
                />

                {/* Sales Analytics */}
                <ChartCard
                  title='Sales Performance'
                  subtitle='Revenue and order trends over time'
                  actions={[
                    { label: '7D', onClick: () => {} },
                    { label: '30D', onClick: () => {} },
                    { label: '3M', onClick: () => {} },
                  ]}
                >
                  <div className='h-64 bg-secondary-100 rounded-lg flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='text-secondary-600 mb-2'>
                        Sales Analytics Chart
                      </p>
                      <p className='text-sm text-secondary-500'>
                        Revenue and order volume visualization
                      </p>
                    </div>
                  </div>
                </ChartCard>
              </div>

              {/* Right Column - 1/3 width */}
              <div className='space-y-8'>
                <QuickActions actions={quickActions} />
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-secondary-900'>
                Order Management
              </h2>
              <div className='flex space-x-4'>
                <select className='border border-secondary-300 rounded-lg px-3 py-2 text-sm'>
                  <option>All Orders</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>
            <DashboardTable
              title=''
              headers={orderHeaders}
              data={recentOrders}
              actions={orderActions}
              emptyMessage='No orders found for the selected filter.'
            />
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-secondary-900'>
                Inventory Management
              </h2>
              <div className='flex space-x-4'>
                <button className='bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200'>
                  Add Product
                </button>
              </div>
            </div>
            <DashboardTable
              title=''
              headers={inventoryHeaders}
              data={inventoryItems}
              actions={inventoryActions}
              emptyMessage='No products in inventory. Add your first product to get started.'
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className='space-y-8'>
            <h2 className='text-xl font-semibold text-secondary-900'>
              Analytics & Insights
            </h2>

            {/* Analytics Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              <ChartCard
                title='Revenue Trends'
                subtitle='Monthly revenue over the last 6 months'
              >
                <div className='h-48 bg-secondary-100 rounded-lg flex items-center justify-center'>
                  <p className='text-secondary-600'>Revenue Chart</p>
                </div>
              </ChartCard>

              <ChartCard
                title='Top Products'
                subtitle='Best selling products this month'
              >
                <div className='h-48 bg-secondary-100 rounded-lg flex items-center justify-center'>
                  <p className='text-secondary-600'>
                    Product Performance Chart
                  </p>
                </div>
              </ChartCard>

              <ChartCard
                title='Customer Demographics'
                subtitle='Your customer base analysis'
              >
                <div className='h-48 bg-secondary-100 rounded-lg flex items-center justify-center'>
                  <p className='text-secondary-600'>Demographics Chart</p>
                </div>
              </ChartCard>

              <ChartCard
                title='Seasonal Trends'
                subtitle='Product demand throughout the year'
              >
                <div className='h-48 bg-secondary-100 rounded-lg flex items-center justify-center'>
                  <p className='text-secondary-600'>Seasonal Analysis Chart</p>
                </div>
              </ChartCard>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-semibold text-secondary-900'>
                  Community Feed
                </h3>
                <Link
                  to='/community'
                  className='text-primary-600 hover:text-primary-700 text-sm font-medium'
                >
                  View Full Community →
                </Link>
              </div>
              <CommunityFeed farmerId='current-farmer-id' limit={5} />
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className='max-w-2xl'>
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <h3 className='text-lg font-semibold text-secondary-900 mb-6'>
                Farmer Profile
              </h3>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-secondary-700 mb-2'>
                      Farm Name
                    </label>
                    <input
                      type='text'
                      defaultValue='Green Valley Organic Farm'
                      className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-secondary-700 mb-2'>
                      Farmer Name
                    </label>
                    <input
                      type='text'
                      defaultValue='Ramesh Kumar'
                      className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-secondary-700 mb-2'>
                    Location
                  </label>
                  <input
                    type='text'
                    defaultValue='Nashik, Maharashtra'
                    className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-secondary-700 mb-2'>
                    Specialization
                  </label>
                  <input
                    type='text'
                    defaultValue='Organic Dairy & Vegetables'
                    className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-secondary-700 mb-2'>
                    Farm Description
                  </label>
                  <textarea
                    rows={4}
                    defaultValue='Family-owned organic farm with 20+ years of experience in sustainable farming practices. We specialize in fresh dairy products and seasonal vegetables.'
                    className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>
                <div className='pt-4'>
                  <button className='bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200'>
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboardEnhanced;
