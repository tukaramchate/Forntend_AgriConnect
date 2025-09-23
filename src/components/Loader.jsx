import React from 'react';

// Loading spinner variants
const SpinnerVariant = {
  DOTS: 'dots',
  CIRCLE: 'circle',
  PULSE: 'pulse',
  BOUNCE: 'bounce'
};

// Size configurations
const sizeConfig = {
  small: {
    spinner: 'w-4 h-4',
    text: 'text-xs',
    gap: 'gap-2'
  },
  medium: {
    spinner: 'w-6 h-6',
    text: 'text-sm',
    gap: 'gap-3'
  },
  large: {
    spinner: 'w-8 h-8',
    text: 'text-base',
    gap: 'gap-4'
  },
  xlarge: {
    spinner: 'w-12 h-12',
    text: 'text-lg',
    gap: 'gap-5'
  }
};

// Spinner components
const DotsSpinner = ({ size = 'medium' }) => {
  const dotSize = size === 'small' ? 'w-1.5 h-1.5' : size === 'large' ? 'w-2.5 h-2.5' : size === 'xlarge' ? 'w-3 h-3' : 'w-2 h-2';
  
  return (
    <div className='flex items-center justify-center gap-1'>
      <div className={`${dotSize} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${dotSize} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`${dotSize} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

const CircleSpinner = ({ size = 'medium' }) => {
  const { spinner } = sizeConfig[size] || sizeConfig.medium;
  
  return (
    <div className={`${spinner} relative`}>
      <div className='absolute inset-0 border-2 border-secondary-200 rounded-full'></div>
      <div className='absolute inset-0 border-2 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
    </div>
  );
};

const PulseSpinner = ({ size = 'medium' }) => {
  const { spinner } = sizeConfig[size] || sizeConfig.medium;
  
  return (
    <div className={`${spinner} bg-primary-600 rounded-full animate-pulse`}></div>
  );
};

const BounceSpinner = ({ size = 'medium' }) => {
  const ballSize = size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-4 h-4' : size === 'xlarge' ? 'w-5 h-5' : 'w-3 h-3';
  
  return (
    <div className='flex items-end justify-center gap-1'>
      <div className={`${ballSize} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${ballSize} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '100ms' }}></div>
      <div className={`${ballSize} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '200ms' }}></div>
    </div>
  );
};

function Loader({
  size = 'medium', // "small" | "medium" | "large" | "xlarge"
  text = 'Loading...',
  overlay = false, // if true, render full-screen overlay
  inline = false, // inline (no vertical padding)
  variant = SpinnerVariant.CIRCLE, // "dots" | "circle" | "pulse" | "bounce"
  color = 'primary', // "primary" | "secondary" | "white"
  className = '',
  ariaLabel,
}) {
  const { text: textSize, gap } = sizeConfig[size] || sizeConfig.medium;
  
  // Color variants for different backgrounds
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600', 
    white: 'text-white',
  };

  const renderSpinner = () => {
    const spinnerProps = { size };
    
    switch (variant) {
      case SpinnerVariant.DOTS:
        return <DotsSpinner {...spinnerProps} />;
      case SpinnerVariant.PULSE:
        return <PulseSpinner {...spinnerProps} />;
      case SpinnerVariant.BOUNCE:
        return <BounceSpinner {...spinnerProps} />;
      case SpinnerVariant.CIRCLE:
      default:
        return <CircleSpinner {...spinnerProps} />;
    }
  };

  const loaderContent = (
    <div
      className={`flex flex-col items-center justify-center ${gap} ${
        inline ? '' : 'py-8'
      } ${colorClasses[color]} ${className}`}
      role='status'
      aria-live='polite'
      aria-label={ariaLabel || text || 'Loading'}
    >
      <div aria-hidden='true'>
        {renderSpinner()}
      </div>

      {text && (
        <div className={`${textSize} font-medium text-center ${colorClasses[color]}`}>
          <span className='sr-only'>{text}</span>
          <span aria-hidden='true'>{text}</span>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className='fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'>
        <div className='bg-white rounded-xl shadow-lg border border-secondary-200 p-8'>
          {loaderContent}
        </div>
      </div>
    );
  }

  return loaderContent;
}

// Skeleton loader for content placeholders
export function SkeletonLoader({ 
  className = '', 
  variant = 'text', // 'text' | 'circular' | 'rectangular'
  width,
  height,
  lines = 1
}) {
  const baseClasses = 'bg-secondary-200 animate-pulse';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses.text} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={index === 0 ? style : {}}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Card skeleton for product cards
export function CardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-secondary-200 overflow-hidden ${className}`}>
      <SkeletonLoader variant='rectangular' className='aspect-square' />
      <div className='p-4 space-y-3'>
        <SkeletonLoader variant='text' lines={2} />
        <div className='flex items-center gap-2'>
          <SkeletonLoader variant='circular' width='16px' height='16px' />
          <SkeletonLoader variant='text' width='60px' />
        </div>
        <div className='flex items-center justify-between'>
          <SkeletonLoader variant='text' width='80px' />
          <SkeletonLoader variant='rectangular' width='60px' height='32px' />
        </div>
      </div>
    </div>
  );
}

// Export spinner variants for convenience
Loader.Variant = SpinnerVariant;

export default Loader;
