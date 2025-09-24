import React, { useState } from 'react';

/**
 * SlideIn - Slide-in animation component with various directions
 * Perfect for cards, panels, and content reveals
 */
const SlideIn = ({ 
  children, 
  direction = 'left', // 'left', 'right', 'up', 'down'
  distance = 100,
  duration = 0.5,
  delay = 0,
  easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // ease-out-quad
  trigger = 'hover', // 'hover', 'click', 'auto'
  className = '',
  ...props 
}) => {
  const [isActive, setIsActive] = useState(trigger === 'auto');

  const getTransform = (active) => {
    if (active) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'left':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(${distance}px, 0, 0)`;
      case 'up':
        return `translate3d(0, -${distance}px, 0)`;
      case 'down':
        return `translate3d(0, ${distance}px, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const animationStyle = {
    transform: getTransform(isActive),
    transition: `transform ${duration}s ${easing} ${delay}s`,
    willChange: 'transform'
  };

  const handlers = trigger === 'hover' ? {
    onMouseEnter: () => setIsActive(true),
    onMouseLeave: () => setIsActive(false)
  } : trigger === 'click' ? {
    onClick: () => setIsActive(!isActive)
  } : {};

  return (
    <div
      className={`slide-in-animation ${className}`}
      style={animationStyle}
      {...handlers}
      {...props}
    >
      {children}
    </div>
  );
};

export default SlideIn;