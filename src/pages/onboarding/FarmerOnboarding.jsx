import React, { useState, useEffect } from 'react';
import OnboardingModal from '../../components/onboarding/OnboardingModal';
import OnboardingStep from '../../components/onboarding/OnboardingStep';
import { useOnboarding } from '../../contexts/onboarding/OnboardingContext';
import { useNotifications } from '../../contexts/NotificationContext';

/**
 * FarmerOnboarding - Onboarding flow for new farmers
 * Features: Profile setup, product listing, pricing, delivery, dashboard overview
 */
const FarmerOnboarding = ({
  isOpen = false,
  onComplete = () => {},
  autoStart = false,
}) => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    completeOnboarding,
    skipOnboarding,
    startOnboarding,
    ONBOARDING_TYPES,
  } = useOnboarding();

  const { showSuccess } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    farmSize: '',
    certifications: [],
  });

  // Initialize onboarding
  useEffect(() => {
    if (isOpen || autoStart) {
      startOnboarding(ONBOARDING_TYPES.FARMER, 6);
    }
  }, [isOpen, autoStart, startOnboarding, ONBOARDING_TYPES.FARMER]);

  const handleNext = async () => {
    setIsLoading(true);

    // Simulate API calls or setup tasks
    await new Promise((resolve) => setTimeout(resolve, 800));

    const hasNext = nextStep();
    if (!hasNext) {
      handleComplete();
    }

    setIsLoading(false);
  };

  const handleComplete = () => {
    completeOnboarding();
    showSuccess(
      'Welcome to AgriConnect! Your farmer profile is ready to start selling.'
    );
    onComplete();
  };

  const handleSkip = () => {
    skipOnboarding();
    onComplete();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      icon: '👨‍🌾',
      title: 'Welcome, Farmer!',
      description:
        "Join thousands of farmers who are already selling their fresh produce directly to customers. Let's set up your profile and get you started on your digital agriculture journey.",
      variant: 'centered',
      image:
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=300&fit=crop&auto=format',
      tips: [
        'Reach customers directly without middlemen',
        'Set your own prices and build your brand',
        'Access real-time market data and insights',
        'Join a community of progressive farmers',
      ],
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-green-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-2a2 2 0 012-2h2a2 2 0 012 2v2z'
          />
        </svg>
      ),
      title: 'Set Up Your Farm Profile',
      description:
        'Tell customers about your farm! A complete profile builds trust and helps customers discover your products.',
      children: (
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Farm Name
            </label>
            <input
              type='text'
              placeholder='e.g., Green Valley Organic Farm'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
              value={formData.farmName}
              onChange={(e) => handleInputChange('farmName', e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Location
            </label>
            <input
              type='text'
              placeholder='e.g., Pune, Maharashtra'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Farm Size
            </label>
            <select
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
              value={formData.farmSize}
              onChange={(e) => handleInputChange('farmSize', e.target.value)}
            >
              <option value=''>Select farm size</option>
              <option value='small'>Small (Less than 2 acres)</option>
              <option value='medium'>Medium (2-10 acres)</option>
              <option value='large'>Large (More than 10 acres)</option>
            </select>
          </div>
        </div>
      ),
      tips: [
        'Add high-quality photos of your farm',
        'Write a compelling farm story',
        'Mention any unique farming practices',
        'Include your farming experience',
      ],
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-green-600'
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
      ),
      title: 'Certifications & Credentials',
      description:
        'Showcase your organic certifications, quality standards, and farming credentials to build customer trust and command premium prices.',
      actions: (
        <div className='space-y-3'>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { id: 'organic', label: 'Organic Certified', icon: '🌱' },
              { id: 'gmp', label: 'Good Manufacturing Practice', icon: '✅' },
              { id: 'iso', label: 'ISO Certified', icon: '🏆' },
              { id: 'fairtrade', label: 'Fair Trade', icon: '🤝' },
            ].map((cert) => (
              <label
                key={cert.id}
                className='flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors'
              >
                <input
                  type='checkbox'
                  className='rounded text-green-600 focus:ring-green-500'
                  checked={formData.certifications.includes(cert.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        certifications: [...prev.certifications, cert.id],
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        certifications: prev.certifications.filter(
                          (c) => c !== cert.id
                        ),
                      }));
                    }
                  }}
                />
                <span className='text-lg'>{cert.icon}</span>
                <span className='text-sm font-medium'>{cert.label}</span>
              </label>
            ))}
          </div>

          <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg'>
            <div className='flex items-start space-x-2'>
              <span className='text-amber-600 text-lg'>💡</span>
              <p className='text-sm text-amber-800'>
                <strong>Pro Tip:</strong> Certified products typically sell for
                20-30% higher prices. Upload your certificate documents in your
                profile settings.
              </p>
            </div>
          </div>
        </div>
      ),
      tips: [
        'Upload clear photos of your certificates',
        'Keep certification details up to date',
        'Highlight certifications in product descriptions',
      ],
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-green-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
          />
        </svg>
      ),
      title: 'List Your First Products',
      description:
        'Add your produce to the marketplace! Start with your best seasonal items. Good photos and descriptions help customers choose your products.',
      actions: (
        <div className='bg-gray-50 rounded-lg p-4'>
          <h4 className='font-medium text-gray-900 mb-3'>
            Quick Product Setup
          </h4>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3 p-3 bg-white rounded-lg border'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <span className='text-xl'>🥕</span>
              </div>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Product name (e.g., Fresh Carrots)'
                  className='w-full px-2 py-1 text-sm border-none focus:ring-0'
                />
              </div>
              <div className='text-sm text-gray-500'>₹/kg</div>
            </div>

            <div className='flex items-center space-x-3 p-3 bg-white rounded-lg border'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <span className='text-xl'>🥬</span>
              </div>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Product name (e.g., Organic Lettuce)'
                  className='w-full px-2 py-1 text-sm border-none focus:ring-0'
                />
              </div>
              <div className='text-sm text-gray-500'>₹/bunch</div>
            </div>

            <button className='w-full py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors'>
              + Add Another Product
            </button>
          </div>
        </div>
      ),
      tips: [
        'Use natural lighting for product photos',
        'Include harvest date and freshness info',
        'Set competitive but profitable prices',
        'Update inventory regularly',
      ],
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-green-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m6 4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4m0 0v8a2 2 0 002 2h12a2 2 0 002-2v-8M8 11h8'
          />
        </svg>
      ),
      title: 'Set Up Delivery Options',
      description:
        'Configure how customers can receive their orders. Offer multiple options to reach more customers and increase sales.',
      actions: (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <div className='p-4 border border-gray-200 rounded-lg'>
              <div className='flex items-center space-x-3 mb-3'>
                <span className='text-2xl'>🚚</span>
                <div>
                  <h4 className='font-medium text-gray-900'>Home Delivery</h4>
                  <p className='text-sm text-gray-600'>
                    Direct to customer's door
                  </p>
                </div>
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Delivery Range:</span>
                  <select className='text-xs border rounded px-1'>
                    <option>5 km</option>
                    <option>10 km</option>
                    <option>20 km</option>
                  </select>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Delivery Fee:</span>
                  <input
                    type='text'
                    placeholder='₹50'
                    className='w-16 text-xs border rounded px-1'
                  />
                </div>
              </div>
            </div>

            <div className='p-4 border border-gray-200 rounded-lg'>
              <div className='flex items-center space-x-3 mb-3'>
                <span className='text-2xl'>📍</span>
                <div>
                  <h4 className='font-medium text-gray-900'>Pickup Points</h4>
                  <p className='text-sm text-gray-600'>
                    Customer collects from location
                  </p>
                </div>
              </div>
              <div className='space-y-2'>
                <input
                  type='text'
                  placeholder='Add pickup location'
                  className='w-full text-xs border rounded px-2 py-1'
                />
                <div className='text-xs text-gray-500'>
                  e.g., Near Bus Stand, Main Market
                </div>
              </div>
            </div>
          </div>

          <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='flex items-start space-x-2'>
              <span className='text-blue-600 text-lg'>ℹ️</span>
              <p className='text-sm text-blue-800'>
                <strong>Tip:</strong> Offering both delivery and pickup options
                increases your sales by up to 40%. Consider partnering with
                local stores for additional pickup points.
              </p>
            </div>
          </div>
        </div>
      ),
      tips: [
        'Partner with local shops for pickup points',
        'Offer free delivery above minimum order value',
        'Use insulated packaging for quality preservation',
        'Communicate delivery schedules clearly',
      ],
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-green-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      ),
      title: 'Your Farmer Dashboard',
      description:
        'Welcome to your command center! Monitor sales, manage inventory, track earnings, and grow your agricultural business with powerful insights.',
      variant: 'centered',
      actions: (
        <div className='grid grid-cols-2 gap-4 mt-6'>
          <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
            <div className='text-3xl mb-2'>📊</div>
            <div className='font-medium text-green-900'>Sales Analytics</div>
            <div className='text-sm text-green-700 mt-1'>
              Track performance & trends
            </div>
          </div>

          <div className='text-center p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <div className='text-3xl mb-2'>📦</div>
            <div className='font-medium text-blue-900'>Order Management</div>
            <div className='text-sm text-blue-700 mt-1'>
              Process & fulfill orders
            </div>
          </div>

          <div className='text-center p-4 bg-purple-50 rounded-lg border border-purple-200'>
            <div className='text-3xl mb-2'>💰</div>
            <div className='font-medium text-purple-900'>Earnings Overview</div>
            <div className='text-sm text-purple-700 mt-1'>
              Monitor income & payouts
            </div>
          </div>

          <div className='text-center p-4 bg-orange-50 rounded-lg border border-orange-200'>
            <div className='text-3xl mb-2'>👥</div>
            <div className='font-medium text-orange-900'>Customer Insights</div>
            <div className='text-sm text-orange-700 mt-1'>
              Build customer relationships
            </div>
          </div>
        </div>
      ),
      tips: [
        'Check your dashboard daily for new orders',
        'Use analytics to plan your next harvest',
        'Respond to customer reviews promptly',
        'Set up inventory alerts to avoid stockouts',
      ],
    },
  ];

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <OnboardingModal
      isOpen={isOpen}
      onClose={handleComplete}
      currentStep={currentStep}
      totalSteps={totalSteps}
      title={`Farmer Setup - ${currentStepData.title}`}
      canSkip={true}
      canGoBack={currentStep > 0}
      onNext={handleNext}
      onPrevious={previousStep}
      onSkip={handleSkip}
      isLoading={isLoading}
      nextButtonText={
        currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'
      }
      skipButtonText='Skip Setup'
    >
      <OnboardingStep {...currentStepData} isActive={true} />
    </OnboardingModal>
  );
};

export default FarmerOnboarding;
