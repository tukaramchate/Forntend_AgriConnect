import React, { useState } from 'react';
import CustomerOnboarding from './onboarding/CustomerOnboarding';
import FarmerOnboarding from './onboarding/FarmerOnboarding';
import InteractiveProductTour from '../components/onboarding/InteractiveProductTour';
import { OnboardingProvider } from '../contexts/onboarding/OnboardingContext';

/**
 * OnboardingDemo - Demo page to showcase different onboarding flows
 * Features: Customer onboarding, farmer onboarding, interactive tours
 */
const OnboardingDemo = () => {
  const [activeOnboarding, setActiveOnboarding] = useState(null);
  const [activeTour, setActiveTour] = useState(null);

  const handleOnboardingComplete = () => {
    setActiveOnboarding(null);
  };

  const handleTourComplete = () => {
    setActiveTour(null);
  };

  const demoCards = [
    {
      id: 'customer',
      title: 'Customer Onboarding',
      description: 'Welcome new customers with a guided tour of shopping features',
      icon: '🛒',
      color: 'blue',
      features: [
        'Product discovery walkthrough',
        'Cart and checkout process',
        'Account setup guidance',
        'Wishlist and favorites'
      ]
    },
    {
      id: 'farmer',
      title: 'Farmer Onboarding',
      description: 'Help farmers set up their profile and start selling',
      icon: '👨‍🌾',
      color: 'green',
      features: [
        'Farm profile setup',
        'Product listing guide',
        'Delivery configuration',
        'Dashboard overview'
      ]
    },
    {
      id: 'tour-general',
      title: 'General Product Tour',
      description: 'Interactive tour highlighting key interface elements',
      icon: '🎯',
      color: 'purple',
      features: [
        'Navigation assistance',
        'Feature discovery',
        'Contextual tooltips',
        'Progressive disclosure'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100',
      green: 'border-green-200 bg-green-50 text-green-900 hover:bg-green-100',
      purple: 'border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100',
      orange: 'border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100'
    };
    return colors[color] || colors.blue;
  };

  const getButtonClasses = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      orange: 'bg-orange-600 hover:bg-orange-700 text-white'
    };
    return colors[color] || colors.blue;
  };

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              User Onboarding System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our comprehensive onboarding flows designed to welcome and guide 
              different types of users through their AgriConnect journey.
            </p>
          </div>

          {/* Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {demoCards.map((card) => (
              <div
                key={card.id}
                className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${getColorClasses(card.color)}`}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{card.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-sm uppercase tracking-wider opacity-70">
                    Features
                  </h4>
                  <ul className="space-y-2">
                    {card.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 bg-current rounded-full mr-3 opacity-60" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (card.id === 'customer') {
                      setActiveOnboarding('customer');
                    } else if (card.id === 'farmer') {
                      setActiveOnboarding('farmer');
                    } else if (card.id === 'tour-general') {
                      setActiveTour('general');
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${getButtonClasses(card.color)}`}
                >
                  Start Demo
                </button>
              </div>
            ))}
          </div>

          {/* Integration Guide */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Integration Guide
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Implementation Examples
                </h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Basic Usage</h4>
                    <pre className="text-sm text-gray-700 overflow-x-auto">
{`import { OnboardingProvider, CustomerOnboarding } from './components/onboarding';

function App() {
  return (
    <OnboardingProvider>
      <CustomerOnboarding 
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </OnboardingProvider>
  );
}`}
                    </pre>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Interactive Tour</h4>
                    <pre className="text-sm text-gray-700 overflow-x-auto">
{`import { InteractiveProductTour } from './components/onboarding';

function HomePage() {
  return (
    <InteractiveProductTour
      isActive={showTour}
      tourType="shopping"
      onComplete={() => setShowTour(false)}
    />
  );
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Key Features
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Role-based Flows</h4>
                      <p className="text-gray-600 text-sm">Different onboarding experiences for customers, farmers, and admins</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Interactive Tooltips</h4>
                      <p className="text-gray-600 text-sm">Context-aware guidance with element highlighting</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Progress Tracking</h4>
                      <p className="text-gray-600 text-sm">Skip, resume, and track completion status</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Accessibility Ready</h4>
                      <p className="text-gray-600 text-sm">Keyboard navigation, screen reader support, ARIA labels</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Customizable</h4>
                      <p className="text-gray-600 text-sm">Easy to customize steps, styling, and behavior</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modals */}
      <CustomerOnboarding
        isOpen={activeOnboarding === 'customer'}
        onComplete={handleOnboardingComplete}
      />

      <FarmerOnboarding
        isOpen={activeOnboarding === 'farmer'}
        onComplete={handleOnboardingComplete}
      />

      <InteractiveProductTour
        isActive={activeTour === 'general'}
        tourType="general"
        onComplete={handleTourComplete}
      />
    </OnboardingProvider>
  );
};

export default OnboardingDemo;