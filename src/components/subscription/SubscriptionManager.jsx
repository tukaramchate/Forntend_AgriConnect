import React, { useState, useEffect } from 'react';
import FadeIn from '../animations/FadeIn';
import InteractiveButton from '../interactions/InteractiveButton';
import './SubscriptionManager.css';

// Mock subscription plans data
const mockPlans = [
    {
      id: 'weekly-fresh',
      name: 'Weekly Fresh Box',
      description: 'Fresh seasonal vegetables and fruits delivered weekly',
      price: 899,
      originalPrice: 1099,
      frequency: 'weekly',
      category: 'fresh-produce',
      benefits: [
        '8-10 seasonal vegetables',
        '3-4 fresh fruits',
        'Free delivery',
        'Organic certified',
        'Farmer direct sourcing'
      ],
      image: '/images/subscription/weekly-fresh-box.jpg',
      discount: 18,
      popular: true
    },
    {
      id: 'monthly-essentials',
      name: 'Monthly Essentials',
      description: 'Essential groceries and staples for your family',
      price: 2499,
      originalPrice: 2999,
      frequency: 'monthly',
      category: 'essentials',
      benefits: [
        '10kg rice and wheat',
        'Cooking oils and spices',
        'Pulses and grains',
        'Free storage containers',
        'Bulk purchase savings'
      ],
      image: '/images/subscription/monthly-essentials.jpg',
      discount: 17
    },
    {
      id: 'dairy-delight',
      name: 'Daily Dairy Delight',
      description: 'Fresh dairy products delivered daily',
      price: 149,
      originalPrice: 179,
      frequency: 'daily',
      category: 'dairy',
      benefits: [
        '1L fresh milk',
        'Homemade curd',
        'Farm fresh eggs (6pcs)',
        'Early morning delivery',
        'Quality guaranteed'
      ],
      image: '/images/subscription/dairy-delight.jpg',
      discount: 17
    },
    {
      id: 'organic-premium',
      name: 'Premium Organic Box',
      description: 'Premium organic produce for health-conscious families',
      price: 1499,
      originalPrice: 1899,
      frequency: 'bi-weekly',
      category: 'organic',
      benefits: [
        'Certified organic vegetables',
        'Exotic fruits and herbs',
        'Recipe cards included',
        'Nutritionist consultation',
        '100% pesticide-free'
      ],
      image: '/images/subscription/organic-premium.jpg',
      discount: 21,
      premium: true
    }
];

