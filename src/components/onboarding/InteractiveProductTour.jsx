import React, { useState, useEffect } from 'react';
import OnboardingTooltip from './OnboardingTooltip';
import { useOnboarding } from '../../contexts/onboarding/OnboardingContext';
import { useLocation } from 'react-router-dom';

// Tour configurations for different pages/contexts
const tours = {
    general: [
      {
        targetSelector: '.navbar',
        title: 'Navigation Bar',
        content: 'Use the navigation bar to explore different sections of AgriConnect. Find products, categories, and your account options here.',
        position: 'bottom'
      },
      {
        targetSelector: 'input[type="search"], [role="search"] input',
        title: 'Search Products',
        content: 'Quickly find specific products by typing in the search bar. Use keywords like "organic tomatoes" or "local farmer".',
        position: 'bottom'
      },
      {
        targetSelector: '.notification-bell, [aria-label*="notification"], [aria-label*="Notification"]',
        title: 'Notifications',
        content: 'Stay updated with order status, new products from your favorite farmers, and special offers.',
        position: 'bottom'
      },
      {
        targetSelector: '[href="/cart"], [aria-label*="cart"], [aria-label*="Cart"]',
        title: 'Shopping Cart',
        content: 'View and manage items you\'ve added to your cart. The number shows how many items you have.',
        position: 'bottom'
      },
      {
        targetSelector: '[href="/wishlist"], [aria-label*="wishlist"], [aria-label*="Wishlist"]',
        title: 'Wishlist',
        content: 'Save products you\'re interested in for later. Perfect for planning future purchases!',
        position: 'bottom'
      }
    ],
    shopping: [
      {
        targetSelector: '.product-card, [class*="product"]',
        title: 'Product Cards',
        content: 'Each card shows key product information: price, farmer, ratings, and organic certification. Click to view details.',
        position: 'top'
      },
      {
        targetSelector: '.add-to-cart, [class*="cart"], button[class*="add"]',
        title: 'Add to Cart',
        content: 'Click this button to add products to your cart. You can adjust quantities later in your cart.',
        position: 'top'
      },
      {
        targetSelector: '.wishlist-btn, [class*="wishlist"], [aria-label*="wishlist"]',
        title: 'Add to Wishlist',
        content: 'Save products you like for later by clicking the heart icon. Build your collection of favorites!',
        position: 'top'
      },
      {
        targetSelector: '.product-rating, [class*="rating"], [role="img"][aria-label*="star"]',
        title: 'Product Ratings',
        content: 'See what other customers think! Ratings help you choose the best quality products.',
        position: 'bottom'
      },
      {
        targetSelector: '.filter-section, [class*="filter"], [role="region"][aria-label*="filter"]',
        title: 'Filters & Sorting',
        content: 'Narrow down your search using filters like price range, location, organic certification, and more.',
        position: 'right'
      }
    ],
    farmer: [
      {
        targetSelector: '.dashboard-stats, [class*="stat"], [class*="metric"]',
        title: 'Dashboard Overview',
        content: 'Get a quick overview of your sales, orders, and earnings. Monitor your business performance at a glance.',
        position: 'bottom'
      },
      {
        targetSelector: '.add-product, [class*="add"], button[class*="product"]',
        title: 'Add Products',
        content: 'List new products from your farm. Include high-quality photos and detailed descriptions to attract customers.',
        position: 'bottom'
      },
      {
        targetSelector: '.order-management, [class*="order"], [class*="manage"]',
        title: 'Order Management',
        content: 'View and process incoming orders. Update order status to keep customers informed about their purchases.',
        position: 'right'
      },
      {
        targetSelector: '.inventory, [class*="inventory"], [class*="stock"]',
        title: 'Inventory Management',
        content: 'Keep track of your product stock levels. Set up alerts for low inventory to avoid missing sales.',
        position: 'left'
      },
      {
        targetSelector: '.analytics, [class*="analytic"], [class*="chart"]',
        title: 'Sales Analytics',
        content: 'Analyze your sales patterns, peak seasons, and customer preferences to optimize your farming strategy.',
        position: 'top'
      }
    ],
    admin: [
      {
        targetSelector: '.admin-dashboard, [class*="admin"]',
        title: 'Admin Dashboard',
        content: 'Manage the entire AgriConnect platform from here. Monitor farmers, orders, and system health.',
        position: 'bottom'
      },
      {
        targetSelector: '.user-management, [class*="user"], [class*="manage"]',
        title: 'User Management',
        content: 'Oversee farmer registrations, customer accounts, and handle user-related issues.',
        position: 'right'
      },
      {
        targetSelector: '.product-approval, [class*="approval"], [class*="moderate"]',
        title: 'Product Moderation',
        content: 'Review and approve new product listings to maintain marketplace quality and standards.',
        position: 'left'
      },
      {
        targetSelector: '.system-analytics, [class*="system"], [class*="report"]',
        title: 'System Analytics',
        content: 'Access comprehensive reports on platform usage, revenue, and growth metrics.',
        position: 'top'
      }
    ]
  };

const InteractiveProductTour = ({ 
  isActive = false, 
  tourType = 'general', 
  onComplete = () => {} 
}) => {
  const location = useLocation();
  const { 
    currentStep, 
    currentTour, 
    setCurrentTour, 
    nextStep, 
    previousStep, 
    goToStep, 
    completeOnboarding, 
    skipOnboarding 
  } = useOnboarding();
  
  const [isVisible, setIsVisible] = useState(false);

  // Initialize tour based on current page and type
  useEffect(() => {
    if (isActive) {
      let selectedTour = tours.general;
      
      // Select tour based on current route and type
      if (location.pathname.includes('/dashboard')) {
        if (tourType === 'farmer') {
          selectedTour = tours.farmer;
        } else if (tourType === 'admin') {
          selectedTour = tours.admin;
        }
      } else if (location.pathname.includes('/products') || location.pathname.includes('/categories')) {
        selectedTour = tours.shopping;
      }
      
      setCurrentTour(selectedTour);
      setIsVisible(true);
      goToStep(0);
    } else {
      setIsVisible(false);
    }
  }, [isActive, location.pathname, tourType, goToStep, setCurrentTour]);

  const handleNext = () => {
    const hasNext = nextStep();
    if (!hasNext) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    completeOnboarding();
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    skipOnboarding();
    onComplete();
  };

  // Don't render if no tour is selected or not active
  if (!currentTour || !isActive) {
    return null;
  }

  const currentStepData = currentTour[currentStep];
  
  // Handle case where step is out of bounds
  if (!currentStepData) {
    return null;
  }

  return (
    <OnboardingTooltip
      isVisible={isVisible}
      targetSelector={currentStepData.targetSelector}
      title={currentStepData.title}
      content={currentStepData.content}
      position={currentStepData.position}
      currentStep={currentStep}
      totalSteps={currentTour.length}
      onNext={handleNext}
      onPrevious={previousStep}
      onSkip={handleSkip}
      showNavigation={true}
      showSkip={true}
      highlightColor="rgba(34, 197, 94, 0.2)"
      backdropColor="rgba(0, 0, 0, 0.6)"
    />
  );
};

export default InteractiveProductTour;