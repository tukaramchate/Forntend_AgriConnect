import React from 'react';
import {
  useErrorHandler,
  ERROR_SEVERITY,
  ERROR_TYPES,
} from '../../hooks/error/useErrorHandler';
import FadeIn from '../animations/FadeIn';
import InteractiveButton from '../interactions/InteractiveButton';
import './ErrorNotification.css';

const ErrorNotification = ({ error, onDismiss, onRetry, className = '' }) => {
  const getIconForType = (type) => {
    switch (type) {
      case ERROR_TYPES.NETWORK:
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2zM8 5h2m2 0h4'
            />
          </svg>
        );
      case ERROR_TYPES.PERMISSION:
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
            />
          </svg>
        );
      case ERROR_TYPES.NOT_FOUND:
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        );
      case ERROR_TYPES.VALIDATION:
        return (
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
            />
          </svg>
        );
      default:
        return (
          <svg
            className='w-5 h-5'
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
        );
    }
  };

  const getSeverityClasses = (severity) => {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        return 'error-critical';
      case ERROR_SEVERITY.HIGH:
        return 'error-high';
      case ERROR_SEVERITY.MEDIUM:
        return 'error-medium';
      case ERROR_SEVERITY.LOW:
        return 'error-low';
      default:
        return 'error-medium';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const notificationClasses = [
    'error-notification',
    getSeverityClasses(error.severity),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FadeIn>
      <div className={notificationClasses}>
        <div className='error-content'>
          <div className='error-icon'>{getIconForType(error.type)}</div>

          <div className='error-details'>
            <div className='error-message'>{error.message}</div>

            {error.context && Object.keys(error.context).length > 0 && (
              <div className='error-context'>
                {error.context.requestKey && (
                  <span className='context-tag'>
                    Request: {error.context.requestKey}
                  </span>
                )}
                {error.context.component && (
                  <span className='context-tag'>
                    Component: {error.context.component}
                  </span>
                )}
              </div>
            )}

            <div className='error-meta'>
              <span className='error-timestamp'>
                {formatTimestamp(error.timestamp)}
              </span>
              <span className='error-type-badge'>
                {error.type.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className='error-actions'>
          {onRetry && (
            <InteractiveButton
              size='small'
              variant='ghost'
              onClick={onRetry}
              className='retry-button'
            >
              Retry
            </InteractiveButton>
          )}

          <button
            className='dismiss-button'
            onClick={() => onDismiss(error.id)}
            aria-label='Dismiss error'
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
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      </div>
    </FadeIn>
  );
};

const ErrorNotificationContainer = ({
  position = 'top-right',
  maxErrors = 5,
}) => {
  const { errors, dismissError, clearErrors } = useErrorHandler();

  const visibleErrors = errors
    .filter((error) => !error.dismissed)
    .slice(0, maxErrors);

  if (visibleErrors.length === 0) return null;

  const positionClasses = {
    'top-right': 'error-container-top-right',
    'top-left': 'error-container-top-left',
    'bottom-right': 'error-container-bottom-right',
    'bottom-left': 'error-container-bottom-left',
    'top-center': 'error-container-top-center',
    'bottom-center': 'error-container-bottom-center',
  };

  return (
    <div
      className={`error-notification-container ${positionClasses[position]}`}
    >
      {visibleErrors.length > 3 && (
        <div className='error-overflow-notice'>
          <div className='overflow-content'>
            <span>Multiple errors occurred</span>
            <button onClick={clearErrors} className='clear-all-button'>
              Clear all ({visibleErrors.length})
            </button>
          </div>
        </div>
      )}

      <div className='error-stack'>
        {visibleErrors.map((error) => (
          <ErrorNotification
            key={error.id}
            error={error}
            onDismiss={dismissError}
          />
        ))}
      </div>
    </div>
  );
};

export { ErrorNotification, ErrorNotificationContainer };
export default ErrorNotificationContainer;
