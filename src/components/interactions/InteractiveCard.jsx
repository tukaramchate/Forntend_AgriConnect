import React from 'react';
import { useCardInteractions } from '../../hooks/useMicroInteractions';
import FadeIn from '../animations/FadeIn';
import { HoverEffect } from '../animations/HoverEffect';
import './InteractiveCard.css';

const InteractiveCard = ({
  children,
  onClick,
  href,
  variant = 'default',
  padding = 'normal',
  hover = true,
  press = true,
  className = '',
  style = {},
  disabled = false,
  loading = false,
  selected = false,
  badge,
  image,
  imageAlt,
  imagePosition = 'top',
  header,
  footer,
  actions,
  ripple = false,
  ...props
}) => {
  const { interactions, ripples, getCardStyle } = useCardInteractions({
    enableHover: hover && !disabled,
    enablePress: press && !disabled,
    liftAmount: 6,
    scaleAmount: 1.02,
  });

  const handleClick = (event) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'card-elevated';
      case 'outlined':
        return 'card-outlined';
      case 'flat':
        return 'card-flat';
      case 'glass':
        return 'card-glass';
      default:
        return 'card-default';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return 'p-0';
      case 'small':
        return 'p-sm';
      case 'normal':
        return 'p-md';
      case 'large':
        return 'p-lg';
      default:
        return 'p-md';
    }
  };

  const getStateClasses = () => {
    const classes = [];
    if (disabled) classes.push('card-disabled');
    if (loading) classes.push('card-loading');
    if (selected) classes.push('card-selected');
    if (onClick || href) classes.push('card-interactive');
    return classes.join(' ');
  };

  const cardClasses = [
    'interactive-card',
    getVariantClasses(),
    getPaddingClasses(),
    getStateClasses(),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardContent = (
    <>
      {/* Badge */}
      {badge && <div className='card-badge'>{badge}</div>}

      {/* Image */}
      {image && (
        <div className={`card-image ${imagePosition}`}>
          <img src={image} alt={imageAlt || ''} />
        </div>
      )}

      {/* Header */}
      {header && <div className='card-header'>{header}</div>}

      {/* Content */}
      <div className='card-content'>
        {loading ? (
          <div className='card-loading-state'>
            <div className='loading-shimmer h-4 mb-2'></div>
            <div className='loading-shimmer h-4 mb-2 w-3/4'></div>
            <div className='loading-shimmer h-4 w-1/2'></div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {footer && <div className='card-footer'>{footer}</div>}

      {/* Actions */}
      {actions && <div className='card-actions'>{actions}</div>}

      {/* Ripple Effects */}
      {ripple && !disabled && (
        <div className='card-ripples'>
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className='card-ripple'
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
            />
          ))}
        </div>
      )}
    </>
  );

  const cardStyle = {
    ...getCardStyle(),
    ...style,
  };

  // Render as link if href provided
  if (href && !disabled) {
    return (
      <FadeIn>
        <a
          href={href}
          className={cardClasses}
          style={cardStyle}
          {...interactions}
          {...props}
        >
          {cardContent}
        </a>
      </FadeIn>
    );
  }

  // Render as button if interactive
  if (onClick && !disabled) {
    return (
      <FadeIn>
        <button
          type='button'
          className={cardClasses}
          style={cardStyle}
          onClick={handleClick}
          disabled={disabled || loading}
          {...interactions}
          {...props}
        >
          {cardContent}
        </button>
      </FadeIn>
    );
  }

  // Render as div
  return (
    <FadeIn>
      <div
        className={cardClasses}
        style={cardStyle}
        {...(onClick && !disabled
          ? { ...interactions, onClick: handleClick }
          : {})}
        {...props}
      >
        {cardContent}
      </div>
    </FadeIn>
  );
};

// Card components for better composition
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`card-content ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

export const CardActions = ({
  children,
  className = '',
  align = 'right',
  ...props
}) => (
  <div className={`card-actions align-${align} ${className}`} {...props}>
    {children}
  </div>
);

export const CardImage = ({
  src,
  alt,
  position = 'top',
  className = '',
  ...props
}) => (
  <div className={`card-image ${position} ${className}`} {...props}>
    <img src={src} alt={alt} />
  </div>
);

export const CardBadge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => (
  <div className={`card-badge variant-${variant} ${className}`} {...props}>
    {children}
  </div>
);

export default InteractiveCard;
