import React, { useState, useEffect } from 'react';
import OnboardingModal from '../../components/onboarding/OnboardingModal';
import OnboardingStep from '../../components/onboarding/OnboardingStep';
import { useOnboarding } from '../../contexts/onboarding/OnboardingContext';
import { useNotifications } from '../../contexts/NotificationContext';

/**
 * CustomerOnboarding - Onboarding flow for new customers
 * Features: Welcome, browse products, add to cart, checkout, account setup
 */
const CustomerOnboarding = ({ 
  isOpen = false, 
  onComplete = () => {},
  autoStart = false
}) => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    completeOnboarding,
    skipOnboarding,
    startOnboarding,
    ONBOARDING_TYPES
  } = useOnboarding();

  const { showSuccess } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize onboarding
  useEffect(() => {
    if (isOpen || autoStart) {
      startOnboarding(ONBOARDING_TYPES.CUSTOMER, 5);
    }
  }, [isOpen, autoStart, startOnboarding, ONBOARDING_TYPES.CUSTOMER]);

  const handleNext = async () => {
    setIsLoading(true);
    
    // Simulate API calls or setup tasks
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const hasNext = nextStep();
    if (!hasNext) {
      handleComplete();
    }
    
    setIsLoading(false);
  };

  const handleComplete = () => {
    completeOnboarding();
    showSuccess('Welcome to AgriConnect! You\'re all set to start shopping.');
    onComplete();
  };

  const handleSkip = () => {
    skipOnboarding();
    onComplete();
  };

  const steps = [
    {
      icon: '🌾',
      title: 'Welcome to AgriConnect!',
      description: 'Your gateway to fresh, local produce directly from farmers. Let\'s get you started on your journey to better, healthier food.',
      variant: 'centered',
      tips: [
        'Connect directly with local farmers',
        'Get the freshest produce delivered to your door',
        'Support sustainable agriculture in your community'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Discover Fresh Produce',
      description: 'Browse our marketplace to find seasonal vegetables, fruits, and organic products from verified local farmers.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=300&fit=crop&auto=format',
      actions: (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-1">🥕 Seasonal Picks</h4>
            <p className="text-sm text-green-700">Find the best seasonal produce available now</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-1">🔍 Smart Filters</h4>
            <p className="text-sm text-blue-700">Filter by location, price, organic certification, and more</p>
          </div>
        </div>
      ),
      tips: [
        'Use the search bar to find specific products',
        'Check product ratings and farmer profiles',
        'Look for the organic certification badge'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.4 4h10" />
        </svg>
      ),
      title: 'Add Items to Your Cart',
      description: 'Found something you like? Simply click the "Add to Cart" button. You can adjust quantities and review your selection anytime.',
      actions: (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🥬</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Fresh Lettuce</h4>
              <p className="text-sm text-gray-600">₹45 per bunch</p>
              <p className="text-xs text-green-600">★★★★★ (4.8) • Organic</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      ),
      tips: [
        'Check minimum order quantities',
        'Review delivery areas before adding to cart',
        'Save items to your wishlist for later'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Secure Checkout Process',
      description: 'Review your order, choose delivery options, and complete your purchase securely. We support multiple payment methods for your convenience.',
      actions: (
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Payment Options</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="text-xl">💳</span>
                <span className="text-sm">Credit/Debit</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="text-xl">📱</span>
                <span className="text-sm">UPI/Wallet</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="text-xl">🏦</span>
                <span className="text-sm">Net Banking</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="text-xl">💰</span>
                <span className="text-sm">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      ),
      tips: [
        'Save your delivery address for faster checkout',
        'Track your order status in real-time',
        'Rate your experience to help improve our service'
      ]
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Your Account Dashboard',
      description: 'Manage your profile, track orders, save favorite farmers, and access exclusive deals. Your personalized agricultural marketplace awaits!',
      variant: 'centered',
      actions: (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-sm font-medium text-blue-900">Order History</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">❤️</div>
            <div className="text-sm font-medium text-green-900">Wishlist</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">👨‍🌾</div>
            <div className="text-sm font-medium text-purple-900">Favorite Farmers</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-2">🎁</div>
            <div className="text-sm font-medium text-orange-900">Rewards</div>
          </div>
        </div>
      ),
      tips: [
        'Complete your profile to get personalized recommendations',
        'Enable notifications for order updates and deals',
        'Join our loyalty program for exclusive benefits'
      ]
    }
  ];

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <OnboardingModal
      isOpen={isOpen}
      onClose={handleComplete}
      currentStep={currentStep}
      totalSteps={totalSteps}
      title={`Getting Started - ${currentStepData.title}`}
      canSkip={true}
      canGoBack={currentStep > 0}
      onNext={handleNext}
      onPrevious={previousStep}
      onSkip={handleSkip}
      isLoading={isLoading}
      nextButtonText={currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
      skipButtonText="Skip Tutorial"
    >
      <OnboardingStep
        {...currentStepData}
        isActive={true}
      />
    </OnboardingModal>
  );
};

export default CustomerOnboarding;