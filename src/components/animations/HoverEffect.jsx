import React, { useState, useRef } from 'react';

/**
 * HoverEffect - Advanced hover effects with customizable animations
 * Supports various hover styles including glow, lift, tilt, and shine
 */
const HoverEffect = ({ 
  children,
  effect = 'lift', // 'lift', 'glow', 'tilt', 'shine', 'zoom', 'rotate'
  intensity = 'medium', // 'subtle', 'medium', 'strong'
  duration = 0.3,
  className = '',
  disabled = false,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef();

  // Intensity mapping
  const intensityMap = {
    subtle: 0.5,
    medium: 1,
    strong: 1.5
  };

  const multiplier = intensityMap[intensity];

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseMove = (e) => {
    if (!disabled && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePosition({ x, y });
    }
  };

  const getEffectStyles = () => {
    if (disabled || !isHovered) {
      return {
        transform: 'none',
        boxShadow: 'none',
        filter: 'none'
      };
    }

    const baseStyles = {
      transition: `all ${duration}s ease-out`,
      willChange: 'transform, box-shadow, filter'
    };

    switch (effect) {
      case 'lift':
        return {
          ...baseStyles,
          transform: `translateY(-${4 * multiplier}px) scale(${1 + 0.02 * multiplier})`,
          boxShadow: `0 ${8 * multiplier}px ${24 * multiplier}px rgba(0, 0, 0, 0.15)`
        };

      case 'glow':
        return {
          ...baseStyles,
          boxShadow: `0 0 ${20 * multiplier}px rgba(59, 130, 246, ${0.5 * multiplier})`,
          filter: `brightness(${1 + 0.1 * multiplier})`
        };

      case 'tilt':
        return {
          ...baseStyles,
          transform: `perspective(1000px) rotateX(${mousePosition.y * 10 * multiplier}deg) rotateY(${mousePosition.x * 10 * multiplier}deg) translateZ(${10 * multiplier}px)`
        };

      case 'shine':
        return {
          ...baseStyles,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `linear-gradient(45deg, transparent, rgba(255, 255, 255, ${0.3 * multiplier}), transparent)`,
            transform: `translate(-100%, -100%) rotate(45deg)`,
            animation: `shine ${duration * 2}s ease-out`
          }
        };

      case 'zoom':
        return {
          ...baseStyles,
          transform: `scale(${1 + 0.05 * multiplier})`
        };

      case 'rotate':
        return {
          ...baseStyles,
          transform: `rotate(${2 * multiplier}deg) scale(${1 + 0.02 * multiplier})`
        };

      default:
        return baseStyles;
    }
  };

  const effectStyles = getEffectStyles();

  return (
    <div
      ref={elementRef}
      className={`hover-effect ${effect} ${disabled ? 'disabled' : ''} ${className}`}
      style={effectStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {children}
      {effect === 'shine' && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            background: `linear-gradient(45deg, transparent, rgba(255, 255, 255, ${0.3 * multiplier}), transparent)`,
            transform: `translateX(-100%) skewX(-45deg)`,
            animation: `shine-sweep ${duration}s ease-out`
          }}
        />
      )}
    </div>
  );
};

/**
 * RippleEffect - Material Design ripple effect
 */
export const RippleEffect = ({ 
  children,
  color = 'rgba(255, 255, 255, 0.6)',
  duration = 0.6,
  className = '',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);
  const containerRef = useRef();

  const handleClick = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, duration * 1000);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animation: `ripple ${duration}s ease-out`
          }}
        />
      ))}
    </div>
  );
};

export default HoverEffect;