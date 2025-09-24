import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../store/slices/cartSlice';
import {
  Button,
  Card,
  CardBody,
  Badge,
  Alert,
  Modal,
  Breadcrumb,
  ProgressBar,
} from '../components/ui';
import Loader from '../components/Loader';
import '../styles/design-system.css';

const CartEnhanced = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    items: cartItems,
    coupon,
    isLoading,
  } = useSelector(
    (state) => state.cart || { items: [], coupon: null, isLoading: false }
  );

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState('');
  const [estimatedSavings, setEstimatedSavings] = useState(0);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [cartStep, setCartStep] = useState('cart'); // 'cart', 'delivery', 'summary'

  // Mock delivery slots
  const deliverySlots = [
    {
      id: 'today-morning',
      label: 'Today 8AM - 12PM',
      price: 50,
      available: true,
    },
    {
      id: 'today-evening',
      label: 'Today 4PM - 8PM',
      price: 50,
      available: false,
    },
    {
      id: 'tomorrow-morning',
      label: 'Tomorrow 8AM - 12PM',
      price: 30,
      available: true,
    },
    {
      id: 'tomorrow-evening',
      label: 'Tomorrow 4PM - 8PM',
      price: 30,
      available: true,
    },
    {
      id: 'day-after-morning',
      label: 'Day After Tomorrow 8AM - 12PM',
      price: 20,
      available: true,
    },
    {
      id: 'standard',
      label: 'Standard Delivery (2-3 days)',
      price: 0,
      available: true,
    },
  ];

  // Mock available coupons
  const availableCoupons = [
    {
      code: 'FRESH20',
      discount: 20,
      type: 'percentage',
      minOrder: 300,
      description: '20% off on orders above ₹300',
    },
    {
      code: 'FIRST50',
      discount: 50,
      type: 'fixed',
      minOrder: 200,
      description: '₹50 off on your first order',
    },
    {
      code: 'ORGANIC15',
      discount: 15,
      type: 'percentage',
      minOrder: 500,
      description: '15% off on organic products',
    },
  ];

  useEffect(() => {
    // Calculate estimated savings based on bulk purchases
    const savings = cartItems.reduce((total, item) => {
      if (item.quantity >= 2 && item.originalPrice) {
        return total + (item.originalPrice - item.price) * item.quantity;
      }
      return total;
    }, 0);
    setEstimatedSavings(savings);
  }, [cartItems]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const validCoupon = availableCoupons.find(
        (c) => c.code === couponCode.toUpperCase()
      );

      if (!validCoupon) {
        setCouponError('Invalid coupon code');
        return;
      }

      if (subtotal < validCoupon.minOrder) {
        setCouponError(
          `Minimum order amount ₹${validCoupon.minOrder} required`
        );
        return;
      }

      dispatch(applyCoupon(validCoupon));
      setCouponCode('');
    } catch {
      setCouponError('Failed to apply coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearCartModal(false);
  };

  const handleProceedToCheckout = () => {
    if (cartStep === 'cart') {
      setCartStep('delivery');
    } else if (cartStep === 'delivery') {
      if (!selectedDeliverySlot) {
        alert('Please select a delivery slot');
        return;
      }
      setCartStep('summary');
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const couponDiscount = useMemo(() => {
    if (!coupon) return 0;

    if (coupon.type === 'percentage') {
      return Math.round((subtotal * coupon.discount) / 100);
    } else {
      return coupon.discount;
    }
  }, [coupon, subtotal]);

  const selectedSlot = deliverySlots.find(
    (slot) => slot.id === selectedDeliverySlot
  );
  const deliveryCharge = selectedSlot
    ? selectedSlot.price
    : subtotal >= 500
      ? 0
      : 50;

  const total = useMemo(
    () => Math.max(0, subtotal - couponDiscount + deliveryCharge),
    [subtotal, couponDiscount, deliveryCharge]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shopping Cart' },
  ];

  if (isLoading) {
    return (
      <div
        className='min-h-screen'
        style={{ backgroundColor: 'var(--neutral-50)' }}
      >
        <Loader />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div
        className='min-h-screen'
        style={{ backgroundColor: 'var(--neutral-50)' }}
      >
        <div className='container py-12'>
          <div className='max-w-2xl mx-auto text-center'>
            <div
              className='w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center'
              style={{ backgroundColor: 'var(--neutral-100)' }}
            >
              <svg
                className='w-16 h-16'
                style={{ color: 'var(--neutral-400)' }}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h7a1 1 0 001-1v-6m-8 0V9a1 1 0 011-1h6a1 1 0 011 1v4.01'
                />
              </svg>
            </div>

            <h1
              className='text-3xl font-bold mb-4'
              style={{ color: 'var(--neutral-900)' }}
            >
              Your cart is empty
            </h1>

            <p className='text-lg mb-8' style={{ color: 'var(--neutral-600)' }}>
              Discover fresh, organic produce from local farmers and start
              building your healthy lifestyle!
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/products'>
                <Button variant='primary' size='lg'>
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
                </Button>
              </Link>

              <Link to='/categories'>
                <Button variant='outline' size='lg'>
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main
      className='min-h-screen'
      style={{ backgroundColor: 'var(--neutral-50)' }}
    >
      <div className='container py-8'>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className='mb-8' />

        {/* Progress Indicator */}
        <div className='mb-8'>
          <div className='flex items-center justify-center mb-4'>
            {['Cart', 'Delivery', 'Summary'].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                    index <= ['cart', 'delivery', 'summary'].indexOf(cartStep)
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index < ['cart', 'delivery', 'summary'].indexOf(cartStep)
                        ? 'bg-primary-600'
                        : 'bg-neutral-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className='text-center'>
            <h1
              className='text-2xl font-bold'
              style={{ color: 'var(--neutral-900)' }}
            >
              {cartStep === 'cart'
                ? 'Shopping Cart'
                : cartStep === 'delivery'
                  ? 'Select Delivery'
                  : 'Order Summary'}
            </h1>
            <p style={{ color: 'var(--neutral-600)' }}>
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {cartStep === 'cart' && (
              <>
                {/* Savings Alert */}
                {estimatedSavings > 0 && (
                  <Alert variant='success' className='mb-6'>
                    <div className='flex items-center gap-2'>
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                        />
                      </svg>
                      <span className='font-medium'>
                        You're saving ₹{estimatedSavings} with bulk purchases!
                      </span>
                    </div>
                  </Alert>
                )}

                {/* Cart Items */}
                <Card className='mb-6'>
                  <div
                    className='p-6 border-b'
                    style={{ borderColor: 'var(--neutral-200)' }}
                  >
                    <div className='flex justify-between items-center'>
                      <h2
                        className='text-xl font-semibold'
                        style={{ color: 'var(--neutral-900)' }}
                      >
                        Cart Items
                      </h2>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setShowClearCartModal(true)}
                        className='text-red-600 border-red-300 hover:bg-red-50'
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>

                  <div
                    className='divide-y'
                    style={{ borderColor: 'var(--neutral-200)' }}
                  >
                    {cartItems.map((item) => (
                      <div key={item.id} className='p-6'>
                        <div className='flex gap-4'>
                          {/* Product Image */}
                          <div className='flex-shrink-0'>
                            <img
                              src={item.image}
                              alt={item.name}
                              className='w-20 h-20 object-cover rounded-lg'
                            />
                          </div>

                          {/* Product Details */}
                          <div className='flex-1 min-w-0'>
                            <div className='flex justify-between items-start mb-2'>
                              <div>
                                <h3
                                  className='font-semibold'
                                  style={{ color: 'var(--neutral-900)' }}
                                >
                                  {item.name}
                                </h3>
                                <p
                                  className='text-sm'
                                  style={{ color: 'var(--neutral-600)' }}
                                >
                                  by {item.farmer}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className='p-1 text-neutral-400 hover:text-red-500 transition-colors'
                                title='Remove item'
                              >
                                <svg
                                  className='w-4 h-4'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-4'>
                                <div
                                  className='flex items-center border rounded-lg'
                                  style={{ borderColor: 'var(--neutral-300)' }}
                                >
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className='p-2 hover:bg-neutral-100 transition-colors'
                                    disabled={item.quantity <= 1}
                                  >
                                    <svg
                                      className='w-4 h-4'
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
                                  <span className='px-4 py-2 font-medium'>
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className='p-2 hover:bg-neutral-100 transition-colors'
                                  >
                                    <svg
                                      className='w-4 h-4'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 4v16m8-8H4'
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <span
                                  className='text-sm'
                                  style={{ color: 'var(--neutral-600)' }}
                                >
                                  {item.unit}
                                </span>
                              </div>

                              <div className='text-right'>
                                <div
                                  className='font-semibold'
                                  style={{ color: 'var(--primary-600)' }}
                                >
                                  ₹{item.price * item.quantity}
                                </div>
                                <div
                                  className='text-sm'
                                  style={{ color: 'var(--neutral-500)' }}
                                >
                                  ₹{item.price} per {item.unit}
                                </div>
                              </div>
                            </div>

                            {/* Stock Status */}
                            {item.stock && (
                              <div className='mt-2'>
                                <Badge
                                  variant={
                                    item.stock > 10
                                      ? 'success'
                                      : item.stock > 0
                                        ? 'warning'
                                        : 'error'
                                  }
                                  className='text-xs'
                                >
                                  {item.stock > 0
                                    ? `${item.stock} ${item.unit} in stock`
                                    : 'Out of stock'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Coupon Section */}
                <Card className='mb-6'>
                  <div className='p-6'>
                    <h3
                      className='font-semibold mb-4'
                      style={{ color: 'var(--neutral-900)' }}
                    >
                      Apply Coupon
                    </h3>

                    {coupon ? (
                      <div
                        className='flex items-center justify-between p-4 rounded-lg'
                        style={{ backgroundColor: 'var(--success-50)' }}
                      >
                        <div className='flex items-center gap-2'>
                          <svg
                            className='w-5 h-5'
                            style={{ color: 'var(--success-600)' }}
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                          </svg>
                          <div>
                            <div
                              className='font-medium'
                              style={{ color: 'var(--success-700)' }}
                            >
                              {coupon.code} Applied
                            </div>
                            <div
                              className='text-sm'
                              style={{ color: 'var(--success-600)' }}
                            >
                              You saved ₹{couponDiscount}!
                            </div>
                          </div>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={handleRemoveCoupon}
                          className='text-red-600 border-red-300 hover:bg-red-50'
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        <div className='flex gap-4'>
                          <input
                            type='text'
                            value={couponCode}
                            onChange={(e) =>
                              setCouponCode(e.target.value.toUpperCase())
                            }
                            placeholder='Enter coupon code'
                            className='input flex-1'
                            disabled={isApplyingCoupon}
                            onKeyPress={(e) =>
                              e.key === 'Enter' && handleApplyCoupon()
                            }
                          />
                          <Button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon || !couponCode.trim()}
                            variant='outline'
                          >
                            {isApplyingCoupon ? 'Applying...' : 'Apply'}
                          </Button>
                        </div>

                        {couponError && (
                          <Alert variant='error' className='text-sm'>
                            {couponError}
                          </Alert>
                        )}

                        {/* Available Coupons */}
                        <div>
                          <h4
                            className='text-sm font-medium mb-2'
                            style={{ color: 'var(--neutral-700)' }}
                          >
                            Available Coupons:
                          </h4>
                          <div className='space-y-2'>
                            {availableCoupons.map((couponItem) => (
                              <div
                                key={couponItem.code}
                                className='p-3 border rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors'
                                style={{ borderColor: 'var(--neutral-200)' }}
                                onClick={() => setCouponCode(couponItem.code)}
                              >
                                <div className='flex justify-between items-center'>
                                  <div>
                                    <div
                                      className='font-medium text-sm'
                                      style={{ color: 'var(--primary-600)' }}
                                    >
                                      {couponItem.code}
                                    </div>
                                    <div
                                      className='text-xs'
                                      style={{ color: 'var(--neutral-600)' }}
                                    >
                                      {couponItem.description}
                                    </div>
                                  </div>
                                  <Badge variant='info' className='text-xs'>
                                    {couponItem.type === 'percentage'
                                      ? `${couponItem.discount}% OFF`
                                      : `₹${couponItem.discount} OFF`}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}

            {cartStep === 'delivery' && (
              <Card>
                <div className='p-6'>
                  <h2
                    className='text-xl font-semibold mb-6'
                    style={{ color: 'var(--neutral-900)' }}
                  >
                    Select Delivery Time
                  </h2>

                  <div className='space-y-4'>
                    {deliverySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedDeliverySlot === slot.id
                            ? 'border-primary-500 bg-primary-50'
                            : slot.available
                              ? 'border-neutral-200 hover:border-primary-300'
                              : 'border-neutral-200 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          slot.available && setSelectedDeliverySlot(slot.id)
                        }
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <input
                              type='radio'
                              checked={selectedDeliverySlot === slot.id}
                              onChange={() =>
                                slot.available &&
                                setSelectedDeliverySlot(slot.id)
                              }
                              disabled={!slot.available}
                              className='text-primary-600'
                            />
                            <div>
                              <div
                                className='font-medium'
                                style={{ color: 'var(--neutral-900)' }}
                              >
                                {slot.label}
                              </div>
                              {!slot.available && (
                                <div className='text-sm text-red-600'>
                                  Not Available
                                </div>
                              )}
                            </div>
                          </div>
                          <div className='text-right'>
                            <div
                              className='font-medium'
                              style={{ color: 'var(--primary-600)' }}
                            >
                              {slot.price === 0 ? 'FREE' : `₹${slot.price}`}
                            </div>
                            {slot.price === 0 && (
                              <div
                                className='text-xs'
                                style={{ color: 'var(--success-600)' }}
                              >
                                Free Delivery
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className='mt-6 p-4 rounded-lg'
                    style={{ backgroundColor: 'var(--info-50)' }}
                  >
                    <div className='flex items-start gap-2'>
                      <svg
                        className='w-5 h-5 mt-0.5'
                        style={{ color: 'var(--info-600)' }}
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
                      <div
                        className='text-sm'
                        style={{ color: 'var(--info-700)' }}
                      >
                        <div className='font-medium mb-1'>
                          Delivery Information
                        </div>
                        <ul className='space-y-1 text-xs'>
                          <li>• All deliveries include freshness guarantee</li>
                          <li>• Free delivery on orders above ₹500</li>
                          <li>
                            • Same-day delivery available for limited areas
                          </li>
                          <li>
                            • You'll receive SMS updates for your delivery
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {cartStep === 'summary' && (
              <Card>
                <div className='p-6'>
                  <h2
                    className='text-xl font-semibold mb-6'
                    style={{ color: 'var(--neutral-900)' }}
                  >
                    Order Summary
                  </h2>

                  {/* Order Items */}
                  <div className='space-y-4 mb-6'>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className='flex justify-between items-center'
                      >
                        <div className='flex items-center gap-3'>
                          <img
                            src={item.image}
                            alt={item.name}
                            className='w-12 h-12 object-cover rounded'
                          />
                          <div>
                            <div
                              className='font-medium'
                              style={{ color: 'var(--neutral-900)' }}
                            >
                              {item.name}
                            </div>
                            <div
                              className='text-sm'
                              style={{ color: 'var(--neutral-600)' }}
                            >
                              Qty: {item.quantity} × ₹{item.price}
                            </div>
                          </div>
                        </div>
                        <div
                          className='font-medium'
                          style={{ color: 'var(--primary-600)' }}
                        >
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  {selectedSlot && (
                    <div
                      className='p-4 border rounded-lg mb-6'
                      style={{
                        borderColor: 'var(--neutral-200)',
                        backgroundColor: 'var(--neutral-50)',
                      }}
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        <svg
                          className='w-5 h-5'
                          style={{ color: 'var(--primary-600)' }}
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                          />
                        </svg>
                        <span
                          className='font-medium'
                          style={{ color: 'var(--neutral-900)' }}
                        >
                          Delivery Details
                        </span>
                      </div>
                      <div
                        className='text-sm'
                        style={{ color: 'var(--neutral-700)' }}
                      >
                        {selectedSlot.label} -{' '}
                        {selectedSlot.price === 0
                          ? 'FREE'
                          : `₹${selectedSlot.price}`}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-8'>
              <div className='p-6'>
                <h2
                  className='text-xl font-semibold mb-6'
                  style={{ color: 'var(--neutral-900)' }}
                >
                  Order Summary
                </h2>

                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between'>
                    <span style={{ color: 'var(--neutral-700)' }}>
                      Subtotal ({totalItems} items)
                    </span>
                    <span className='font-medium'>₹{subtotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div
                      className='flex justify-between'
                      style={{ color: 'var(--success-600)' }}
                    >
                      <span>Coupon Discount</span>
                      <span className='font-medium'>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className='flex justify-between'>
                    <span style={{ color: 'var(--neutral-700)' }}>
                      Delivery Charges
                    </span>
                    <span className='font-medium'>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  {estimatedSavings > 0 && (
                    <div
                      className='flex justify-between'
                      style={{ color: 'var(--success-600)' }}
                    >
                      <span>You Saved</span>
                      <span className='font-medium'>₹{estimatedSavings}</span>
                    </div>
                  )}
                </div>

                <div
                  className='border-t pt-4 mb-6'
                  style={{ borderColor: 'var(--neutral-200)' }}
                >
                  <div className='flex justify-between items-center'>
                    <span
                      className='text-lg font-semibold'
                      style={{ color: 'var(--neutral-900)' }}
                    >
                      Total
                    </span>
                    <span
                      className='text-xl font-bold'
                      style={{ color: 'var(--primary-600)' }}
                    >
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='space-y-3'>
                  <Button
                    onClick={handleProceedToCheckout}
                    variant='primary'
                    size='lg'
                    className='w-full'
                  >
                    {cartStep === 'cart'
                      ? 'Continue to Delivery'
                      : cartStep === 'delivery'
                        ? 'Review Order'
                        : 'Proceed to Checkout'}
                  </Button>

                  {cartStep !== 'cart' && (
                    <Button
                      onClick={() =>
                        setCartStep(
                          cartStep === 'delivery' ? 'cart' : 'delivery'
                        )
                      }
                      variant='outline'
                      size='lg'
                      className='w-full'
                    >
                      Back
                    </Button>
                  )}

                  <Link to='/products' className='block'>
                    <Button variant='outline' size='lg' className='w-full'>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Free Delivery Progress */}
                {subtotal < 500 && (
                  <div
                    className='mt-6 p-4 rounded-lg'
                    style={{ backgroundColor: 'var(--info-50)' }}
                  >
                    <div
                      className='text-sm font-medium mb-2'
                      style={{ color: 'var(--info-700)' }}
                    >
                      Add ₹{500 - subtotal} more for FREE delivery!
                    </div>
                    <ProgressBar
                      value={(subtotal / 500) * 100}
                      className='h-2'
                    />
                  </div>
                )}

                {/* Security Badge */}
                <div
                  className='mt-6 flex items-center justify-center gap-2 text-sm'
                  style={{ color: 'var(--neutral-600)' }}
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                    />
                  </svg>
                  <span>Secure & Safe Payments</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Clear Cart Modal */}
      <Modal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        title='Clear Cart'
      >
        <div className='text-center'>
          <svg
            className='w-16 h-16 mx-auto mb-4 text-red-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
          <h3 className='text-lg font-semibold mb-2'>Are you sure?</h3>
          <p className='mb-6' style={{ color: 'var(--neutral-600)' }}>
            This will remove all items from your cart. This action cannot be
            undone.
          </p>
          <div className='flex gap-4 justify-center'>
            <Button
              onClick={handleClearCart}
              variant='primary'
              className='bg-red-600 hover:bg-red-700'
            >
              Yes, Clear Cart
            </Button>
            <Button
              onClick={() => setShowClearCartModal(false)}
              variant='outline'
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default CartEnhanced;
