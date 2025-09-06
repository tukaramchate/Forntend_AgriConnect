import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import './Checkout.css';

function isEmail(v) {
  return /^\S+@\S+\.\S+$/.test(v);
}
function isPhone(v) {
  return /^\d{10,}$/.test(v.replace(/\s+/g, ''));
}
function isPincode(v) {
  return /^\d{4,6}$/.test(v);
}

function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock order summary
  const orderSummary = {
    items: [
      { name: "Fresh Organic Tomatoes", quantity: 2, price: 45, unit: "kg" },
      { name: "Fresh Milk", quantity: 1, price: 60, unit: "liter" }
    ],
    subtotal: 150,
    deliveryCharge: 50,
    total: 200
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'radio' ? value : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const err = {};
    if (!formData.firstName.trim()) err.firstName = 'First name is required';
    if (!formData.lastName.trim()) err.lastName = 'Last name is required';
    if (!isEmail(formData.email)) err.email = 'Enter a valid email';
    if (!isPhone(formData.phone)) err.phone = 'Enter a valid phone number';
    if (!formData.address.trim()) err.address = 'Address is required';
    if (!formData.city.trim()) err.city = 'City is required';
    if (!formData.state.trim()) err.state = 'State is required';
    if (!isPincode(formData.pincode)) err.pincode = 'Enter a valid pincode';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // TODO: create real order and redirect to order confirmation
      navigate('/orders');
    }, 1400);
  };

  const isFormValid = () => Object.keys(validate()).length === 0;

  return (
    <div className="ac-checkout-page">
      {isSubmitting && <Loader overlay={true} text="Placing your order..." size="large" />}
      <div className="ac-container">
        <h1 className="ac-page-title">Checkout</h1>

        <div className="ac-checkout-layout">
          {/* Checkout Form */}
          <div className="ac-checkout-form" aria-labelledby="checkout-form-title">
            <form onSubmit={handleSubmit} noValidate>
              <div className="ac-form-section">
                <h3 id="checkout-form-title">Personal Information</h3>
                <div className="ac-form-row">
                  <div className="ac-form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="ac-form-input"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? 'err-firstName' : undefined}
                    />
                    {errors.firstName && <div id="err-firstName" className="ac-field-error">{errors.firstName}</div>}
                  </div>
                  <div className="ac-form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="ac-form-input"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? 'err-lastName' : undefined}
                    />
                    {errors.lastName && <div id="err-lastName" className="ac-field-error">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="ac-form-row">
                  <div className="ac-form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="ac-form-input"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'err-email' : undefined}
                    />
                    {errors.email && <div id="err-email" className="ac-field-error">{errors.email}</div>}
                  </div>
                  <div className="ac-form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="ac-form-input"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'err-phone' : undefined}
                    />
                    {errors.phone && <div id="err-phone" className="ac-field-error">{errors.phone}</div>}
                  </div>
                </div>
              </div>

              <div className="ac-form-section">
                <h3>Delivery Address</h3>
                <div className="ac-form-group">
                  <label htmlFor="address">Street Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="ac-form-textarea"
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? 'err-address' : undefined}
                  />
                  {errors.address && <div id="err-address" className="ac-field-error">{errors.address}</div>}
                </div>

                <div className="ac-form-row">
                  <div className="ac-form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="ac-form-input"
                      aria-invalid={!!errors.city}
                      aria-describedby={errors.city ? 'err-city' : undefined}
                    />
                    {errors.city && <div id="err-city" className="ac-field-error">{errors.city}</div>}
                  </div>
                  <div className="ac-form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="ac-form-input"
                      aria-invalid={!!errors.state}
                      aria-describedby={errors.state ? 'err-state' : undefined}
                    />
                    {errors.state && <div id="err-state" className="ac-field-error">{errors.state}</div>}
                  </div>
                </div>

                <div className="ac-form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    className="ac-form-input"
                    maxLength="6"
                    aria-invalid={!!errors.pincode}
                    aria-describedby={errors.pincode ? 'err-pincode' : undefined}
                  />
                  {errors.pincode && <div id="err-pincode" className="ac-field-error">{errors.pincode}</div>}
                </div>
              </div>

              <div className="ac-form-section">
                <h3>Payment Method</h3>
                <div className="ac-payment-options" role="radiogroup" aria-label="Payment method">
                  <label className="ac-payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <span className="ac-payment-label">
                      <span className="ac-payment-icon">💵</span>
                      Cash on Delivery
                    </span>
                  </label>

                  <label className="ac-payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <span className="ac-payment-label">
                      <span className="ac-payment-icon">📱</span>
                      UPI Payment
                    </span>
                  </label>

                  <label className="ac-payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <span className="ac-payment-label">
                      <span className="ac-payment-icon">💳</span>
                      Credit/Debit Card
                    </span>
                  </label>
                </div>
              </div>

              <div className="ac-form-actions">
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className="ac-btn ac-btn--primary ac-btn--large ac-btn--full"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="ac-order-summary" aria-labelledby="order-summary-title">
            <h3 id="order-summary-title">Order Summary</h3>

            <div className="ac-order-items" aria-live="polite">
              {orderSummary.items.map((item, index) => (
                <div key={index} className="ac-order-item">
                  <div className="ac-order-item__details">
                    <span className="ac-item-name">{item.name}</span>
                    <span className="ac-item-quantity">{item.quantity} {item.unit}</span>
                  </div>
                  <span className="ac-item-price" aria-label={`Price: ₹${item.price * item.quantity}`}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="ac-order-totals" aria-labelledby="order-totals-title">
              <div className="ac-summary-row">
                <span>Subtotal</span>
                <span>₹{orderSummary.subtotal}</span>
              </div>
              <div className="ac-summary-row">
                <span>Delivery Charge</span>
                <span>₹{orderSummary.deliveryCharge}</span>
              </div>
              <div className="ac-summary-row ac-summary-total" id="order-total">
                <span>Total</span>
                <span>₹{orderSummary.total}</span>
              </div>
            </div>

            <div className="ac-delivery-info" aria-labelledby="delivery-info-title">
              <h4 id="delivery-info-title">Delivery Information</h4>
              <p>• Same day delivery for orders placed before 2 PM</p>
              <p>• Next day delivery for orders placed after 2 PM</p>
              <p>• Free delivery on orders above ₹500</p>
            </div>

            <div className="ac-security-info" aria-labelledby="security-info-title">
              <h4 id="security-info-title">Security & Privacy</h4>
              <p>• Your payment information is secure</p>
              <p>• We never store your card details</p>
              <p>• 100% secure checkout process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
