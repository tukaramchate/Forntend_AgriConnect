import { useState, useEffect, useRef } from 'react';

/**
 * useIntersectionObserver - Hook for detecting when elements enter/leave viewport
 * Perfect for scroll-triggered animations
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef();

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false,
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        if (isElementIntersecting) {
          setIsIntersecting(true);
          if (!hasIntersected) {
            setHasIntersected(true);
          }
        } else if (!triggerOnce || !hasIntersected) {
          setIsIntersecting(false);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, triggerOnce, hasIntersected]);

  return [elementRef, isIntersecting, hasIntersected];
};

/**
 * useScrollAnimation - Hook for scroll-based animations
 * Returns scroll progress and position data
 */
export const useScrollAnimation = (options = {}) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const elementRef = useRef();

  const {
    offset = 0,
    throttle = 16, // ~60fps
  } = options;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollData = () => {
      const currentScrollY = window.scrollY;
      const element = elementRef.current;

      setScrollY(currentScrollY);
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');

      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + currentScrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate progress (0 to 1)
        const startPoint = elementTop - windowHeight + offset;
        const endPoint = elementTop + elementHeight - offset;
        const progress = Math.max(
          0,
          Math.min(1, (currentScrollY - startPoint) / (endPoint - startPoint))
        );

        setScrollProgress(progress);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollData);
        ticking = true;
      }
    };

    // Throttle scroll events
    let throttleTimer;
    const throttledScroll = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleScroll();
        throttleTimer = null;
      }, throttle);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    updateScrollData(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [offset, throttle]);

  return {
    elementRef,
    scrollY,
    scrollProgress,
    scrollDirection,
  };
};

/**
 * useParallax - Hook for parallax scroll effects
 */
export const useParallax = (speed = 0.5, direction = 'vertical') => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const element = elementRef.current;

      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Only apply parallax when element is in viewport
        if (
          scrolled + windowHeight > elementTop &&
          scrolled < elementTop + elementHeight
        ) {
          const parallaxOffset = (scrolled - elementTop) * speed;
          setOffset(parallaxOffset);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  const getTransform = () => {
    return direction === 'vertical'
      ? `translate3d(0, ${offset}px, 0)`
      : `translate3d(${offset}px, 0, 0)`;
  };

  return {
    elementRef,
    offset,
    transform: getTransform(),
  };
};

/**
 * useHover - Enhanced hover state hook with enter/leave delays
 */
export const useHover = (enterDelay = 0, leaveDelay = 0) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const enterTimerRef = useRef();
  const leaveTimerRef = useRef();

  const handleMouseEnter = () => {
    // Clear any pending leave timer
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (enterDelay > 0) {
      setIsPending(true);
      enterTimerRef.current = setTimeout(() => {
        setIsHovered(true);
        setIsPending(false);
      }, enterDelay);
    } else {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    // Clear any pending enter timer
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
      setIsPending(false);
    }

    if (leaveDelay > 0) {
      leaveTimerRef.current = setTimeout(() => {
        setIsHovered(false);
      }, leaveDelay);
    } else {
      setIsHovered(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  return {
    isHovered,
    isPending,
    hoverProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
};
