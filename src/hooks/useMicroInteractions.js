import { useState, useCallback, useRef, useEffect } from 'react';
import { getSafeDuration } from '../utils/animations';

/**
 * Hook for managing micro-interactions and user feedback
 */
export const useMicroInteractions = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [ripples, setRipples] = useState([]);
  const timeoutRef = useRef(null);

  // Handle mouse press
  const handleMouseDown = useCallback((event) => {
    setIsPressed(true);
    
    // Create ripple effect
    if (event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const ripple = {
        id: Date.now(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        size: Math.max(rect.width, rect.height)
      };
      
      setRipples(prev => [...prev, ripple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 600);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Touch support
  const handleTouchStart = useCallback((event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = event.currentTarget.getBoundingClientRect();
      
      setIsPressed(true);
      
      // Create ripple effect for touch
      const ripple = {
        id: Date.now(),
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        size: Math.max(rect.width, rect.height)
      };
      
      setRipples(prev => [...prev, ripple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 600);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    const timeout = timeoutRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return {
    // State
    isPressed,
    isHovered,
    isFocused,
    ripples,
    
    // Event handlers
    interactions: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    },
    
    // Helper functions
    getInteractionClasses: (baseClasses = '') => {
      const classes = [baseClasses];
      
      if (isPressed) classes.push('pressed');
      if (isHovered) classes.push('hovered');
      if (isFocused) classes.push('focused');
      
      return classes.filter(Boolean).join(' ');
    },
    
    // Animation styles
    getAnimationStyle: (config = {}) => {
      const {
        scaleOnPress = 0.98,
        liftOnHover = 2,
        shadowOnHover = '0 4px 12px rgba(0,0,0,0.15)',
        transition = 'all 0.2s ease-out'
      } = config;
      
      return {
        transition: getSafeDuration(200) > 0 ? transition : 'none',
        transform: isPressed ? `scale(${scaleOnPress})` : 
                  isHovered ? `translateY(-${liftOnHover}px)` : 'none',
        boxShadow: isHovered ? shadowOnHover : 'none'
      };
    }
  };
};

/**
 * Hook for button interactions with enhanced feedback
 */
export const useButtonInteractions = (options = {}) => {
  const {
    hapticFeedback = false,
    soundFeedback = false,
    visualFeedback = true
  } = options;
  
  const microInteractions = useMicroInteractions();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Enhanced click handler with feedback
  const handleClick = useCallback(async (originalHandler, event) => {
    // Haptic feedback (mobile)
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    // Sound feedback
    if (soundFeedback) {
      // Could integrate with audio context for click sounds
    }
    
    // Visual feedback
    if (visualFeedback) {
      setIsLoading(true);
    }
    
    try {
      if (originalHandler) {
        await originalHandler(event);
      }
      
      if (visualFeedback) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 1000);
      }
    } catch (error) {
      if (visualFeedback) {
        setIsError(true);
        setTimeout(() => setIsError(false), 1000);
      }
      throw error;
    } finally {
      if (visualFeedback) {
        setIsLoading(false);
      }
    }
  }, [hapticFeedback, soundFeedback, visualFeedback]);

  return {
    ...microInteractions,
    isLoading,
    isSuccess,
    isError,
    handleClick,
    
    // Enhanced interaction styles
    getButtonStyle: (config = {}) => {
      const baseStyle = microInteractions.getAnimationStyle(config);
      
      let backgroundColor = config.backgroundColor;
      if (isSuccess) backgroundColor = '#10b981';
      if (isError) backgroundColor = '#ef4444';
      if (isLoading) backgroundColor = '#6b7280';
      
      return {
        ...baseStyle,
        backgroundColor,
        cursor: isLoading ? 'wait' : 'pointer',
        opacity: isLoading ? 0.8 : 1
      };
    }
  };
};

/**
 * Hook for form field interactions
 */
export const useFieldInteractions = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((event) => {
    setIsFocused(false);
    setHasValue(!!event.target.value);
  }, []);

  const handleChange = useCallback((event) => {
    setHasValue(!!event.target.value);
    
    // Reset validation state on change
    if (!isValid) {
      setIsValid(true);
      setValidationMessage('');
    }
  }, [isValid]);

  const validate = useCallback((value, validator) => {
    if (validator) {
      const result = validator(value);
      setIsValid(result.isValid);
      setValidationMessage(result.message || '');
      return result.isValid;
    }
    return true;
  }, []);

  return {
    isFocused,
    hasValue,
    isValid,
    validationMessage,
    
    fieldProps: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange
    },
    
    validate,
    
    getFieldClasses: (baseClasses = '') => {
      const classes = [baseClasses];
      
      if (isFocused) classes.push('focused');
      if (hasValue) classes.push('has-value');
      if (!isValid) classes.push('invalid');
      
      return classes.filter(Boolean).join(' ');
    },
    
    getFieldStyle: () => ({
      transition: getSafeDuration(200) > 0 ? 'all 0.2s ease-out' : 'none',
      borderColor: !isValid ? '#ef4444' : isFocused ? '#4a90e2' : '#d1d5db',
      boxShadow: isFocused ? '0 0 0 3px rgba(74, 144, 226, 0.1)' : 'none'
    })
  };
};

/**
 * Hook for card interactions
 */
export const useCardInteractions = (options = {}) => {
  const {
    enableHover = true,
    enablePress = true,
    liftAmount = 4,
    scaleAmount = 1.02
  } = options;
  
  const microInteractions = useMicroInteractions();

  return {
    ...microInteractions,
    
    getCardStyle: () => {
      const style = {
        transition: getSafeDuration(200) > 0 ? 'all 0.2s ease-out' : 'none'
      };
      
      if (enableHover && microInteractions.isHovered) {
        style.transform = `translateY(-${liftAmount}px) scale(${scaleAmount})`;
        style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }
      
      if (enablePress && microInteractions.isPressed) {
        style.transform = 'scale(0.98)';
      }
      
      return style;
    }
  };
};