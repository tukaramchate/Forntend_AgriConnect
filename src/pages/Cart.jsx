import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Enhanced mock cart data for development
const mockCartItems = [
  {
    id: 1,
    productId: 1,
    name: 'Fresh Organic Tomatoes',
    price: 45,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop&auto=format',
    quantity: 2,
    unit: 'kg',
    stock: 50,
    farmer: 'Rajesh Kumar Farm',
    category: 'Vegetables',
  },
  {
    id: 2,
    productId: 3,
    name: 'Pure Farm Fresh Milk',
    price: 60,
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&h=150&fit=crop&auto=format',
    quantity: 1,
    unit: 'liter',
    stock: 20,
    farmer: 'Gopal Dairy',
    category: 'Dairy',
  },
  {
    id: 3,
    productId: 5,
    name: 'Organic Red Apples',
    price: 120,
    image:
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&h=150&fit=crop&auto=format',
    quantity: 1,
    unit: 'kg',
    stock: 30,
    farmer: 'Mountain Orchards',
    category: 'Fruits',
  },
];

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate API call
    const t = setTimeout(() => {
      setCartItems(mockCartItems);
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.stock || 9999, newQuantity || 1)
              ),
            }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
        0
      ),
    [cartItems]
  );

  const deliveryCharge = useMemo(
    () => (subtotal >= 500 || subtotal === 0 ? 0 : 50),
    [subtotal]
  );

  const total = useMemo(
    () => subtotal + deliveryCharge,
    [subtotal, deliveryCharge]
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-secondary-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto'></div>
          <p className='mt-4 text-lg text-secondary-600'>
            Loading your cart...
          </p>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className='min-h-screen bg-secondary-50 flex items-center justify-center'>
        <div className='max-w-md mx-auto text-center px-4'>
          <div className='w-32 h-32 mx-auto mb-8 bg-secondary-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-16 h-16 text-secondary-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-secondary-900 mb-3'>
            Your cart is empty
          </h2>
          <p className='text-secondary-600 mb-8'>
            Looks like you haven't added any products to your cart yet. Discover
            fresh, organic produce from local farmers!
          </p>
          <div className='space-y-3'>
            <Link
              to='/products'
              className='inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 w-full justify-center'
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
                  d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                />
              </svg>
              Start Shopping
            </Link>
            <Link
              to='/categories'
              className='inline-flex items-center px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-colors duration-200 w-full justify-center'
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-secondary-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl lg:text-4xl font-bold text-secondary-900 mb-2'>
            Shopping Cart
          </h1>
          <p className='text-lg text-secondary-600'>
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item
            {cartItems.reduce((sum, item) => sum + item.quantity, 0) !== 1
              ? 's'
              : ''}{' '}
            in your cart
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-xl border border-secondary-200 overflow-hidden'>
              <div className='p-6 border-b border-secondary-100'>
                <h2 className='text-xl font-semibold text-secondary-900'>
                  Cart Items
                </h2>
              </div>

              <div className='divide-y divide-secondary-100'>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className='p-6 hover:bg-secondary-25 transition-colors duration-200'
                  >
                    <div className='flex flex-col sm:flex-row gap-4'>
                      {/* Product Image */}
                      <div className='w-full sm:w-32 h-32 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* Product Details */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex flex-col sm:flex-row sm:justify-between gap-4'>
                          <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-secondary-900 mb-1'>
                              {item.name}
                            </h3>
                            <p className='text-secondary-600 text-sm mb-2'>
                              by {item.farmer}
                            </p>
                            <div className='flex items-center gap-4 text-sm'>
                              <span className='font-medium text-secondary-900'>
                                ₹{item.price} per {item.unit}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  item.stock > 10
                                    ? 'bg-green-100 text-green-800'
                                    : item.stock > 0
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {item.stock > 0
                                  ? `${item.stock} ${item.unit} in stock`
                                  : 'Out of stock'}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className='flex items-center gap-4'>
                            <div className='flex items-center border border-secondary-300 rounded-lg'>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className='p-2 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors duration-200'
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <svg
                                  className='w-4 h-4 text-secondary-600'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M20 12H4'
                                  />
                                </svg>
                              </button>
                              <input
                                type='number'
                                value={item.quantity}
                                min='1'
                                max={item.stock || 9999}
                                onChange={(e) => {
                                  const v = parseInt(e.target.value, 10);
                                  if (!isNaN(v)) updateQuantity(item.id, v);
                                }}
                                className='w-16 px-3 py-2 text-center border-0 focus:ring-0 text-secondary-900 font-medium'
                                aria-label={`Quantity for ${item.name}`}
                              />
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= (item.stock || 9999)}
                                className='p-2 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors duration-200'
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <svg
                                  className='w-4 h-4 text-secondary-600'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className='text-right'>
                              <div className='text-lg font-bold text-secondary-900'>
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className='text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200'
                                aria-label={`Remove ${item.name}`}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className='mt-6'>
              <Link
                to='/products'
                className='inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200'
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
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl border border-secondary-200 sticky top-4'>
              <div className='p-6 border-b border-secondary-100'>
                <h3 className='text-xl font-semibold text-secondary-900'>
                  Order Summary
                </h3>
              </div>

              <div className='p-6 space-y-4'>
                {/* Summary Rows */}
                <div className='flex justify-between text-secondary-700'>
                  <span>
                    Subtotal ({cartItems.reduce((c, it) => c + it.quantity, 0)}{' '}
                    items)
                  </span>
                  <span className='font-medium'>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className='flex justify-between text-secondary-700'>
                  <span>Delivery Charge</span>
                  <span className='font-medium'>
                    {deliveryCharge === 0 ? (
                      <span className='text-green-600'>Free</span>
                    ) : (
                      `₹${deliveryCharge.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Free Delivery Progress */}
                {deliveryCharge > 0 && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <div className='flex items-center text-blue-800 text-sm mb-2'>
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
                    </div>
                    <div className='w-full bg-blue-200 rounded-full h-2'>
                      <div
                        className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                        style={{
                          width: `${Math.min((subtotal / 500) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <hr className='border-secondary-200' />

                {/* Total */}
                <div className='flex justify-between text-lg font-bold text-secondary-900'>
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  to='/checkout'
                  className='block w-full bg-primary-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200'
                >
                  Proceed to Checkout
                </Link>

                {/* Benefits */}
                <div className='pt-4 border-t border-secondary-200 space-y-3'>
                  <h4 className='font-medium text-secondary-900 text-sm'>
                    Why shop with us?
                  </h4>
                  <div className='space-y-2 text-sm text-secondary-600'>
                    <div className='flex items-center'>
                      <span className='text-green-500 mr-2'>🚚</span>
                      <span>Free delivery on orders above ₹500</span>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-blue-500 mr-2'>🔄</span>
                      <span>Easy returns & exchanges</span>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-purple-500 mr-2'>🔒</span>
                      <span>Secure payment options</span>
                    </div>
                    <div className='flex items-center'>
                      <span className='text-orange-500 mr-2'>🌱</span>
                      <span>Fresh from local farmers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
