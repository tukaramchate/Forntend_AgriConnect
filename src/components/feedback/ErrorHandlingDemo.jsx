import React, { useState } from 'react';
import { useErrorHandler } from '@hooks/error/useErrorHandler';
import {
  Toast,
  Banner,
  StatusIndicator,
  useToast,
} from '@components/feedback/FeedbackSystem';

/**
 * Example component demonstrating error handling and feedback system usage
 * This component shows various patterns and use cases for the feedback system
 */
function ErrorHandlingDemo() {
  const {
    handleError,
    handleAsyncError,
    clearErrors,
    isErrorActive,
    retryOperation,
    setFieldError,
    clearFieldError,
  } = useErrorHandler();

  const { showToast, hideToast } = useToast();

  const [status, setStatus] = useState('idle');
  const [showBanner, setShowBanner] = useState(true);
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [currentToastId, setCurrentToastId] = useState(null);

  // Simulate API call that succeeds
  const handleSuccessfulOperation = async () => {
    setStatus('loading');

    const toastId = showToast({
      type: 'loading',
      title: 'Processing...',
      message: 'Please wait while we save your data.',
      duration: 0,
    });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('success');
      hideToast(toastId);

      showToast({
        type: 'success',
        title: 'Success!',
        message: 'Your data has been saved successfully.',
        duration: 4000,
        action: {
          label: 'View Details',
          onClick: () => console.log('Viewing details...'),
        },
      });
    } catch (error) {
      handleError(error, {
        context: 'successful_operation',
        severity: 'medium',
        showToUser: true,
      });
      setStatus('error');
      hideToast(toastId);
    }
  };

  // Simulate API call that fails
  const handleFailedOperation = async () => {
    setStatus('loading');

    await handleAsyncError(
      async () => {
        // Simulate API delay and failure
        await new Promise((resolve) => setTimeout(resolve, 1500));
        throw new Error('Network timeout - server is not responding');
      },
      {
        context: 'api_failure_demo',
        severity: 'high',
        retryable: true,
        maxRetries: 3,
        showToUser: true,
        customMessage:
          'Failed to connect to server. Please check your internet connection.',
        onSuccess: () => {
          setStatus('success');
          showToast({
            type: 'success',
            title: 'Retry Successful!',
            message: 'The operation completed successfully after retry.',
          });
        },
        onFailure: () => {
          setStatus('error');
        },
      }
    );
  };

  // Simulate form validation error
  const handleFormValidation = () => {
    clearFieldError('email');
    clearFieldError('name');

    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.name || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        setFieldError(field, message);
      });

      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the highlighted fields before submitting.',
        duration: 5000,
      });

      return false;
    }

    showToast({
      type: 'success',
      title: 'Form Valid',
      message: 'All fields are correctly filled out!',
    });

    return true;
  };

  // Show different types of toasts
  const showToastExamples = () => {
    // Success toast
    showToast({
      type: 'success',
      title: 'Payment Processed',
      message: 'Your payment of $49.99 has been successfully processed.',
      action: {
        label: 'View Receipt',
        onClick: () => console.log('Viewing receipt...'),
      },
    });

    // Warning toast (delayed)
    setTimeout(() => {
      showToast({
        type: 'warning',
        title: 'Storage Almost Full',
        message: 'You have used 90% of your storage quota.',
        duration: 6000,
        action: {
          label: 'Upgrade Plan',
          onClick: () => console.log('Upgrading plan...'),
        },
      });
    }, 1000);

    // Info toast (delayed)
    setTimeout(() => {
      showToast({
        type: 'info',
        title: 'New Feature Available',
        message: 'Check out our new inventory management tools!',
        duration: 8000,
        action: {
          label: 'Learn More',
          onClick: () => console.log('Learning more...'),
        },
      });
    }, 2000);
  };

  // Handle persistent loading toast
  const handlePersistentLoading = () => {
    const toastId = showToast({
      type: 'loading',
      title: 'Large File Upload',
      message: 'Uploading your 50MB file... This may take a while.',
      duration: 0, // Persistent
    });

    setCurrentToastId(toastId);

    // Auto-hide after 10 seconds for demo
    setTimeout(() => {
      hideToast(toastId);
      showToast({
        type: 'success',
        title: 'Upload Complete',
        message: 'Your file has been uploaded successfully.',
      });
      setCurrentToastId(null);
    }, 10000);
  };

  // Simulate critical error
  const handleCriticalError = () => {
    handleError(new Error('Database connection failed'), {
      context: 'critical_system_error',
      severity: 'critical',
      showToUser: true,
      logToService: true,
      customMessage:
        'We are experiencing technical difficulties. Our team has been notified.',
    });
  };

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-8'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Error Handling & Feedback System Demo
        </h1>
        <p className='text-gray-600'>
          Interactive examples of error handling and user feedback components
        </p>
      </div>

      {/* Banner Example */}
      {showBanner && (
        <Banner
          type='info'
          title='Demo Environment'
          message='You are viewing a demonstration of the error handling and feedback system. All operations are simulated.'
          dismissible
          onDismiss={() => setShowBanner(false)}
          action={{
            label: 'View Documentation',
            onClick: () => console.log('Opening documentation...'),
          }}
        />
      )}

      {/* Status Indicator Example */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-xl font-semibold mb-4'>Status Indicators</h2>
        <div className='space-y-4'>
          <StatusIndicator
            status={status}
            message={{
              idle: 'Ready to perform operations',
              loading: 'Processing your request...',
              success: 'Operation completed successfully!',
              error: 'Something went wrong. Please try again.',
              warning: 'Please review the information provided.',
            }}
          />

          <div className='flex gap-3 flex-wrap'>
            <button
              onClick={handleSuccessfulOperation}
              disabled={status === 'loading'}
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Simulate Success
            </button>

            <button
              onClick={handleFailedOperation}
              disabled={status === 'loading'}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Simulate Failure (with Retry)
            </button>

            <button
              onClick={() => setStatus('idle')}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
            >
              Reset Status
            </button>
          </div>
        </div>
      </div>

      {/* Toast Examples */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-xl font-semibold mb-4'>Toast Notifications</h2>
        <div className='flex gap-3 flex-wrap'>
          <button
            onClick={showToastExamples}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Show Multiple Toasts
          </button>

          <button
            onClick={handlePersistentLoading}
            disabled={currentToastId !== null}
            className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Show Persistent Loading
          </button>

          {currentToastId && (
            <button
              onClick={() => {
                hideToast(currentToastId);
                setCurrentToastId(null);
              }}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
            >
              Cancel Loading
            </button>
          )}
        </div>
      </div>

      {/* Form Validation Example */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-xl font-semibold mb-4'>
          Form Validation & Error Handling
        </h2>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isErrorActive('email')
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder='Enter your email'
            />
            {isErrorActive('email') && (
              <p className='mt-1 text-sm text-red-600'>
                {/* Error message would be displayed here */}
                Please enter a valid email address
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Full Name
            </label>
            <input
              type='text'
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isErrorActive('name')
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder='Enter your full name'
            />
            {isErrorActive('name') && (
              <p className='mt-1 text-sm text-red-600'>
                Name must be at least 2 characters long
              </p>
            )}
          </div>

          <button
            onClick={handleFormValidation}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
          >
            Validate Form
          </button>
        </div>
      </div>

      {/* Error Handling Examples */}
      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-xl font-semibold mb-4'>Error Handling Examples</h2>
        <div className='space-y-4'>
          <p className='text-gray-600 text-sm'>
            These buttons demonstrate different types of error handling and user
            feedback patterns.
          </p>

          <div className='flex gap-3 flex-wrap'>
            <button
              onClick={handleCriticalError}
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
            >
              Simulate Critical Error
            </button>

            <button
              onClick={() => clearErrors()}
              className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
            >
              Clear All Errors
            </button>

            <button
              onClick={() => {
                const operationId = 'retry_demo';
                retryOperation(operationId, async () => {
                  // Simulate operation that might succeed on retry
                  if (Math.random() > 0.5) {
                    showToast({
                      type: 'success',
                      title: 'Retry Successful',
                      message: 'The operation completed successfully on retry.',
                    });
                  } else {
                    throw new Error('Operation still failing');
                  }
                });
              }}
              className='px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700'
            >
              Test Retry Logic
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className='bg-gray-50 rounded-lg border border-gray-200 p-6'>
        <h2 className='text-xl font-semibold mb-4'>System Information</h2>
        <div className='text-sm text-gray-600 space-y-2'>
          <p>
            <strong>Active Errors:</strong> {isErrorActive() ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Environment:</strong> Demo Mode
          </p>
          <p>
            <strong>Error Logging:</strong> Console Only
          </p>
          <p>
            <strong>Toast Position:</strong> Top Right
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorHandlingDemo;