// Mock active subscriptions
const mockSubscriptions = [
    {
      id: 'sub-001',
      planId: 'weekly-fresh',
      planName: 'Weekly Fresh Box',
      status: 'active',
      nextDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalDeliveries: 12,
      completedDeliveries: 8,
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      amount: 899,
      frequency: 'weekly',
      customizations: ['No onions', 'Extra carrots']
    },
    {
      id: 'sub-002',
      planId: 'dairy-delight',
      planName: 'Daily Dairy Delight',
      status: 'paused',
      nextDelivery: null,
      totalDeliveries: 30,
      completedDeliveries: 22,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      amount: 149,
      frequency: 'daily',
      pausedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
];

/**
 * Comprehensive subscription management system with subscription boxes,
 * recurring orders, and flexible subscription plans
 */
const SubscriptionManager = ({ 
  userId,
  onSubscriptionUpdate,
  showPlans = true,
  showActiveSubscriptions = true 
}) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        setLoading(true);
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAvailablePlans(mockPlans);
        setSubscriptions(mockSubscriptions);
      } catch (error) {
        console.error('Failed to load subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, [userId]);

  const handleSubscribe = async (plan) => {
    try {
      setLoading(true);
      // Simulate subscription creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSubscription = {
        id: `sub-${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        status: 'active',
        nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalDeliveries: 0,
        completedDeliveries: 0,
        startDate: new Date(),
        amount: plan.price,
        frequency: plan.frequency
      };

      setSubscriptions(prev => [...prev, newSubscription]);
      setShowPlanModal(false);
      
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate(newSubscription, 'created');
      }
    } catch (error) {
      console.error('Failed to create subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseResume = async (subscriptionId, action) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? {
              ...sub,
              status: action === 'pause' ? 'paused' : 'active',
              pausedUntil: action === 'pause' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
              nextDelivery: action === 'resume' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null
            }
          : sub
      ));

      if (onSubscriptionUpdate) {
        const updatedSub = subscriptions.find(s => s.id === subscriptionId);
        onSubscriptionUpdate(updatedSub, action);
      }
    } catch (error) {
      console.error(`Failed to ${action} subscription:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'cancelled', nextDelivery: null }
          : sub
      ));

      if (onSubscriptionUpdate) {
        const cancelledSub = subscriptions.find(s => s.id === subscriptionId);
        onSubscriptionUpdate(cancelledSub, 'cancelled');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFrequency = (frequency) => {
    const frequencyMap = {
      daily: 'Every day',
      weekly: 'Every week',
      'bi-weekly': 'Every 2 weeks',
      monthly: 'Every month'
    };
    return frequencyMap[frequency] || frequency;
  };

  if (loading && subscriptions.length === 0) {
    return <SubscriptionSkeleton />;
  }

  return (
    <FadeIn className="subscription-manager">
      {showPlans && (
        <div className="subscription-plans-section">
          <div className="section-header">
            <h2 className="section-title">Subscription Plans</h2>
            <p className="section-description">
              Choose from our curated subscription boxes and save on regular deliveries
            </p>
          </div>

          <div className="plans-grid">
            {availablePlans.map((plan) => (
              <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.premium ? 'premium' : ''}`}>
                {plan.popular && (
                  <div className="plan-badge popular-badge">Most Popular</div>
                )}
                {plan.premium && (
                  <div className="plan-badge premium-badge">Premium</div>
                )}
                
                <div className="plan-image">
                  <img src={plan.image} alt={plan.name} />
                  <div className="discount-badge">
                    {plan.discount}% OFF
                  </div>
                </div>

                <div className="plan-content">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-description">{plan.description}</p>
                  
                  <div className="plan-pricing">
                    <span className="current-price">₹{plan.price}</span>
                    <span className="original-price">₹{plan.originalPrice}</span>
                    <span className="frequency">/{plan.frequency}</span>
                  </div>

                  <div className="plan-benefits">
                    {plan.benefits.map((benefit, index) => (
                      <div key={index} className="benefit-item">
                        <svg className="benefit-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <InteractiveButton
                    variant="primary"
                    size="large"
                    className="subscribe-button"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowPlanModal(true);
                    }}
                    disabled={loading}
                  >
                    Subscribe Now
                  </InteractiveButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showActiveSubscriptions && subscriptions.length > 0 && (
        <div className="active-subscriptions-section">
          <div className="section-header">
            <h2 className="section-title">Your Subscriptions</h2>
            <p className="section-description">
              Manage your active subscriptions and delivery preferences
            </p>
          </div>

          <div className="subscriptions-list">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="subscription-card">
                <div className="subscription-header">
                  <div className="subscription-info">
                    <h3 className="subscription-name">{subscription.planName}</h3>
                    <p className="subscription-frequency">{formatFrequency(subscription.frequency)}</p>
                  </div>
                  <div className={`status-badge ${getStatusColor(subscription.status)}`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </div>
                </div>

                <div className="subscription-details">
                  <div className="detail-item">
                    <span className="detail-label">Amount</span>
                    <span className="detail-value">₹{subscription.amount}</span>
                  </div>
                  
                  {subscription.nextDelivery && (
                    <div className="detail-item">
                      <span className="detail-label">Next Delivery</span>
                      <span className="detail-value">
                        {subscription.nextDelivery.toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {subscription.pausedUntil && (
                    <div className="detail-item">
                      <span className="detail-label">Paused Until</span>
                      <span className="detail-value">
                        {subscription.pausedUntil.toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="detail-label">Deliveries</span>
                    <span className="detail-value">
                      {subscription.completedDeliveries}/{subscription.totalDeliveries || '∞'}
                    </span>
                  </div>
                </div>

                {subscription.customizations && subscription.customizations.length > 0 && (
                  <div className="customizations">
                    <span className="customizations-label">Customizations:</span>
                    <div className="customizations-list">
                      {subscription.customizations.map((custom, index) => (
                        <span key={index} className="customization-tag">
                          {custom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="subscription-actions">
                  {subscription.status === 'active' && (
                    <InteractiveButton
                      variant="secondary"
                      size="small"
                      onClick={() => handlePauseResume(subscription.id, 'pause')}
                      disabled={loading}
                    >
                      Pause
                    </InteractiveButton>
                  )}
                  
                  {subscription.status === 'paused' && (
                    <InteractiveButton
                      variant="primary"
                      size="small"
                      onClick={() => handlePauseResume(subscription.id, 'resume')}
                      disabled={loading}
                    >
                      Resume
                    </InteractiveButton>
                  )}

                  <InteractiveButton
                    variant="outline"
                    size="small"
                    onClick={() => {/* TODO: Open customization modal */}}
                    disabled={loading || subscription.status === 'cancelled'}
                  >
                    Customize
                  </InteractiveButton>

                  {subscription.status !== 'cancelled' && (
                    <InteractiveButton
                      variant="danger"
                      size="small"
                      onClick={() => handleCancelSubscription(subscription.id)}
                      disabled={loading}
                    >
                      Cancel
                    </InteractiveButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription Plan Modal */}
      {showPlanModal && selectedPlan && (
        <div className="modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Subscribe to {selectedPlan.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowPlanModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="plan-summary">
                <img src={selectedPlan.image} alt={selectedPlan.name} className="plan-image-small" />
                <div className="plan-details">
                  <h4>{selectedPlan.name}</h4>
                  <p>{selectedPlan.description}</p>
                  <div className="pricing-info">
                    <span className="price">₹{selectedPlan.price}</span>
                    <span className="frequency">/{selectedPlan.frequency}</span>
                    <span className="savings">Save ₹{selectedPlan.originalPrice - selectedPlan.price}</span>
                  </div>
                </div>
              </div>

              <div className="subscription-options">
                <h5>Delivery Preferences</h5>
                <div className="delivery-time">
                  <label>Preferred delivery time:</label>
                  <select defaultValue="morning">
                    <option value="morning">Morning (6 AM - 10 AM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (6 PM - 8 PM)</option>
                  </select>
                </div>

                <div className="special-instructions">
                  <label>Special instructions (optional):</label>
                  <textarea 
                    placeholder="Any dietary preferences, allergies, or specific requests..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <InteractiveButton
                variant="secondary"
                onClick={() => setShowPlanModal(false)}
                disabled={loading}
              >
                Cancel
              </InteractiveButton>
              <InteractiveButton
                variant="primary"
                onClick={() => handleSubscribe(selectedPlan)}
                disabled={loading}
              >
                {loading ? 'Creating Subscription...' : 'Start Subscription'}
              </InteractiveButton>
            </div>
          </div>
        </div>
      )}
    </FadeIn>
  );
};

const SubscriptionSkeleton = () => (
  <div className="subscription-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
    </div>
    <div className="skeleton-grid">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-benefits">
              {Array.from({ length: 3 }, (_, j) => (
                <div key={j} className="skeleton-benefit"></div>
              ))}
            </div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SubscriptionManager;