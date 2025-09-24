/**
 * Animates a counter from start to end value
 *
 * @param {Object} options Animation options
 * @param {number} options.startValue Starting value
 * @param {number} options.endValue Target value
 * @param {number} options.duration Duration in milliseconds
 * @param {Function} options.onUpdate Callback with current value
 * @param {string} options.easing Easing function name (linear, easeOut)
 * @returns {Object} Animation controller
 */
export const animateCounter = ({
  startValue = 0,
  endValue,
  duration = 1000,
  onUpdate,
  easing = 'easeOut',
}) => {
  const startTime = performance.now();
  const change = endValue - startValue;

  // Easing functions
  const easingFunctions = {
    linear: (t) => t,
    easeOut: (t) => 1 - Math.pow(1 - t, 3),
    easeIn: (t) => t * t * t,
    easeInOut: (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  const selectedEasing = easingFunctions[easing] || easingFunctions.linear;

  // Check if we should use reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Skip animation for users who prefer reduced motion
    onUpdate(endValue);
    return { cancel: () => {} };
  }

  const step = (currentTime) => {
    let elapsed = currentTime - startTime;

    if (elapsed > duration) {
      elapsed = duration;
    }

    const progress = elapsed / duration;
    const easedProgress = selectedEasing(progress);
    const value = startValue + change * easedProgress;

    onUpdate(value);

    if (elapsed < duration) {
      animationFrameId = requestAnimationFrame(step);
    }
  };

  let animationFrameId = requestAnimationFrame(step);

  return {
    cancel: () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    },
  };
};

/**
 * Easing functions for smooth animations
 */
export const easings = {
  // Basic easings
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Cubic bezier easings
  easeInSine: 'cubic-bezier(0.12, 0, 0.39, 0)',
  easeOutSine: 'cubic-bezier(0.61, 1, 0.88, 1)',
  easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',

  easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
  easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
  easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',

  easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',

  // Special easings
  easeInBack: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
};

/**
 * Animation duration presets
 */
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
  slowest: 1000,
};

/**
 * Creates a smooth transition string
 */
export const transition = (
  property = 'all',
  duration = durations.normal,
  easing = easings.easeOut,
  delay = 0
) => {
  const durationMs = typeof duration === 'number' ? `${duration}ms` : duration;
  const delayMs = typeof delay === 'number' ? `${delay}ms` : delay;
  return `${property} ${durationMs} ${easing} ${delayMs}`;
};

/**
 * Stagger animation delays for multiple elements
 */
export const staggerDelay = (index, baseDelay = 100) => {
  return index * baseDelay;
};

/**
 * Get CSS transform string for 3D transforms
 */
export const transform3d = ({
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
} = {}) => {
  const transforms = [];

  if (translateX !== 0 || translateY !== 0 || translateZ !== 0) {
    transforms.push(
      `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`
    );
  }

  if (rotateX !== 0) transforms.push(`rotateX(${rotateX}deg)`);
  if (rotateY !== 0) transforms.push(`rotateY(${rotateY}deg)`);
  if (rotateZ !== 0) transforms.push(`rotateZ(${rotateZ}deg)`);

  if (scaleX !== 1 || scaleY !== 1 || scaleZ !== 1) {
    transforms.push(`scale3d(${scaleX}, ${scaleY}, ${scaleZ})`);
  }

  return transforms.join(' ') || 'none';
};

/**
 * Detect if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get safe animation duration (respects user preference)
 */
export const getSafeDuration = (duration = durations.normal) => {
  return prefersReducedMotion() ? 0 : duration;
};
