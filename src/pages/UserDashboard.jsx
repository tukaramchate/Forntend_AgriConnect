import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import DashboardTable from '../components/dashboard/DashboardTable';
import ChartCard from '../components/dashboard/ChartCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const userStats = [
    {
      title: 'Total Orders',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      trend: 'vs last month',
      icon: '/src/assets/icons/shopping-cart.svg',
    },
    {
      title: 'Total Spent',
      value: '₹12,450',
      change: '+8%',
      changeType: 'positive',
      trend: 'vs last month',
      icon: '/src/assets/icons/credit-card.svg',
    },
    {
      title: 'Favorite Products',
      value: '18',
      change: '+3',
      changeType: 'positive',
      trend: 'this month',
      icon: '/src/assets/icons/heart.svg',
    },
    {
      title: 'Loyalty Points',
      value: '2,340',
      change: '+120',
      changeType: 'positive',
      trend: 'this month',
      icon: '/src/assets/icons/star.svg',
    },
  ];

  const recentOrders = [
    {
      order_id: 'OD-1045',
      date: '2024-03-20',
      items: '3 items',
      total: '₹890',
      status: 'Delivered',
      farmer: 'Ramesh Kumar',
    },
    {
      order_id: 'OD-1044',
      date: '2024-03-18',
      items: '2 items',
      total: '₹450',
      status: 'In Transit',
      farmer: 'Sunita Devi',
    },
    {
      order_id: 'OD-1043',
      date: '2024-03-15',
      items: '5 items',
      total: '₹1,200',
      status: 'Processing',
      farmer: 'Vikram Singh',
    },
  ];

  const activities = [
    {
      type: 'order',
      title: 'Order Delivered',
      description: 'Your order #OD-1045 has been delivered successfully',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      action: { label: 'Rate Order', onClick: () => {} },
    },
    {
      type: 'product',
      title: 'New Product Added',
      description:
        'Fresh organic spinach is now available from your favorite farmer',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: { label: 'View Product', onClick: () => {} },
    },
    {
      type: 'payment',
      title: 'Payment Processed',
      description: 'Payment of ₹450 for order #OD-1044 has been processed',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      type: 'review',
      title: 'Review Submitted',
      description: 'Thank you for reviewing Fresh Milk from Ramesh Kumar',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Discover fresh products',
      icon: '/src/assets/icons/search.svg',
      onClick: () => {},
    },
    {
      title: 'Track Orders',
      description: 'Check order status',
      icon: '/src/assets/icons/truck.svg',
      onClick: () => {},
    },
    {
      title: 'Manage Wishlist',
      description: 'View saved items',
      icon: '/src/assets/icons/heart.svg',
      onClick: () => {},
    },
    {
      title: 'Support',
      description: 'Get help & support',
      icon: '/src/assets/icons/help-circle.svg',
      onClick: () => {},
    },
  ];

  const orderHeaders = [
    'Order ID',
    'Date',
    'Items',
    'Total',
    'Status',
    'Farmer',
  ];
  const orderActions = [
    {
      label: 'View',
      onClick: (order) => console.log('View order:', order),
      icon: '/src/assets/icons/eye.svg',
    },
    {
      label: 'Reorder',
      onClick: (order) => console.log('Reorder:', order),
      icon: '/src/assets/icons/refresh-cw.svg',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'wishlist', label: 'Wishlist' },
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
                  Welcome back, John!
                </h1>
                <p className='text-secondary-600 mt-1'>
                  Here's what's happening with your orders today.
                </p>
              </div>
              <div className='flex items-center space-x-4'>
                <button className='bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200'>
                  <Link
                    to='/products'
                    className='text-white text-decoration-none'
                  >
                    Browse Products
                  </Link>
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
              {userStats.map((stat, index) => (
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
                />

                {/* Order History Chart */}
                <ChartCard
                  title='Order History'
                  subtitle='Your ordering patterns over the last 6 months'
                  actions={[
                    { label: '6M', onClick: () => {} },
                    { label: '1Y', onClick: () => {} },
                  ]}
                >
                  <div className='h-64 bg-secondary-100 rounded-lg flex items-center justify-center'>
                    <div className='text-center'>
                      <p className='text-secondary-600 mb-2'>
                        Order History Chart
                      </p>
                      <p className='text-sm text-secondary-500'>
                        Chart visualization would go here
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
                Order History
              </h2>
              <div className='flex space-x-4'>
                <select className='border border-secondary-300 rounded-lg px-3 py-2 text-sm'>
                  <option>All Orders</option>
                  <option>Delivered</option>
                  <option>In Transit</option>
                  <option>Processing</option>
                </select>
              </div>
            </div>
            <DashboardTable
              title=''
              headers={orderHeaders}
              data={recentOrders}
              actions={orderActions}
            />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className='text-center py-12'>
            <img
              src='/src/assets/icons/heart.svg'
              alt=''
              className='w-16 h-16 mx-auto opacity-50 mb-4'
            />
            <h3 className='text-lg font-medium text-secondary-900 mb-2'>
              Your Wishlist
            </h3>
            <p className='text-secondary-600 mb-6'>
              Save products you love for later
            </p>
            <Link
              to='/products'
              className='inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200'
            >
              Browse Products
            </Link>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className='max-w-2xl'>
            <div className='bg-white rounded-lg shadow-sm border p-6'>
              <h3 className='text-lg font-semibold text-secondary-900 mb-6'>
                Profile Settings
              </h3>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-secondary-700 mb-2'>
                      First Name
                    </label>
                    <input
                      type='text'
                      defaultValue='John'
                      className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-secondary-700 mb-2'>
                      Last Name
                    </label>
                    <input
                      type='text'
                      defaultValue='Doe'
                      className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-secondary-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    defaultValue='john.doe@example.com'
                    className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-secondary-700 mb-2'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    defaultValue='+91 98765 43210'
                    className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>
                <div className='pt-4'>
                  <button className='bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200'>
                    Save Changes
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

export default UserDashboard;
