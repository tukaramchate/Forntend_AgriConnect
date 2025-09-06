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
  easing = 'easeOut'
}) => {
  const startTime = performance.now();
  const change = endValue - startValue;
  
  // Easing functions
  const easingFunctions = {
    linear: (t) => t,
    easeOut: (t) => 1 - Math.pow(1 - t, 3),
    easeIn: (t) => t * t * t,
    easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };
  
  const selectedEasing = easingFunctions[easing] || easingFunctions.linear;
  
  // Check if we should use reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
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
    }
  };
};