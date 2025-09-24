import React, { useState, useEffect } from 'react';
import FadeIn from '../animations/FadeIn';
import InteractiveButton from '../interactions/InteractiveButton';
import './LoyaltyProgram.css';

/**
 * Comprehensive loyalty program with points, rewards, achievements,
 * and tier-based benefits system
 */
const LoyaltyProgram = ({ 
  userId,
  onRewardRedeem
}) => {
  const [userLoyalty, setUserLoyalty] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock loyalty data
  useEffect(() => {
    const loadLoyaltyData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock user loyalty status
        const mockUserLoyalty = {
          currentPoints: 2840,
          totalPointsEarned: 15670,
          pointsToNextTier: 160,
          currentTier: 'Gold',
          nextTier: 'Platinum',
          memberSince: new Date(2023, 0, 15),
          totalSavings: 4250,
          ordersCount: 47,
          pointsExpiring: 450,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };

        // Mock available rewards
        const mockRewards = [
          {
            id: 'free-delivery-1',
            title: 'Free Delivery',
            description: 'Free delivery on your next order',
            pointsCost: 100,
            category: 'delivery',
            available: true,
            expiryDays: 30,
            image: '/images/rewards/free-delivery.jpg'
          },
          {
            id: 'discount-10',
            title: '10% Off Next Order',
            description: 'Get 10% discount on orders above ₹500',
            pointsCost: 250,
            category: 'discount',
            available: true,
            expiryDays: 15,
            minOrderValue: 500,
            image: '/images/rewards/discount-10.jpg'
          },
          {
            id: 'organic-box',
            title: 'Free Organic Starter Box',
            description: 'Complimentary organic vegetables box worth ₹399',
            pointsCost: 800,
            category: 'product',
            available: true,
            expiryDays: 7,
            originalValue: 399,
            image: '/images/rewards/organic-box.jpg'
          },
          {
            id: 'premium-membership',
            title: '1 Month Premium Membership',
            description: 'Access to exclusive deals and early product launches',
            pointsCost: 1500,
            category: 'membership',
            available: true,
            expiryDays: 45,
            benefits: ['Priority support', 'Exclusive deals', 'Early access'],
            image: '/images/rewards/premium-membership.jpg'
          },
          {
            id: 'farmer-visit',
            title: 'Farm Visit Experience',
            description: 'Guided tour of organic farms with family (for 4 people)',
            pointsCost: 3000,
            category: 'experience',
            available: false,
            availableFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            image: '/images/rewards/farm-visit.jpg'
          }
        ];

        // Mock achievements
        const mockAchievements = [
          {
            id: 'first-order',
            title: 'First Steps',
            description: 'Complete your first order',
            points: 50,
            unlocked: true,
            unlockedDate: new Date(2023, 0, 20),
            icon: '🏁'
          },
          {
            id: 'loyal-customer',
            title: 'Loyal Customer',
            description: 'Complete 10 orders',
            points: 200,
            unlocked: true,
            unlockedDate: new Date(2023, 2, 15),
            icon: '❤️'
          },
          {
            id: 'organic-lover',
            title: 'Organic Lover',
            description: 'Purchase organic products worth ₹5000',
            points: 300,
            unlocked: true,
            unlockedDate: new Date(2023, 4, 10),
            icon: '🌱'
          },
          {
            id: 'social-butterfly',
            title: 'Social Butterfly',
            description: 'Refer 5 friends to AgriConnect',
            points: 500,
            unlocked: false,
            progress: 3,
            target: 5,
            icon: '🦋'
          },
          {
            id: 'eco-warrior',
            title: 'Eco Warrior',
            description: 'Save 50kg of packaging by choosing eco-friendly options',
            points: 400,
            unlocked: false,
            progress: 32,
            target: 50,
            icon: '🌍'
          }
        ];

        setUserLoyalty(mockUserLoyalty);
        setAvailableRewards(mockRewards);
        setAchievements(mockAchievements);
      } catch (error) {
        console.error('Failed to load loyalty data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLoyaltyData();
  }, [userId]);

  const handleRedeemReward = async (reward) => {
    if (!reward.available || userLoyalty.currentPoints < reward.pointsCost) {
      return;
    }

    try {
      // Simulate reward redemption
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user points
      setUserLoyalty(prev => ({
        ...prev,
        currentPoints: prev.currentPoints - reward.pointsCost
      }));

      // Notify parent component
      if (onRewardRedeem) {
        onRewardRedeem(reward);
      }

      alert(`Reward "${reward.title}" has been added to your account!`);
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      alert('Failed to redeem reward. Please try again.');
    }
  };

  const getTierInfo = (tier) => {
    const tiers = {
      Bronze: { color: '#cd7f32', nextPoints: 1000, benefits: ['Basic support', '2% cashback'] },
      Silver: { color: '#c0c0c0', nextPoints: 2000, benefits: ['Priority support', '3% cashback', 'Free delivery on orders > ₹1000'] },
      Gold: { color: '#ffd700', nextPoints: 3000, benefits: ['Premium support', '5% cashback', 'Free delivery', 'Early access'] },
      Platinum: { color: '#e5e4e2', nextPoints: null, benefits: ['VIP support', '8% cashback', 'Free delivery', 'Exclusive products', 'Personal shopper'] }
    };
    return tiers[tier] || tiers.Bronze;
  };

  const getTierProgress = () => {
    if (!userLoyalty) return 0;
    const tierInfo = getTierInfo(userLoyalty.currentTier);
    if (!tierInfo.nextPoints) return 100; // Platinum tier
    
    const currentTierPoints = getTierInfo(userLoyalty.currentTier === 'Bronze' ? 'Bronze' : 
                               userLoyalty.currentTier === 'Silver' ? 'Bronze' : 
                               userLoyalty.currentTier === 'Gold' ? 'Silver' : 'Gold').nextPoints || 0;
    
    const progress = ((userLoyalty.totalPointsEarned - currentTierPoints) / (tierInfo.nextPoints - currentTierPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (loading) {
    return <LoyaltyProgramSkeleton />;
  }

  return (
    <FadeIn className="loyalty-program">
      {/* Header with Points Overview */}
      <div className="loyalty-header">
        <div className="points-overview">
          <div className="points-card">
            <div className="points-main">
              <h2 className="points-value">{userLoyalty.currentPoints.toLocaleString()}</h2>
              <p className="points-label">Available Points</p>
            </div>
            <div className="points-expiry">
              {userLoyalty.pointsExpiring > 0 && (
                <div className="expiry-warning">
                  <svg className="warning-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {userLoyalty.pointsExpiring} points expiring on {userLoyalty.expiryDate.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="tier-card">
            <div className="tier-badge" style={{ backgroundColor: getTierInfo(userLoyalty.currentTier).color }}>
              {userLoyalty.currentTier}
            </div>
            {userLoyalty.nextTier && (
              <div className="tier-progress">
                <div className="progress-info">
                  <span>Progress to {userLoyalty.nextTier}</span>
                  <span>{userLoyalty.pointsToNextTier} points to go</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getTierProgress()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="loyalty-stats">
          <div className="stat-item">
            <span className="stat-value">₹{userLoyalty.totalSavings.toLocaleString()}</span>
            <span className="stat-label">Total Savings</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userLoyalty.ordersCount}</span>
            <span className="stat-label">Orders Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userLoyalty.totalPointsEarned.toLocaleString()}</span>
            <span className="stat-label">Lifetime Points</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="loyalty-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          Rewards ({availableRewards.filter(r => r.available).length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="tier-benefits">
              <h3>Your {userLoyalty.currentTier} Benefits</h3>
              <div className="benefits-list">
                {getTierInfo(userLoyalty.currentTier).benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <svg className="benefit-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <InteractiveButton
                  variant="primary"
                  onClick={() => setActiveTab('rewards')}
                  className="action-button"
                >
                  Browse Rewards
                </InteractiveButton>
                <InteractiveButton
                  variant="secondary"
                  onClick={() => {/* TODO: Open referral modal */}}
                  className="action-button"
                >
                  Refer Friends
                </InteractiveButton>
                <InteractiveButton
                  variant="outline"
                  onClick={() => setActiveTab('achievements')}
                  className="action-button"
                >
                  View Achievements
                </InteractiveButton>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="rewards-tab">
            <div className="rewards-grid">
              {availableRewards.map((reward) => (
                <div key={reward.id} className={`reward-card ${!reward.available ? 'unavailable' : ''}`}>
                  <div className="reward-image">
                    <img src={reward.image} alt={reward.title} />
                    {!reward.available && reward.availableFrom && (
                      <div className="availability-overlay">
                        Available from {reward.availableFrom.toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="reward-content">
                    <h4 className="reward-title">{reward.title}</h4>
                    <p className="reward-description">{reward.description}</p>

                    {reward.benefits && (
                      <div className="reward-benefits">
                        {reward.benefits.map((benefit, index) => (
                          <span key={index} className="benefit-tag">{benefit}</span>
                        ))}
                      </div>
                    )}

                    <div className="reward-footer">
                      <div className="reward-cost">
                        <span className="points-cost">{reward.pointsCost}</span>
                        <span className="points-label">points</span>
                      </div>

                      <InteractiveButton
                        variant="primary"
                        size="small"
                        onClick={() => handleRedeemReward(reward)}
                        disabled={!reward.available || userLoyalty.currentPoints < reward.pointsCost}
                        className="redeem-button"
                      >
                        {userLoyalty.currentPoints < reward.pointsCost 
                          ? `Need ${reward.pointsCost - userLoyalty.currentPoints} more` 
                          : 'Redeem'
                        }
                      </InteractiveButton>
                    </div>

                    {reward.expiryDays && (
                      <p className="reward-expiry">Expires in {reward.expiryDays} days after redemption</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>
                  
                  <div className="achievement-content">
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <p className="achievement-description">{achievement.description}</p>
                    
                    {achievement.unlocked ? (
                      <div className="achievement-unlocked">
                        <span className="unlock-date">
                          Unlocked on {achievement.unlockedDate.toLocaleDateString()}
                        </span>
                        <span className="points-earned">+{achievement.points} points</span>
                      </div>
                    ) : (
                      <div className="achievement-progress">
                        {achievement.progress !== undefined ? (
                          <>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </>
                        ) : (
                          <span className="reward-points">Reward: {achievement.points} points</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <p className="coming-soon">Points history and transaction details coming soon!</p>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

const LoyaltyProgramSkeleton = () => (
  <div className="loyalty-skeleton">
    <div className="skeleton-header">
      <div className="skeleton-points"></div>
      <div className="skeleton-tier"></div>
      <div className="skeleton-stats">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton-stat"></div>
        ))}
      </div>
    </div>
    <div className="skeleton-tabs"></div>
    <div className="skeleton-content">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton-card"></div>
      ))}
    </div>
  </div>
);

export default LoyaltyProgram;