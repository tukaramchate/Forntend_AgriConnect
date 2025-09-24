import React, { useEffect, useRef, useState } from 'react';

/**
 * FadeIn - Smooth fade-in animation component
 * Supports intersection observer for scroll-triggered animations
 */
const FadeIn = ({
  children,
  duration = 0.6,
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  distance = 30,
  triggerOnce = true,
  threshold = 0.1,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, triggerOnce, hasTriggered]);

  // Calculate transform based on direction
  const getTransform = (visible) => {
    if (direction === 'none') return 'translateX(0)';

    const moveDistance = visible ? 0 : distance;
    switch (direction) {
      case 'up':
        return `translateY(${visible ? 0 : moveDistance}px)`;
      case 'down':
        return `translateY(${visible ? 0 : -moveDistance}px)`;
      case 'left':
        return `translateX(${visible ? 0 : moveDistance}px)`;
      case 'right':
        return `translateX(${visible ? 0 : -moveDistance}px)`;
      default:
        return 'translateY(0)';
    }
  };

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(isVisible),
    transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
    willChange: 'opacity, transform',
  };

  return (
    <div
      ref={elementRef}
      className={`fade-in-animation ${className}`}
      style={animationStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default FadeIn;
