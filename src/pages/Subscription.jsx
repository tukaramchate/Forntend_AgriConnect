import React, { useState } from 'react';
import SubscriptionManager from '../components/subscription/SubscriptionManager';
import LoyaltyProgram from '../components/loyalty/LoyaltyProgram';
import './Subscription.css';

const Subscription = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');

  // Mock user data
  const userId = 'user-123';

  const handleSubscriptionUpdate = (subscription, action) => {
    console.log(`Subscription ${action}:`, subscription);
    // Here you could update global state, show notifications, etc.
  };

  const handleRewardRedeem = (reward) => {
    console.log('Reward redeemed:', reward);
    // Here you could update global state, show notifications, etc.
  };

  return (
    <div className='subscription-page'>
      {/* Page Header */}
      <div className='page-header'>
        <div className='container'>
          <div className='header-content'>
            <h1 className='page-title'>Subscriptions & Rewards</h1>
            <p className='page-description'>
              Manage your subscriptions, earn loyalty points, and redeem
              exclusive rewards
            </p>
          </div>

          {/* Tab Navigation */}
          <div className='tab-navigation'>
            <button
              className={`tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscriptions')}
            >
              <svg
                className='tab-icon'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
              Subscription Boxes
            </button>
            <button
              className={`tab-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
              onClick={() => setActiveTab('loyalty')}
            >
              <svg
                className='tab-icon'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                />
              </svg>
              Loyalty & Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className='tab-content'>
        <div className='container'>
          {activeTab === 'subscriptions' && (
            <div className='subscriptions-content'>
              <SubscriptionManager
                userId={userId}
                onSubscriptionUpdate={handleSubscriptionUpdate}
                showPlans={true}
                showActiveSubscriptions={true}
              />
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className='loyalty-content'>
              <LoyaltyProgram
                userId={userId}
                onRewardRedeem={handleRewardRedeem}
              />
            </div>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className='benefits-section'>
        <div className='container'>
          <h2 className='benefits-title'>
            Why Choose Our Subscription Service?
          </h2>
          <div className='benefits-grid'>
            <div className='benefit-card'>
              <div className='benefit-icon'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                  />
                </svg>
              </div>
              <h3 className='benefit-title'>Save Money</h3>
              <p className='benefit-description'>
                Get up to 25% off regular prices with our subscription plans and
                loyalty rewards.
              </p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                  />
                </svg>
              </div>
              <h3 className='benefit-title'>Flexible Plans</h3>
              <p className='benefit-description'>
                Choose from daily, weekly, or monthly deliveries. Pause, modify,
                or cancel anytime.
              </p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='benefit-title'>Quality Guaranteed</h3>
              <p className='benefit-description'>
                Fresh, organic produce sourced directly from verified farmers
                with quality assurance.
              </p>
            </div>

            <div className='benefit-card'>
              <div className='benefit-icon'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
              </div>
              <h3 className='benefit-title'>Convenient Delivery</h3>
              <p className='benefit-description'>
                Scheduled deliveries at your convenience with real-time tracking
                and notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
