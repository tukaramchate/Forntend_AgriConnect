import React, { useEffect, useState } from 'react';

/**
 * StaggeredAnimation - Creates staggered animations for lists and grids
 * Perfect for animating multiple items with sequential delays
 */
const StaggeredAnimation = ({
  children,
  staggerDelay = 0.1, // Delay between each item
  duration = 0.6,
  direction = 'up', // 'up', 'down', 'left', 'right', 'scale'
  distance = 30,
  initialDelay = 0,
  triggerOnMount = true,
  className = '',
  ...props
}) => {
  const [isTriggered, setIsTriggered] = useState(!triggerOnMount);

  useEffect(() => {
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        setIsTriggered(true);
      }, initialDelay * 1000);

      return () => clearTimeout(timer);
    }
  }, [triggerOnMount, initialDelay]);

  const getTransform = (index, visible) => {
    if (visible) {
      return direction === 'scale' ? 'scale(1)' : 'translate3d(0, 0, 0)';
    }

    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(${distance}px, 0, 0)`;
      case 'scale':
        return 'scale(0.8)';
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`staggered-animation ${className}`} {...props}>
      {childrenArray.map((child, index) => {
        const animationDelay = initialDelay + index * staggerDelay;

        const itemStyle = {
          opacity: isTriggered ? 1 : 0,
          transform: getTransform(index, isTriggered),
          transition: `opacity ${duration}s ease-out ${animationDelay}s, transform ${duration}s ease-out ${animationDelay}s`,
          willChange: 'opacity, transform',
        };

        return (
          <div key={index} className='staggered-item' style={itemStyle}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default StaggeredAnimation;
