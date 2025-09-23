import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD001',
    date: '2025-01-20',
    status: 'delivered',
    total: 200,
    items: [
      {
        name: 'Fresh Organic Tomatoes',
        quantity: 2,
        price: 45,
        unit: 'kg',
        farmer: 'Rajesh Kumar',
        image:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
      },
    ],
    deliveryAddress: {
      name: 'John Doe',
      address: '123 Main St, Apartment 4B',
      city: 'Mumbai',
    },
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: 'ORD002',
    date: '2025-01-18',
    status: 'shipped',
    total: 150,
    items: [
      {
        name: 'Sweet Golden Corn',
        quantity: 5,
        price: 30,
        unit: 'kg',
        farmer: 'Sunita Devi',
        image:
          'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=100&h=100&fit=crop',
      },
    ],
    deliveryAddress: {
      name: 'Jane Smith',
      address: '456 Oak Avenue',
      city: 'Delhi',
    },
    paymentMethod: 'UPI',
  },
];

const orderStatuses = {
  pending: {
    label: 'Order Placed',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '📋',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅',
  },
  processing: {
    label: 'Processing',
    color: 'bg-purple-100 text-purple-800',
    icon: '⚙️',
  },
  shipped: {
    label: 'Out for Delivery',
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🚚',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: '📦',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1200);
  }, []);

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-secondary-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto'></div>
          <p className='mt-4 text-lg text-secondary-600'>
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-secondary-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl lg:text-4xl font-bold text-secondary-900 mb-2'>
            My Orders
          </h1>
          <p className='text-lg text-secondary-600'>
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </p>
        </div>

        {/* Filter Tabs */}
        <div className='flex flex-wrap gap-2 mb-8'>
          {['all', 'delivered', 'shipped', 'processing', 'pending'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-600 border border-secondary-300 hover:bg-secondary-50'
                }`}
              >
                {status === 'all'
                  ? 'All Orders'
                  : orderStatuses[status]?.label || status}
              </button>
            )
          )}
        </div>

        {filteredOrders.length > 0 ? (
          <div className='space-y-6'>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className='bg-white rounded-xl border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow duration-200'
              >
                {/* Order Header */}
                <div className='p-6 border-b border-secondary-100'>
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                    <div>
                      <h3 className='text-lg font-semibold text-secondary-900 mb-1'>
                        ORDER #{order.id}
                      </h3>
                      <p className='text-secondary-600'>
                        Ordered on {formatDate(order.date)}
                      </p>
                    </div>

                    <div className='flex items-center gap-4'>
                      <span
                        className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${orderStatuses[order.status].color}`}
                      >
                        <span className='mr-2'>
                          {orderStatuses[order.status].icon}
                        </span>
                        {orderStatuses[order.status].label}
                      </span>
                      <div className='text-right'>
                        <div className='text-lg font-bold text-secondary-900'>
                          ₹{order.total.toFixed(2)}
                        </div>
                        <div className='text-sm text-secondary-600'>
                          {order.items.length} item
                          {order.items.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className='p-6 border-b border-secondary-100'>
                  <div className='space-y-4'>
                    {order.items.map((item, idx) => (
                      <div key={idx} className='flex items-center gap-4'>
                        <div className='w-16 h-16 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-semibold text-secondary-900 truncate'>
                            {item.name}
                          </h4>
                          <p className='text-secondary-600 text-sm'>
                            by {item.farmer}
                          </p>
                          <div className='flex items-center gap-4 text-sm text-secondary-500 mt-1'>
                            <span>
                              Qty: {item.quantity} {item.unit}
                            </span>
                            <span>
                              ₹{item.price} per {item.unit}
                            </span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='font-semibold text-secondary-900'>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className='p-6'>
                  <div className='flex flex-col lg:flex-row justify-between gap-6'>
                    <div className='flex-1'>
                      <h4 className='font-semibold text-secondary-900 mb-2'>
                        Delivery Address
                      </h4>
                      <div className='text-sm text-secondary-600'>
                        <p className='font-medium text-secondary-800'>
                          {order.deliveryAddress.name}
                        </p>
                        <p>{order.deliveryAddress.address}</p>
                        <p>{order.deliveryAddress.city}</p>
                      </div>
                      <div className='mt-3'>
                        <span className='text-sm text-secondary-600'>
                          Payment:{' '}
                        </span>
                        <span className='text-sm font-medium text-secondary-800'>
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48'>
                      <Link
                        to={`/orders/${order.id}`}
                        className='inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200'
                      >
                        View Details
                      </Link>

                      {order.status === 'delivered' && (
                        <button className='inline-flex items-center justify-center px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-colors duration-200'>
                          Write Review
                        </button>
                      )}

                      {order.status === 'shipped' && (
                        <button className='inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200'>
                          Track Order
                        </button>
                      )}

                      <button className='inline-flex items-center justify-center px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-colors duration-200'>
                        Need Help?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='bg-white rounded-xl border border-secondary-200 p-12 text-center'>
            <div className='max-w-md mx-auto'>
              <div className='w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center'>
                <svg
                  className='w-12 h-12 text-secondary-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-secondary-900 mb-2'>
                {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
              </h2>
              <p className='text-secondary-600 mb-6'>
                {filter === 'all'
                  ? "Looks like you haven't placed any orders yet. Start shopping to see your orders here!"
                  : `You don't have any ${filter} orders at the moment.`}
              </p>
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className='inline-flex items-center px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-colors duration-200'
                  >
                    View All Orders
                  </button>
                )}
                <Link
                  to='/products'
                  className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200'
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
