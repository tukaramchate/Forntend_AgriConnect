import React, { useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Error reporting function (for analytics/monitoring)
const reportError = (error, errorInfo) => {
  console.error('Error Boundary caught an error:', error, errorInfo);

  // In production, send to error tracking service
  if (import.meta.env.PROD) {
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    // errorTracker.captureException(error, { extra: errorInfo });
  }
};

// Main Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isDevelopment = import.meta.env.DEV;

  const handleCopyError = useCallback(() => {
    const errorText = `Error: ${error?.message}\n\nStack: ${error?.stack}`;
    navigator.clipboard?.writeText(errorText).then(() => {
      // Could show a toast notification here
      console.log('Error details copied to clipboard');
    });
  }, [error]);

  const handleReportIssue = useCallback(() => {
    // Open GitHub issues or support email
    const body = encodeURIComponent(
      `Error: ${error?.message}\n\nSteps to reproduce:\n1. \n2. \n3. `
    );
    window.open(
      `mailto:support@agriconnect.com?subject=Bug Report&body=${body}`,
      '_blank'
    );
  }, [error]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 flex items-center justify-center p-4'>
      <div className='max-w-lg w-full bg-white rounded-2xl shadow-xl border border-secondary-200 overflow-hidden'>
        {/* Header */}
        <div className='bg-red-50 border-b border-red-100 px-6 py-8 text-center'>
          <div className='w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-10 h-10 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-secondary-900 mb-2'>
            Oops! Something went wrong
          </h1>
          <p className='text-secondary-600 leading-relaxed'>
            We encountered an unexpected error. Don't worry, this has been
            reported and our team will look into it.
          </p>
        </div>

        {/* Content */}
        <div className='px-6 py-6 space-y-6'>
          {/* Actions */}
          <div className='space-y-3'>
            <button
              onClick={resetErrorBoundary}
              className='w-full bg-primary-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200'
            >
              Try Again
            </button>

            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={() => (window.location.href = '/')}
                className='px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg font-medium hover:bg-secondary-200 transition-colors duration-200'
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg font-medium hover:bg-secondary-200 transition-colors duration-200'
              >
                Refresh Page
              </button>
            </div>
          </div>

          {/* Error Details Toggle */}
          {isDevelopment && error && (
            <div className='border-t border-secondary-200 pt-6'>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className='flex items-center justify-between w-full text-left text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors'
              >
                <span>Error Details (Development)</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>

              {showDetails && (
                <div className='mt-4 space-y-4'>
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <h4 className='font-medium text-red-800 mb-2'>
                      Error Message:
                    </h4>
                    <p className='text-sm text-red-700 font-mono break-all'>
                      {error.message}
                    </p>
                  </div>

                  {error.stack && (
                    <div className='bg-secondary-50 border border-secondary-200 rounded-lg p-4'>
                      <h4 className='font-medium text-secondary-800 mb-2'>
                        Stack Trace:
                      </h4>
                      <pre className='text-xs text-secondary-700 overflow-auto max-h-32 font-mono'>
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  <div className='flex gap-2'>
                    <button
                      onClick={handleCopyError}
                      className='flex items-center gap-2 px-3 py-2 text-xs bg-secondary-100 text-secondary-700 rounded-md hover:bg-secondary-200 transition-colors'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                        />
                      </svg>
                      Copy Error
                    </button>
                    <button
                      onClick={handleReportIssue}
                      className='flex items-center gap-2 px-3 py-2 text-xs bg-secondary-100 text-secondary-700 rounded-md hover:bg-secondary-200 transition-colors'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                        />
                      </svg>
                      Report Issue
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className='border-t border-secondary-200 pt-6'>
            <h3 className='font-medium text-secondary-900 mb-3'>Need help?</h3>
            <div className='space-y-2'>
              <a
                href='/help'
                className='flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600 transition-colors'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                Visit Help Center
              </a>
              <a
                href='/contact'
                className='flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600 transition-colors'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page-level error boundary with compact styling
export const PageErrorBoundary = ({ children, fallback: CustomFallback }) => {
  const PageErrorFallback = ({ resetErrorBoundary }) => (
    <div className='min-h-64 flex items-center justify-center p-8'>
      <div className='text-center max-w-md'>
        <div className='w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center'>
          <svg
            className='w-8 h-8 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-secondary-900 mb-2'>
          Unable to load this section
        </h3>
        <p className='text-secondary-600 mb-6 leading-relaxed'>
          There was an error loading this content. Please try again or refresh
          the page.
        </p>
        <div className='space-y-2'>
          <button
            onClick={resetErrorBoundary}
            className='w-full bg-primary-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-primary-700 transition-colors duration-200'
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className='w-full text-secondary-600 hover:text-secondary-800 text-sm transition-colors duration-200'
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      FallbackComponent={CustomFallback || PageErrorFallback}
      onError={reportError}
    >
      {children}
    </ErrorBoundary>
  );
};

// Component-level error boundary with inline styling
export const ComponentErrorBoundary = ({
  children,
  componentName = 'Component',
  fallback: CustomFallback,
}) => {
  const ComponentErrorFallback = ({ error, resetErrorBoundary }) => (
    <div className='bg-red-50 border border-red-200 rounded-lg p-4 my-4'>
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0'>
          <svg
            className='w-5 h-5 text-red-600 mt-0.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <div className='flex-1 min-w-0'>
          <h4 className='text-sm font-medium text-red-800 mb-1'>
            {componentName} Failed to Load
          </h4>
          <p className='text-sm text-red-700 mb-3'>
            This component encountered an error. You can try reloading it or
            continue using the rest of the application.
          </p>
          <div className='flex gap-2'>
            <button
              onClick={resetErrorBoundary}
              className='text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors duration-200'
            >
              Retry
            </button>
            {import.meta.env.DEV && (
              <button
                onClick={() => console.error(`${componentName} Error:`, error)}
                className='text-sm text-red-600 hover:text-red-800 transition-colors duration-200'
              >
                Log Error
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      FallbackComponent={CustomFallback || ComponentErrorFallback}
      onError={(error, errorInfo) => {
        console.error(`Error in ${componentName}:`, error, errorInfo);
        reportError(error, { ...errorInfo, componentName });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Hook for manual error reporting - moved to separate file to avoid Fast Refresh issues
// export const useErrorHandler = () => {
//   return useCallback((error, errorInfo = {}) => {
//     reportError(error, errorInfo);
//   }, []);
// };

// Main Error Boundary wrapper component
const AppErrorBoundary = ({ children, fallback: CustomFallback }) => {
  return (
    <ErrorBoundary
      FallbackComponent={CustomFallback || ErrorFallback}
      onError={reportError}
      onReset={() => {
        // Clear any cached data, reset app state if needed
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
