import React from 'react';
import { useButtonInteractions } from '../../hooks/useMicroInteractions';
import HoverEffect from '../animations/HoverEffect';
import LoadingSpinner from '../animations/LoadingSpinner';
import './InteractiveButton.css';

const InteractiveButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  success = false,
  error = false,
  icon = null,
  onClick,
  className = '',
  style = {},
  hoverEffect = 'lift',
  ripple = true,
  hapticFeedback = false,
  ...props
}) => {
  const {
    interactions,
    ripples,
    isPressed,
    isHovered,
    handleClick,
    getButtonStyle,
  } = useButtonInteractions({
    hapticFeedback,
    visualFeedback: true,
  });

  const handleButtonClick = async (event) => {
    if (!disabled && !loading && onClick) {
      await handleClick(onClick, event);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'success':
        return 'btn-success';
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'ghost':
        return 'btn-ghost';
      case 'link':
        return 'btn-link';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'btn-sm';
      case 'medium':
        return 'btn-md';
      case 'large':
        return 'btn-lg';
      case 'xl':
        return 'btn-xl';
      default:
        return 'btn-md';
    }
  };

  const getStateClasses = () => {
    const classes = [];
    if (disabled) classes.push('btn-disabled');
    if (loading) classes.push('btn-loading');
    if (success) classes.push('btn-success-state');
    if (error) classes.push('btn-error-state');
    if (isPressed) classes.push('btn-pressed');
    if (isHovered) classes.push('btn-hovered');
    return classes.join(' ');
  };

  const buttonClasses = [
    'interactive-btn',
    getVariantClasses(),
    getSizeClasses(),
    getStateClasses(),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner size='small' className='btn-spinner' />
          <span className='btn-text'>Loading...</span>
        </>
      );
    }

    if (success) {
      return (
        <>
          <span className='btn-icon'>✓</span>
          <span className='btn-text'>Success!</span>
        </>
      );
    }

    if (error) {
      return (
        <>
          <span className='btn-icon'>✗</span>
          <span className='btn-text'>Error</span>
        </>
      );
    }

    return (
      <>
        {icon && <span className='btn-icon'>{icon}</span>}
        <span className='btn-text'>{children}</span>
      </>
    );
  };

  return (
    <HoverEffect effect={hoverEffect} disabled={disabled || loading}>
      <button
        className={buttonClasses}
        style={{
          ...getButtonStyle({
            scaleOnPress: 0.98,
            transition: 'all 0.2s ease-out',
          }),
          ...style,
        }}
        onClick={handleButtonClick}
        disabled={disabled || loading}
        {...interactions}
        {...props}
      >
        {buttonContent()}

        {/* Ripple effects */}
        {ripple && (
          <div className='btn-ripples'>
            {ripples.map((ripple) => (
              <div
                key={ripple.id}
                className='btn-ripple'
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
      </button>
    </HoverEffect>
  );
};

export default InteractiveButton;
