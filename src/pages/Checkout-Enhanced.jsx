import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import { Button, Card, Badge, Alert, Modal, Breadcrumb, ProgressBar } from '../components/ui';
import Loader from '../components/Loader';
import '../styles/design-system.css';

const CheckoutEnhanced = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, coupon } = useSelector((state) => state.cart || { items: [], coupon: null });
  const { isAuthenticated, user } = useSelector((state) => state.auth || { isAuthenticated: false, user: null });

  const [currentStep, setCurrentStep] = useState('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryInstructions: ''
  });



  const [paymentData, setPaymentData] = useState({
    method: 'cod',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardName: '',
    upiId: '',
    bankAccount: '',
    saveCard: false
  });

  const [errors, setErrors] = useState({});
  const [guestCheckout, setGuestCheckout] = useState(!isAuthenticated);

  // Mock saved addresses for authenticated users
  const savedAddresses = [
    {
      id: 1,
      label: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Green Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      phone: '9876543210'
    },
    {
      id: 2,
      label: 'Office',
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Business Park, Tower A',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      phone: '9876543210'
    }
  ];

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: '📍' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'review', label: 'Review', icon: '📋' }
  ];

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const validateShipping = () => {
    const newErrors = {};
    
    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(shippingData.email)) newErrors.email = 'Please enter a valid email';
    if (!shippingData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(shippingData.phone.replace(/\s+/g, ''))) newErrors.phone = 'Please enter a valid 10-digit phone number';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.state.trim()) newErrors.state = 'State is required';
    if (!shippingData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(shippingData.pincode)) newErrors.pincode = 'Please enter a valid 6-digit pincode';
    
    return newErrors;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentData.method === 'card') {
      if (!paymentData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s+/g, ''))) newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      if (!paymentData.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
      if (!paymentData.expiryYear) newErrors.expiryYear = 'Expiry year is required';
      if (!paymentData.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(paymentData.cvv)) newErrors.cvv = 'Please enter a valid CVV';
      if (!paymentData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    } else if (paymentData.method === 'upi') {
      if (!paymentData.upiId.trim()) newErrors.upiId = 'UPI ID is required';
      else if (!/^[\w.-]+@[\w.-]+$/.test(paymentData.upiId)) newErrors.upiId = 'Please enter a valid UPI ID';
    } else if (paymentData.method === 'netbanking') {
      if (!paymentData.bankAccount) newErrors.bankAccount = 'Please select a bank';
    }
    
    return newErrors;
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'payment') {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressSelect = (address) => {
    setShippingData(prev => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone
    }));
  };

  const handleStepChange = (step) => {
    if (step === 'payment' && currentStep === 'shipping') {
      const shippingErrors = validateShipping();
      if (Object.keys(shippingErrors).length > 0) {
        setErrors(shippingErrors);
        return;
      }
    } else if (step === 'review' && currentStep === 'payment') {
      const paymentErrors = validatePayment();
      if (Object.keys(paymentErrors).length > 0) {
        setErrors(paymentErrors);
        return;
      }
    }
    
    setErrors({});
    setCurrentStep(step);
  };

  const handleSubmitOrder = async () => {
    const shippingErrors = validateShipping();
    const paymentErrors = validatePayment();
    const allErrors = { ...shippingErrors, ...paymentErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock order ID
      const newOrderId = 'AC' + Date.now().toString().slice(-6);
      setOrderId(newOrderId);
      
      // Clear cart
      dispatch(clearCart());
      
      // Show confirmation
      setShowOrderConfirmation(true);
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const couponDiscount = coupon ? (coupon.type === 'percentage' ? Math.round((subtotal * coupon.discount) / 100) : coupon.discount) : 0;
    const deliveryCharge = subtotal >= 500 ? 0 : 50;
    const total = Math.max(0, subtotal - couponDiscount + deliveryCharge);
    
    return { subtotal, couponDiscount, deliveryCharge, total };
  };

  const { subtotal, couponDiscount, deliveryCharge, total } = calculateTotals();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' },
    { label: 'Checkout' }
  ];

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--neutral-50)' }}>
      <div className="container py-8">
        
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex flex-col items-center cursor-pointer ${
                  currentStep === step.id ? 'text-primary-600' : 
                  steps.findIndex(s => s.id === currentStep) > index ? 'text-success-600' : 'text-neutral-400'
                }`} onClick={() => handleStepChange(step.id)}>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg mb-2 ${
                    currentStep === step.id ? 'bg-primary-600 text-white' : 
                    steps.findIndex(s => s.id === currentStep) > index ? 'bg-success-600 text-white' : 'bg-neutral-200'
                  }`}>
                    {steps.findIndex(s => s.id === currentStep) > index ? '✓' : step.icon}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-4 ${
                    steps.findIndex(s => s.id === currentStep) > index ? 'bg-success-600' : 'bg-neutral-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--neutral-900)' }}>
              {steps.find(s => s.id === currentStep)?.label || 'Checkout'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Guest Checkout Option */}
            {!isAuthenticated && (
              <Card className="mb-6">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>
                      Checkout Options
                    </h2>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={guestCheckout}
                        onChange={() => setGuestCheckout(true)}
                        className="text-primary-600"
                      />
                      <span>Guest Checkout</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!guestCheckout}
                        onChange={() => setGuestCheckout(false)}
                        className="text-primary-600"
                      />
                      <span>Create Account</span>
                    </label>
                  </div>
                  {!guestCheckout && (
                    <Alert variant="info" className="mt-4">
                      You'll be able to create an account after placing your order.
                    </Alert>
                  )}
                </div>
              </Card>
            )}

            {/* Shipping Information */}
            {currentStep === 'shipping' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--neutral-900)' }}>
                    Shipping Information
                  </h2>

                  {/* Saved Addresses for Authenticated Users */}
                  {isAuthenticated && savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3" style={{ color: 'var(--neutral-700)' }}>
                        Saved Addresses
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            className="p-4 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                            style={{ borderColor: 'var(--neutral-200)' }}
                            onClick={() => handleAddressSelect(address)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="info" className="text-xs">{address.label}</Badge>
                            </div>
                            <div className="text-sm" style={{ color: 'var(--neutral-700)' }}>
                              <div className="font-medium">{address.firstName} {address.lastName}</div>
                              <div>{address.address}</div>
                              <div>{address.city}, {address.state} {address.pincode}</div>
                              <div>{address.phone}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-6 pt-6" style={{ borderColor: 'var(--neutral-200)' }}>
                        <h3 className="font-medium mb-3" style={{ color: 'var(--neutral-700)' }}>
                          Or enter new address
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Shipping Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                        className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                        className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                        className={`input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                        className={`input ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        Address *
                      </label>
                      <textarea
                        value={shippingData.address}
                        onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                        className={`input min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                        placeholder="Enter full address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        className={`input ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Enter city"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        State *
                      </label>
                      <select
                        value={shippingData.state}
                        onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                        className={`input ${errors.state ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={shippingData.pincode}
                        onChange={(e) => handleInputChange('shipping', 'pincode', e.target.value)}
                        className={`input ${errors.pincode ? 'border-red-500' : ''}`}
                        placeholder="Enter pincode"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        value={shippingData.deliveryInstructions}
                        onChange={(e) => handleInputChange('shipping', 'deliveryInstructions', e.target.value)}
                        className="input min-h-[60px]"
                        placeholder="Any special delivery instructions..."
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Payment Information */}
            {currentStep === 'payment' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--neutral-900)' }}>
                    Payment Information
                  </h2>

                  {/* Payment Methods */}
                  <div className="space-y-4 mb-6">
                    {/* Cash on Delivery */}
                    <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentData.method === 'cod' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-200 hover:border-primary-300'
                    }`} onClick={() => handleInputChange('payment', 'method', 'cod')}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={paymentData.method === 'cod'}
                          onChange={() => handleInputChange('payment', 'method', 'cod')}
                          className="text-primary-600"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💰</span>
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                              Pay when your order is delivered
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Credit/Debit Card */}
                    <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentData.method === 'card' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-200 hover:border-primary-300'
                    }`} onClick={() => handleInputChange('payment', 'method', 'card')}>
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="radio"
                          checked={paymentData.method === 'card'}
                          onChange={() => handleInputChange('payment', 'method', 'card')}
                          className="text-primary-600"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💳</span>
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                              Visa, Mastercard, RuPay accepted
                            </div>
                          </div>
                        </div>
                      </div>

                      {paymentData.method === 'card' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                              Card Number *
                            </label>
                            <input
                              type="text"
                              value={paymentData.cardNumber}
                              onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                              className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                            {errors.cardNumber && (
                              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                              Expiry Month *
                            </label>
                            <select
                              value={paymentData.expiryMonth}
                              onChange={(e) => handleInputChange('payment', 'expiryMonth', e.target.value)}
                              className={`input ${errors.expiryMonth ? 'border-red-500' : ''}`}
                            >
                              <option value="">Month</option>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <option key={month} value={month.toString().padStart(2, '0')}>
                                  {month.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            {errors.expiryMonth && (
                              <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                              Expiry Year *
                            </label>
                            <select
                              value={paymentData.expiryYear}
                              onChange={(e) => handleInputChange('payment', 'expiryYear', e.target.value)}
                              className={`input ${errors.expiryYear ? 'border-red-500' : ''}`}
                            >
                              <option value="">Year</option>
                              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                <option key={year} value={year.toString()}>
                                  {year}
                                </option>
                              ))}
                            </select>
                            {errors.expiryYear && (
                              <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                              CVV *
                            </label>
                            <input
                              type="text"
                              value={paymentData.cvv}
                              onChange={(e) => handleInputChange('payment', 'cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                              className={`input ${errors.cvv ? 'border-red-500' : ''}`}
                              placeholder="123"
                              maxLength={4}
                            />
                            {errors.cvv && (
                              <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                              Cardholder Name *
                            </label>
                            <input
                              type="text"
                              value={paymentData.cardName}
                              onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                              className={`input ${errors.cardName ? 'border-red-500' : ''}`}
                              placeholder="Name on card"
                            />
                            {errors.cardName && (
                              <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={paymentData.saveCard}
                                onChange={(e) => handleInputChange('payment', 'saveCard', e.target.checked)}
                                className="text-primary-600"
                              />
                              <span className="text-sm">Save card for future purchases</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* UPI */}
                    <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentData.method === 'upi' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-200 hover:border-primary-300'
                    }`} onClick={() => handleInputChange('payment', 'method', 'upi')}>
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="radio"
                          checked={paymentData.method === 'upi'}
                          onChange={() => handleInputChange('payment', 'method', 'upi')}
                          className="text-primary-600"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📱</span>
                          <div>
                            <div className="font-medium">UPI Payment</div>
                            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                              Pay using your UPI ID
                            </div>
                          </div>
                        </div>
                      </div>

                      {paymentData.method === 'upi' && (
                        <div className="ml-8">
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                            UPI ID *
                          </label>
                          <input
                            type="text"
                            value={paymentData.upiId}
                            onChange={(e) => handleInputChange('payment', 'upiId', e.target.value)}
                            className={`input ${errors.upiId ? 'border-red-500' : ''}`}
                            placeholder="yourname@upi"
                          />
                          {errors.upiId && (
                            <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Net Banking */}
                    <div className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentData.method === 'netbanking' 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-200 hover:border-primary-300'
                    }`} onClick={() => handleInputChange('payment', 'method', 'netbanking')}>
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="radio"
                          checked={paymentData.method === 'netbanking'}
                          onChange={() => handleInputChange('payment', 'method', 'netbanking')}
                          className="text-primary-600"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏦</span>
                          <div>
                            <div className="font-medium">Net Banking</div>
                            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                              Pay directly from your bank account
                            </div>
                          </div>
                        </div>
                      </div>

                      {paymentData.method === 'netbanking' && (
                        <div className="ml-8">
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                            Select Bank *
                          </label>
                          <select
                            value={paymentData.bankAccount}
                            onChange={(e) => handleInputChange('payment', 'bankAccount', e.target.value)}
                            className={`input ${errors.bankAccount ? 'border-red-500' : ''}`}
                          >
                            <option value="">Choose your bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="pnb">Punjab National Bank</option>
                            <option value="bob">Bank of Baroda</option>
                          </select>
                          {errors.bankAccount && (
                            <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--info-50)' }}>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5" style={{ color: 'var(--info-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="text-sm" style={{ color: 'var(--info-700)' }}>
                        <div className="font-medium mb-1">Secure Payment</div>
                        <p>Your payment information is encrypted and secure. We never store your card details.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Order Review */}
            {currentStep === 'review' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--neutral-900)' }}>
                    Review Your Order
                  </h2>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-4" style={{ color: 'var(--neutral-700)' }}>
                      Order Items ({totalItems})
                    </h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--neutral-50)' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="font-medium" style={{ color: 'var(--neutral-900)' }}>
                              {item.name}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                              by {item.farmer}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                              Qty: {item.quantity} × ₹{item.price}
                            </div>
                          </div>
                          <div className="font-medium" style={{ color: 'var(--primary-600)' }}>
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 border rounded-lg" style={{ borderColor: 'var(--neutral-200)' }}>
                    <h3 className="font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                      Shipping Address
                    </h3>
                    <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                      <div>{shippingData.firstName} {shippingData.lastName}</div>
                      <div>{shippingData.address}</div>
                      <div>{shippingData.city}, {shippingData.state} {shippingData.pincode}</div>
                      <div>{shippingData.phone}</div>
                      <div>{shippingData.email}</div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6 p-4 border rounded-lg" style={{ borderColor: 'var(--neutral-200)' }}>
                    <h3 className="font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                      Payment Method
                    </h3>
                    <div className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                      {paymentData.method === 'cod' && 'Cash on Delivery'}
                      {paymentData.method === 'card' && `Card ending in ${paymentData.cardNumber.slice(-4)}`}
                      {paymentData.method === 'upi' && `UPI: ${paymentData.upiId}`}
                      {paymentData.method === 'netbanking' && 'Net Banking'}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-6">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="text-primary-600 mt-1"
                        required
                      />
                      <span className="text-sm" style={{ color: 'var(--neutral-600)' }}>
                        I agree to the <a href="/terms" className="text-primary-600 hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep !== 'shipping' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStep === 'payment') setCurrentStep('shipping');
                    else if (currentStep === 'review') setCurrentStep('payment');
                  }}
                >
                  ← Back
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep === 'review' ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order - ₹${total}`}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleStepChange(currentStep === 'shipping' ? 'payment' : 'review')}
                  >
                    Continue →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--neutral-900)' }}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--neutral-700)' }}>Subtotal ({totalItems} items)</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between" style={{ color: 'var(--success-600)' }}>
                      <span>Coupon Discount</span>
                      <span className="font-medium">-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span style={{ color: 'var(--neutral-700)' }}>Delivery Charges</span>
                    <span className="font-medium">
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6" style={{ borderColor: 'var(--neutral-200)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold" style={{ color: 'var(--neutral-900)' }}>
                      Total Amount
                    </span>
                    <span className="text-xl font-bold" style={{ color: 'var(--primary-600)' }}>
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="space-y-3 text-sm" style={{ color: 'var(--neutral-600)' }}>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>100% secure payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Money back guarantee</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <Loader />
            <p className="mt-4 text-lg font-medium">Placing your order...</p>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      <Modal
        isOpen={showOrderConfirmation}
        onClose={() => {}}
        title=""
        size="md"
      >
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--success-100)' }}>
            <svg className="w-10 h-10" style={{ color: 'var(--success-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--neutral-900)' }}>
            Order Placed Successfully!
          </h2>
          
          <p className="mb-2" style={{ color: 'var(--neutral-600)' }}>
            Thank you for your order. Your order ID is:
          </p>
          
          <div className="text-xl font-bold mb-6" style={{ color: 'var(--primary-600)' }}>
            #{orderId}
          </div>
          
          <p className="mb-8 text-sm" style={{ color: 'var(--neutral-600)' }}>
            You will receive an email confirmation shortly. We'll notify you when your order is ready for delivery.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate('/orders')}
            >
              View Order Details
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
};

export default CheckoutEnhanced;