import React, { useState, useRef } from 'react';

/**
 * ScaleAnimation - Scale animation component for buttons, cards, and interactive elements
 * Provides smooth scaling effects with customizable scale factors
 */
const ScaleAnimation = ({
  children,
  scaleOnHover = 1.05,
  scaleOnActive = 0.95,
  duration = 0.2,
  easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)', // back-out
  className = '',
  disabled = false,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const elementRef = useRef();

  const getScale = () => {
    if (disabled) return 1;
    if (isActive) return scaleOnActive;
    if (isHovered) return scaleOnHover;
    return 1;
  };

  const animationStyle = {
    transform: `scale(${getScale()})`,
    transition: `transform ${duration}s ${easing}`,
    willChange: 'transform',
    transformOrigin: 'center center',
  };

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
      setIsActive(false);
    }
  };

  const handleMouseDown = () => {
    if (!disabled) setIsActive(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsActive(false);
  };

  return (
    <div
      ref={elementRef}
      className={`scale-animation ${disabled ? 'disabled' : ''} ${className}`}
      style={animationStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScaleAnimation;
