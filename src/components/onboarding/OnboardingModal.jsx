import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * OnboardingModal - A modal container for onboarding steps
 * Features: Progress indicator, navigation controls, skip option, keyboard support
 */
const OnboardingModal = ({
  isOpen = false,
  onClose = () => {},
  children,
  currentStep = 0,
  totalSteps = 1,
  title = '',
  canSkip = true,
  canGoBack = true,
  onNext = () => {},
  onPrevious = () => {},
  onSkip = () => {},
  isLoading = false,
  nextButtonText = 'Next',
  prevButtonText = 'Previous',
  skipButtonText = 'Skip Tour',
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          if (canSkip) onSkip();
          break;
        case 'ArrowRight':
          if (currentStep < totalSteps - 1) onNext();
          break;
        case 'ArrowLeft':
          if (currentStep > 0 && canGoBack) onPrevious();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, totalSteps, canSkip, canGoBack, onNext, onPrevious, onSkip]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={canSkip ? onSkip : undefined}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-content"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {title && (
                <h2 id="onboarding-title" className="text-xl font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              
              {/* Progress indicator */}
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={currentStep + 1}
                    aria-valuemin={1}
                    aria-valuemax={totalSteps}
                    aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
                  />
                </div>
              </div>
            </div>
            
            {canSkip && (
              <button
                onClick={onSkip}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close onboarding"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div id="onboarding-content" className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {canSkip && (
                <button
                  onClick={onSkip}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                  disabled={isLoading}
                >
                  {skipButtonText}
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {currentStep > 0 && canGoBack && (
                <button
                  onClick={onPrevious}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isLoading}
                >
                  {prevButtonText}
                </button>
              )}
              
              <button
                onClick={currentStep < totalSteps - 1 ? onNext : onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>
                  {currentStep < totalSteps - 1 ? nextButtonText : 'Get Started'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default OnboardingModal;