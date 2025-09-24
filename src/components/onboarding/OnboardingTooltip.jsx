import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * OnboardingTooltip - Interactive tooltip for highlighting specific elements
 * Features: Element highlighting, positioning, animations, step navigation
 */
const OnboardingTooltip = ({
  isVisible = false,
  targetSelector = '',
  targetElement = null,
  title = '',
  content = '',
  position = 'auto', // 'top', 'bottom', 'left', 'right', 'auto'
  onNext = () => {},
  onPrevious = () => {},
  onSkip = () => {},
  currentStep = 0,
  totalSteps = 1,
  showNavigation = true,
  showSkip = true,
  className = '',
  highlightColor = 'rgba(59, 130, 246, 0.3)',
  backdropColor = 'rgba(0, 0, 0, 0.7)',
}) => {
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Find and track target element
  useEffect(() => {
    if (!isVisible) return;

    const findTarget = () => {
      let target = targetElement;

      if (!target && targetSelector) {
        target = document.querySelector(targetSelector);
      }

      if (target) {
        const rect = target.getBoundingClientRect();
        setTargetRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          element: target,
        });
      }
    };

    findTarget();

    // Re-find target on resize or scroll
    const handleResize = () => findTarget();
    const handleScroll = () => findTarget();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, targetSelector, targetElement]);

  // Calculate tooltip position
  useEffect(() => {
    if (!targetRect || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let bestPosition = position;
    let x = 0;
    let y = 0;

    // Auto-calculate best position if needed
    if (position === 'auto') {
      const spaceTop = targetRect.top;
      const spaceBottom =
        viewport.height - (targetRect.top + targetRect.height);
      const spaceLeft = targetRect.left;
      const spaceRight = viewport.width - (targetRect.left + targetRect.width);

      if (spaceBottom > tooltipRect.height + 20) {
        bestPosition = 'bottom';
      } else if (spaceTop > tooltipRect.height + 20) {
        bestPosition = 'top';
      } else if (spaceRight > tooltipRect.width + 20) {
        bestPosition = 'right';
      } else if (spaceLeft > tooltipRect.width + 20) {
        bestPosition = 'left';
      } else {
        bestPosition = 'bottom'; // fallback
      }
    } else {
      bestPosition = position;
    }

    // Calculate position based on chosen direction
    switch (bestPosition) {
      case 'top':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top - tooltipRect.height - 20;
        break;
      case 'bottom':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top + targetRect.height + 20;
        break;
      case 'left':
        x = targetRect.left - tooltipRect.width - 20;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = targetRect.left + targetRect.width + 20;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      default:
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top + targetRect.height + 20;
    }

    // Ensure tooltip stays within viewport
    x = Math.max(10, Math.min(x, viewport.width - tooltipRect.width - 10));
    y = Math.max(10, Math.min(y, viewport.height - tooltipRect.height - 10));

    setTooltipPosition({ x, y });
    setActualPosition(bestPosition);
  }, [targetRect, position]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          if (showSkip) onSkip();
          break;
        case 'ArrowRight':
        case 'Enter':
          if (currentStep < totalSteps - 1) onNext();
          break;
        case 'ArrowLeft':
          if (currentStep > 0) onPrevious();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isVisible,
    currentStep,
    totalSteps,
    showSkip,
    onNext,
    onPrevious,
    onSkip,
  ]);

  if (!mounted || !isVisible || !targetRect) return null;

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-3 h-3 transform rotate-45 bg-white border';

    switch (actualPosition) {
      case 'top':
        return `${baseClasses} -bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0`;
      case 'bottom':
        return `${baseClasses} -top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0`;
      case 'left':
        return `${baseClasses} -right-1.5 top-1/2 -translate-y-1/2 border-l-0 border-b-0`;
      case 'right':
        return `${baseClasses} -left-1.5 top-1/2 -translate-y-1/2 border-r-0 border-t-0`;
      default:
        return `${baseClasses} -top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0`;
    }
  };

  const tooltipContent = (
    <>
      {/* Backdrop with highlight */}
      <div
        className='fixed inset-0 z-40'
        style={{ backgroundColor: backdropColor }}
        onClick={showSkip ? onSkip : undefined}
      >
        {/* Highlight area */}
        <div
          className='absolute border-4 border-blue-500 rounded-lg shadow-2xl transition-all duration-300'
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            backgroundColor: highlightColor,
            boxShadow: `0 0 0 9999px ${backdropColor}`,
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-50 bg-white rounded-lg shadow-2xl border max-w-sm ${className}`}
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
        role='dialog'
        aria-live='polite'
        aria-labelledby='tooltip-title'
        aria-describedby='tooltip-content'
      >
        {/* Arrow */}
        <div className={getArrowClasses()} />

        {/* Content */}
        <div className='p-6'>
          {title && (
            <h3
              id='tooltip-title'
              className='text-lg font-semibold text-gray-900 mb-3'
            >
              {title}
            </h3>
          )}

          {content && (
            <p
              id='tooltip-content'
              className='text-gray-600 mb-4 leading-relaxed'
            >
              {content}
            </p>
          )}

          {/* Progress indicator */}
          <div className='flex items-center justify-between mb-4'>
            <span className='text-sm text-gray-500'>
              {currentStep + 1} of {totalSteps}
            </span>
            <div className='flex space-x-1'>
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          {showNavigation && (
            <div className='flex items-center justify-between'>
              <div>
                {showSkip && (
                  <button
                    onClick={onSkip}
                    className='text-sm text-gray-500 hover:text-gray-700 transition-colors'
                  >
                    Skip Tour
                  </button>
                )}
              </div>

              <div className='flex items-center space-x-2'>
                {currentStep > 0 && (
                  <button
                    onClick={onPrevious}
                    className='px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'
                  >
                    Previous
                  </button>
                )}

                <button
                  onClick={currentStep < totalSteps - 1 ? onNext : onSkip}
                  className='px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                  {currentStep < totalSteps - 1 ? 'Next' : 'Done'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(tooltipContent, document.body);
};

export default OnboardingTooltip;
