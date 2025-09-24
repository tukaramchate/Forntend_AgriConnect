# Error Handling & Feedback System Documentation

## Overview

This system provides comprehensive error handling and user feedback components for the AgriConnect application. It includes error boundaries, error notifications, toasts, banners, and status indicators with consistent styling and behavior.

## Components

### 1. Error Handling

#### ErrorBoundary

Catches and handles React component errors at different levels.

```jsx
import ErrorBoundary from '@components/ErrorBoundary';

// App-level error boundary (already set up in App.jsx)
<AppErrorBoundary>
  <App />
</AppErrorBoundary>

// Page-level error boundary
<PageErrorBoundary>
  <ProductsPage />
</PageErrorBoundary>

// Component-level error boundary
<ComponentErrorBoundary>
  <ComplexComponent />
</ComponentErrorBoundary>
```

#### useErrorHandler Hook

Centralized error handling with categorization, logging, and user feedback.

```jsx
import { useErrorHandler } from '@hooks/error/useErrorHandler';

function MyComponent() {
  const {
    handleError,
    handleAsyncError,
    clearErrors,
    isErrorActive,
    retryOperation,
    setFieldError,
    clearFieldError,
    setMultipleFieldErrors,
  } = useErrorHandler();

  // Handle synchronous errors
  const handleClick = () => {
    try {
      riskyOperation();
    } catch (error) {
      handleError(error, {
        context: 'button_click',
        severity: 'medium',
        showToUser: true,
        logToService: true,
      });
    }
  };

  // Handle async errors with retry
  const handleAsyncOperation = async () => {
    await handleAsyncError(
      async () => {
        const result = await apiCall();
        return result;
      },
      {
        context: 'api_call',
        severity: 'high',
        retryable: true,
        maxRetries: 3,
        showToUser: true,
      }
    );
  };

  // Handle form errors
  const handleFormSubmit = async (formData) => {
    try {
      await submitForm(formData);
    } catch (error) {
      if (error.validation) {
        setMultipleFieldErrors(error.validation);
      } else {
        handleError(error, { context: 'form_submit' });
      }
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Action</button>
      <button onClick={handleAsyncOperation}>Async Action</button>
      {isErrorActive('form_submit') && (
        <div className='error-message'>
          Form submission failed. Please try again.
        </div>
      )}
    </div>
  );
}
```

### 2. Feedback System

#### Toast Notifications

Temporary notifications for user actions and system events.

```jsx
import { Toast, useToast } from '@components/feedback/FeedbackSystem';

function MyComponent() {
  const { showToast, hideToast } = useToast();

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Success!',
      message: 'Your changes have been saved.',
      duration: 4000,
      action: {
        label: 'View',
        onClick: () => navigateToView(),
      },
    });
  };

  const handleError = () => {
    const toastId = showToast({
      type: 'error',
      title: 'Upload Failed',
      message: 'Failed to upload file. Please try again.',
      duration: 0, // Persistent
      action: {
        label: 'Retry',
        onClick: () => retryUpload(),
      },
    });
  };

  const handleLoading = () => {
    const toastId = showToast({
      type: 'loading',
      title: 'Processing...',
      message: 'Please wait while we process your request.',
      duration: 0,
    });

    // Hide when done
    setTimeout(() => hideToast(toastId), 5000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleLoading}>Show Loading</button>
    </div>
  );
}
```

#### Banner Notifications

Persistent notifications for important information.

```jsx
import { Banner } from '@components/feedback/FeedbackSystem';

function MyComponent() {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <Banner
      type='warning'
      title='Maintenance Notice'
      message='System maintenance is scheduled for tonight at 11 PM PST. Service may be temporarily unavailable.'
      dismissible
      onDismiss={() => setShowBanner(false)}
      action={{
        label: 'Learn More',
        onClick: () => openMaintenanceInfo(),
      }}
    />
  );
}
```

#### Status Indicators

Show current state of operations or data.

```jsx
import { StatusIndicator } from '@components/feedback/FeedbackSystem';

function MyComponent() {
  const [status, setStatus] = useState('idle');

  return (
    <div>
      <StatusIndicator
        status={status}
        message={{
          idle: 'Ready to start',
          loading: 'Processing your request...',
          success: 'Successfully completed!',
          error: 'Something went wrong',
          warning: 'Please review your input',
        }}
      />
    </div>
  );
}
```

### 3. Error Notifications

Specialized notifications for error handling.

```jsx
import { ErrorNotification } from '@components/errors/ErrorNotification';

function MyComponent() {
  const [error, setError] = useState(null);

  const handleApiError = async () => {
    try {
      await apiCall();
    } catch (error) {
      setError({
        id: Date.now(),
        message: error.message,
        type: 'api',
        severity: 'high',
        context: { operation: 'data_fetch', timestamp: Date.now() },
        retryable: true,
      });
    }
  };

  return (
    <div>
      {error && (
        <ErrorNotification
          error={error}
          onDismiss={() => setError(null)}
          onRetry={handleApiError}
        />
      )}
    </div>
  );
}
```

## Usage Patterns

### 1. API Error Handling

