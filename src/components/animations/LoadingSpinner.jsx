import React from 'react';

/**
 * LoadingSpinner - Customizable loading spinner with multiple variants
 * Supports different sizes, colors, and animation styles
 */
const LoadingSpinner = ({
  size = 'medium', // 'small', 'medium', 'large', 'xl' or number
  variant = 'spin', // 'spin', 'dots', 'pulse', 'bounce', 'bars'
  color = 'primary',
  speed = 'normal', // 'slow', 'normal', 'fast'
  className = '',
  ...props
}) => {
  // Size mapping
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
    xl: 48,
  };

  const actualSize = typeof size === 'number' ? size : sizeMap[size];

  // Speed mapping
  const speedMap = {
    slow: '1.5s',
    normal: '1s',
    fast: '0.6s',
  };

  const animationDuration = speedMap[speed];

  // Color classes
  const colorClass =
    color === 'primary'
      ? 'text-primary-600'
      : color === 'secondary'
        ? 'text-secondary-500'
        : color === 'white'
          ? 'text-white'
          : color === 'current'
            ? 'text-current'
            : color;

  const renderSpinner = () => {
    switch (variant) {
      case 'spin':
        return (
          <svg
            className={`animate-spin ${colorClass}`}
            width={actualSize}
            height={actualSize}
            viewBox='0 0 24 24'
            fill='none'
          >
            <circle
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              className='opacity-25'
            />
            <path
              fill='currentColor'
              d='M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z'
              className='opacity-75'
            />
          </svg>
        );

      case 'dots':
        return (
          <div className={`flex space-x-1 ${colorClass}`}>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className='w-2 h-2 bg-current rounded-full animate-pulse'
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animationDuration,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`bg-current rounded-full animate-pulse ${colorClass}`}
            style={{
              width: actualSize,
              height: actualSize,
              animationDuration,
            }}
          />
        );

      case 'bounce':
        return (
          <div className={`flex space-x-1 ${colorClass}`}>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className='w-2 h-2 bg-current rounded-full animate-bounce'
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration,
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={`flex items-end space-x-1 ${colorClass}`}>
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className='w-1 bg-current animate-pulse'
                style={{
                  height: `${8 + (index % 2) * 4}px`,
                  animationDelay: `${index * 0.15}s`,
                  animationDuration,
                }}
              />
            ))}
          </div>
        );

      default:
        return renderSpinner();
    }
  };

  return (
    <div
      className={`loading-spinner inline-flex items-center justify-center ${className}`}
      role='status'
      aria-label='Loading'
      {...props}
    >
      {renderSpinner()}
      <span className='sr-only'>Loading...</span>
    </div>
  );
};

/**
 * LoadingOverlay - Full-screen or container loading overlay
 */
export const LoadingOverlay = ({
  isVisible = false,
  message = 'Loading...',
  variant = 'spin',
  backdropColor = 'rgba(255, 255, 255, 0.9)',
  className = '',
  children,
  ...props
}) => {
  if (!isVisible) return children || null;

  return (
    <div className='relative'>
      {children}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center z-50 ${className}`}
        style={{ backgroundColor: backdropColor }}
        {...props}
      >
        <LoadingSpinner variant={variant} size='large' />
        {message && (
          <p className='mt-4 text-sm text-gray-600 font-medium'>{message}</p>
        )}
      </div>
    </div>
  );
};

/**
 * LoadingButton - Button with integrated loading state
 */
export const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`relative inline-flex items-center justify-center ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner
          size='small'
          variant='spin'
          color='current'
          className='mr-2'
        />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
};

export default LoadingSpinner;
