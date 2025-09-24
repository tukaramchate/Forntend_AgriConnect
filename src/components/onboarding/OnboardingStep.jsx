import React from 'react';

/**
 * OnboardingStep - Individual step component for onboarding flows
 * Features: Icon, title, description, interactive elements, visual indicators
 */
const OnboardingStep = ({
  icon,
  title = '',
  description = '',
  children,
  image,
  video,
  className = '',
  actions = null,
  tips = [],
  isActive = false,
  variant = 'default', // 'default', 'centered', 'image-left', 'video'
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return (
        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
          <span className='text-2xl'>{icon}</span>
        </div>
      );
    }

    return (
      <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
        {icon}
      </div>
    );
  };

  const renderMedia = () => {
    if (video) {
      return (
        <div className='mb-6'>
          <video
            className='w-full h-64 object-cover rounded-lg shadow-md'
            controls
            poster={image}
            aria-label={`Video demonstration: ${title}`}
          >
            <source src={video} type='video/mp4' />
            <p>Your browser doesn't support video playback.</p>
          </video>
        </div>
      );
    }

    if (image) {
      return (
        <div className='mb-6'>
          <img
            src={image}
            alt={`Illustration for ${title}`}
            className='w-full h-64 object-cover rounded-lg shadow-md'
          />
        </div>
      );
    }

    return null;
  };

  const renderTips = () => {
    if (!tips || tips.length === 0) return null;

    return (
      <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
        <h4 className='font-medium text-blue-900 mb-2 flex items-center'>
          <svg
            className='w-4 h-4 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          Pro Tips
        </h4>
        <ul className='space-y-1'>
          {tips.map((tip, index) => (
            <li key={index} className='text-sm text-blue-800 flex items-start'>
              <span className='inline-block w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0' />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'centered':
        return 'text-center';
      case 'image-left':
        return 'flex items-start space-x-6';
      case 'video':
        return 'text-center';
      default:
        return '';
    }
  };

  const renderContent = () => {
    if (variant === 'image-left') {
      return (
        <div className='flex items-start space-x-6'>
          <div className='flex-shrink-0'>{renderMedia()}</div>
          <div className='flex-1'>
            {renderIcon()}
            {title && (
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>{title}</h3>
            )}
            {description && (
              <p className='text-gray-600 text-lg leading-relaxed mb-6'>
                {description}
              </p>
            )}
            {children}
            {actions}
            {renderTips()}
          </div>
        </div>
      );
    }

    return (
      <>
        {renderMedia()}
        {variant === 'centered' ? (
          <div className='text-center'>{renderIcon()}</div>
        ) : (
          renderIcon()
        )}
        {title && (
          <h3
            className={`text-2xl font-bold text-gray-900 mb-4 ${variant === 'centered' ? 'text-center' : ''}`}
          >
            {title}
          </h3>
        )}
        {description && (
          <p
            className={`text-gray-600 text-lg leading-relaxed mb-6 ${variant === 'centered' ? 'text-center' : ''}`}
          >
            {description}
          </p>
        )}
        {children}
        {actions && (
          <div
            className={`mt-6 ${variant === 'centered' ? 'text-center' : ''}`}
          >
            {actions}
          </div>
        )}
        {renderTips()}
      </>
    );
  };

  return (
    <div
      className={`onboarding-step ${getVariantClasses()} ${className} ${isActive ? 'active' : ''}`}
    >
      {renderContent()}
    </div>
  );
};

export default OnboardingStep;