```jsx
import { useErrorHandler } from '@hooks/error/useErrorHandler';
import { useToast } from '@components/feedback/FeedbackSystem';

function useApiCall() {
  const { handleAsyncError } = useErrorHandler();
  const { showToast } = useToast();

  const makeApiCall = async (endpoint, options = {}) => {
    return handleAsyncError(
      async () => {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();

        if (options.showSuccessToast) {
          showToast({
            type: 'success',
            title: 'Success',
            message:
              options.successMessage || 'Operation completed successfully',
          });
        }

        return data;
      },
      {
        context: `api_${endpoint}`,
        severity: 'high',
        retryable: true,
        showToUser: true,
        logToService: true,
      }
    );
  };

  return { makeApiCall };
}
```

### 2. Form Validation and Submission

```jsx
import { useErrorHandler } from '@hooks/error/useErrorHandler';
import { useToast } from '@components/feedback/FeedbackSystem';

function useFormHandler() {
  const {
    handleError,
    setFieldError,
    clearFieldError,
    setMultipleFieldErrors,
  } = useErrorHandler();
  const { showToast } = useToast();

  const validateAndSubmit = async (formData, validationRules, submitFn) => {
    // Clear previous errors
    Object.keys(formData).forEach((field) => clearFieldError(field));

    // Client-side validation
    const errors = {};
    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = formData[field];
      rules.forEach((rule) => {
        if (!rule.validator(value)) {
          errors[field] = rule.message;
        }
      });
    });

    if (Object.keys(errors).length > 0) {
      setMultipleFieldErrors(errors);
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the highlighted fields',
      });
      return;
    }

    // Submit form
    try {
      const result = await submitFn(formData);
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Form submitted successfully',
      });
      return result;
    } catch (error) {
      if (error.validationErrors) {
        setMultipleFieldErrors(error.validationErrors);
      } else {
        handleError(error, {
          context: 'form_submission',
          severity: 'medium',
          showToUser: true,
        });
      }
      throw error;
    }
  };

  return { validateAndSubmit };
}
```

### 3. File Upload with Progress

```jsx
import { useToast } from '@components/feedback/FeedbackSystem';
import { StatusIndicator } from '@components/feedback/FeedbackSystem';

function FileUploadComponent() {
  const { showToast, hideToast } = useToast();
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file) => {
    setUploadStatus('loading');
    setProgress(0);

    const toastId = showToast({
      type: 'loading',
      title: 'Uploading...',
      message: `Uploading ${file.name}`,
      duration: 0,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      setUploadStatus('success');
      hideToast(toastId);

      showToast({
        type: 'success',
        title: 'Upload Complete',
        message: `${file.name} uploaded successfully`,
        action: {
          label: 'View File',
          onClick: () => viewFile(file.name),
        },
      });
    } catch (error) {
      setUploadStatus('error');
      hideToast(toastId);

      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: `Failed to upload ${file.name}`,
        action: {
          label: 'Retry',
          onClick: () => handleFileUpload(file),
        },
      });
    }
  };

  return (
    <div>
      <input
        type='file'
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />

      <StatusIndicator
        status={uploadStatus}
        message={{
          idle: 'Select a file to upload',
          loading: `Uploading... ${progress}%`,
          success: 'Upload completed successfully',
          error: 'Upload failed - please try again',
        }}
      />
    </div>
  );
}
```

## Best Practices

### 1. Error Categorization

- **Critical**: System failures, security issues
- **High**: API failures, data corruption
- **Medium**: Validation errors, user input issues
- **Low**: Minor UI glitches, non-blocking issues

### 2. User-Friendly Messages

- Use clear, non-technical language
- Provide actionable guidance
- Include recovery options when possible
- Maintain consistent tone and style

### 3. Logging and Monitoring

- Log all errors with context
- Include user journey information
- Track error patterns and frequency
- Monitor error resolution rates

### 4. Accessibility

- Include proper ARIA labels
- Support keyboard navigation
- Use semantic HTML elements
- Provide screen reader friendly content

### 5. Performance

- Debounce error notifications
- Limit concurrent toast notifications
- Clean up error states appropriately
- Use React.memo for expensive components

## Configuration

### Toast Container Settings

```jsx
<ToastContainer
  position='top-right' // top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
  maxToasts={5}
  duration={4000}
  pauseOnHover={true}
  closeOnClick={true}
/>
```

### Error Handler Settings

```jsx
const errorConfig = {
  logToConsole: process.env.NODE_ENV === 'development',
  logToService: process.env.NODE_ENV === 'production',
  showUserFeedback: true,
  retryAttempts: 3,
  retryDelay: 1000,
};
```

## Testing

### Unit Tests

```jsx
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '@hooks/error/useErrorHandler';

test('should handle errors correctly', () => {
  const { result } = renderHook(() => useErrorHandler());

  act(() => {
    result.current.handleError(new Error('Test error'), {
      context: 'test',
      severity: 'medium',
    });
  });

  expect(result.current.isErrorActive('test')).toBe(true);
});
```

### Integration Tests

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastContainer, useToast } from '@components/feedback/FeedbackSystem';

test('should show and hide toasts', async () => {
  function TestComponent() {
    const { showToast } = useToast();
    return (
      <div>
        <button onClick={() => showToast({ type: 'success', message: 'Test' })}>
          Show Toast
        </button>
        <ToastContainer />
      </div>
    );
  }

  render(<TestComponent />);

  fireEvent.click(screen.getByText('Show Toast'));

  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

This comprehensive error handling and feedback system provides a robust foundation for user experience in the AgriConnect application, ensuring errors are handled gracefully and users receive appropriate feedback for all their interactions.
