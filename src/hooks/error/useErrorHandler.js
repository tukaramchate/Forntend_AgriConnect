import { useState, useCallback, useRef } from 'react';

// Error types for categorization
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  PERMISSION: 'PERMISSION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

/**
 * Main error handling hook
 */
export const useErrorHandler = () => {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const errorIdRef = useRef(0);

  // Generate unique error ID
  const generateErrorId = useCallback(() => {
    errorIdRef.current += 1;
    return `error_${Date.now()}_${errorIdRef.current}`;
  }, []);

  // Categorize error based on error object
  const categorizeError = useCallback((error) => {
    if (!error) return { type: ERROR_TYPES.UNKNOWN, severity: ERROR_SEVERITY.LOW };

    // Network errors
    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
      return { type: ERROR_TYPES.NETWORK, severity: ERROR_SEVERITY.HIGH };
    }

    // HTTP status codes
    if (error.status || error.response?.status) {
      const status = error.status || error.response.status;
      
      if (status === 400) return { type: ERROR_TYPES.VALIDATION, severity: ERROR_SEVERITY.MEDIUM };
      if (status === 401 || status === 403) return { type: ERROR_TYPES.PERMISSION, severity: ERROR_SEVERITY.HIGH };
      if (status === 404) return { type: ERROR_TYPES.NOT_FOUND, severity: ERROR_SEVERITY.MEDIUM };
      if (status >= 500) return { type: ERROR_TYPES.SERVER, severity: ERROR_SEVERITY.HIGH };
      if (status >= 400) return { type: ERROR_TYPES.CLIENT, severity: ERROR_SEVERITY.MEDIUM };
    }

    // Timeout errors
    if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
      return { type: ERROR_TYPES.TIMEOUT, severity: ERROR_SEVERITY.MEDIUM };
    }

    // Validation errors
    if (error.name === 'ValidationError' || error.type === 'validation') {
      return { type: ERROR_TYPES.VALIDATION, severity: ERROR_SEVERITY.LOW };
    }

    return { type: ERROR_TYPES.UNKNOWN, severity: ERROR_SEVERITY.MEDIUM };
  }, []);

  // Get user-friendly error message
  const getUserFriendlyMessage = useCallback((error, type) => {
    const defaultMessages = {
      [ERROR_TYPES.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
      [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
      [ERROR_TYPES.PERMISSION]: 'You don\'t have permission to perform this action.',
      [ERROR_TYPES.NOT_FOUND]: 'The requested resource could not be found.',
      [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
      [ERROR_TYPES.CLIENT]: 'Something went wrong. Please try again.',
      [ERROR_TYPES.TIMEOUT]: 'Request timed out. Please try again.',
      [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred.'
    };

    // Try to get custom message from error object
    const customMessage = error?.message || error?.response?.data?.message || error?.data?.message;
    
    // Return custom message if it's user-friendly, otherwise use default
    if (customMessage && customMessage.length < 100 && !customMessage.includes('Error:')) {
      return customMessage;
    }

    return defaultMessages[type] || defaultMessages[ERROR_TYPES.UNKNOWN];
  }, []);

  // Add error to state
  const addError = useCallback((error, context = {}) => {
    const { type, severity } = categorizeError(error);
    const message = getUserFriendlyMessage(error, type);
    
    const errorObject = {
      id: generateErrorId(),
      error,
      message,
      type,
      severity,
      timestamp: new Date().toISOString(),
      context,
      dismissed: false
    };

    setErrors(prev => [errorObject, ...prev.slice(0, 9)]); // Keep max 10 errors

    // Auto-dismiss low severity errors after 5 seconds
    if (severity === ERROR_SEVERITY.LOW) {
      setTimeout(() => {
        setErrors(prev => prev.filter(err => err.id !== errorObject.id));
      }, 5000);
    }

    // Log error for debugging
    console.error('Error handled:', {
      message,
      type,
      severity,
      context,
      originalError: error
    });

    return errorObject.id;
  }, [categorizeError, getUserFriendlyMessage, generateErrorId]);

  // Remove error from state
  const dismissError = useCallback((errorId) => {
    setErrors(prev => prev.filter(err => err.id !== errorId));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Handle async operations with error catching
  const handleAsync = useCallback(async (asyncOperation, context = {}) => {
    setIsLoading(true);
    try {
      const result = await asyncOperation();
      setIsLoading(false);
      return { success: true, data: result };
    } catch (error) {
      setIsLoading(false);
      const errorId = addError(error, context);
      return { success: false, error, errorId };
    }
  }, [addError]);

  // Retry mechanism
  const retry = useCallback(async (operation, maxRetries = 3, context = {}) => {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      const result = await handleAsync(operation, { ...context, attempt: attempt + 1 });
      
      if (result.success) {
        return result;
      }
      
      attempt++;
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    // All retries failed
    addError(new Error(`Operation failed after ${maxRetries} attempts`), context);
    return { success: false, error: new Error('Max retries exceeded') };
  }, [handleAsync, addError]);

  return {
    errors,
    isLoading,
    addError,
    dismissError,
    clearErrors,
    handleAsync,
    retry,
    
    // Computed properties
    hasErrors: errors.length > 0,
    criticalErrors: errors.filter(err => err.severity === ERROR_SEVERITY.CRITICAL),
    highPriorityErrors: errors.filter(err => 
      err.severity === ERROR_SEVERITY.CRITICAL || err.severity === ERROR_SEVERITY.HIGH
    )
  };
};

/**
 * Form-specific error handling hook
 */
export const useFormErrors = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set error for specific field
  const setFieldError = useCallback((fieldName, error) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  // Clear error for specific field
  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Set multiple field errors
  const setMultipleFieldErrors = useCallback((errors) => {
    setFieldErrors(errors);
  }, []);

  // Clear all field errors
  const clearFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  // Handle form submission with error handling
  const handleSubmit = useCallback(async (submitFunction, validationSchema) => {
    setIsSubmitting(true);
    setSubmitError(null);
    clearFieldErrors();

    try {
      // Run validation if provided
      if (validationSchema) {
        await validationSchema.validate({}, { abortEarly: false });
      }

      const result = await submitFunction();
      setIsSubmitting(false);
      return { success: true, data: result };

    } catch (error) {
      setIsSubmitting(false);

      // Handle validation errors
      if (error.name === 'ValidationError' && error.inner) {
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        setFieldErrors(errors);
        return { success: false, validationErrors: errors };
      }

      // Handle API field errors
      if (error.response?.data?.fieldErrors) {
        setFieldErrors(error.response.data.fieldErrors);
        return { success: false, validationErrors: error.response.data.fieldErrors };
      }

      // Handle general submit error
      setSubmitError(error.message || 'An error occurred while submitting the form');
      return { success: false, error };
    }
  }, [clearFieldErrors]);

  return {
    fieldErrors,
    submitError,
    isSubmitting,
    setFieldError,
    clearFieldError,
    setMultipleFieldErrors,
    clearFieldErrors,
    clearSubmitError: () => setSubmitError(null),
    handleSubmit,
    
    // Computed properties
    hasFieldErrors: Object.keys(fieldErrors).length > 0,
    hasSubmitError: !!submitError,
    hasAnyErrors: Object.keys(fieldErrors).length > 0 || !!submitError
  };
};

/**
 * API-specific error handling hook
 */
export const useApiErrors = () => {
  const { addError, handleAsync, retry } = useErrorHandler();
  const [requestState, setRequestState] = useState({});

  // Track request state
  const setRequestLoading = useCallback((key, loading) => {
    setRequestState(prev => ({
      ...prev,
      [key]: { ...prev[key], loading }
    }));
  }, []);

  // API request wrapper with error handling
  const apiRequest = useCallback(async (key, requestFn, options = {}) => {
    const { 
      showError = true, 
      retries = 0, 
      context = {},
      loadingState = true 
    } = options;

    if (loadingState) {
      setRequestLoading(key, true);
    }

    const operation = retries > 0 ? 
      () => retry(requestFn, retries, { ...context, requestKey: key }) :
      () => handleAsync(requestFn, { ...context, requestKey: key });

    try {
      const result = await operation();
      
      if (loadingState) {
        setRequestState(prev => ({
          ...prev,
          [key]: { loading: false, error: null, lastFetch: Date.now() }
        }));
      }

      return result;
    } catch (error) {
      if (loadingState) {
        setRequestState(prev => ({
          ...prev,
          [key]: { loading: false, error, lastFetch: Date.now() }
        }));
      }

      if (showError) {
        addError(error, { ...context, requestKey: key });
      }

      throw error;
    }
  }, [addError, handleAsync, retry, setRequestLoading]);

  return {
    requestState,
    apiRequest,
    setRequestLoading,
    isLoading: (key) => requestState[key]?.loading || false,
    getError: (key) => requestState[key]?.error || null,
    getLastFetch: (key) => requestState[key]?.lastFetch || null
  };
};