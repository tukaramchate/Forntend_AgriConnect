import React, { useState, useEffect } from 'react';
import FadeIn from '../animations/FadeIn';
import InteractiveButton from '../interactions/InteractiveButton';
import { TOAST_TYPES } from '../../constants/toastTypes';
import './FeedbackSystem.css';

// Individual Toast Component
const Toast = ({
  id,
  type = TOAST_TYPES.INFO,
  title,
  message,
  duration = 5000,
  closable = true,
  action,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0 && type !== TOAST_TYPES.LOADING) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100);
          return Math.max(0, newProgress);
        });
      }, 100);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300);
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    }
  }, [duration, id, onClose, type]);

  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
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
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      case TOAST_TYPES.ERROR:
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
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      case TOAST_TYPES.WARNING:
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
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      case TOAST_TYPES.LOADING:
        return (
          <div className='loading-spinner'>
            <svg
              className='w-5 h-5 animate-spin'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          </div>
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
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
    }
  };

  const toastClasses = [
    'toast',
    `toast-${type}`,
    isVisible ? 'toast-visible' : 'toast-hidden',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={toastClasses}>
      <div className='toast-content'>
        <div className='toast-icon'>{getIcon()}</div>

        <div className='toast-body'>
          {title && <div className='toast-title'>{title}</div>}
          {message && <div className='toast-message'>{message}</div>}
        </div>

        {action && (
          <div className='toast-action'>
            <InteractiveButton
              size='small'
              variant='ghost'
              onClick={action.onClick}
            >
              {action.label}
            </InteractiveButton>
          </div>
        )}

        {closable && (
          <button
            className='toast-close'
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(id), 300);
            }}
            aria-label='Close notification'
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
        )}
      </div>

      {duration > 0 && type !== TOAST_TYPES.LOADING && (
        <div className='toast-progress'>
          <div
            className='toast-progress-bar'
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Toast Container
const ToastContainer = ({ toasts, onRemoveToast, position = 'top-right' }) => {
  const positionClasses = {
    'top-right': 'toast-container-top-right',
    'top-left': 'toast-container-top-left',
    'top-center': 'toast-container-top-center',
    'bottom-right': 'toast-container-bottom-right',
    'bottom-left': 'toast-container-bottom-left',
    'bottom-center': 'toast-container-bottom-center',
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={`toast-container ${positionClasses[position]}`}>
      {toasts.map((toast) => (
        <FadeIn key={toast.id}>
          <Toast {...toast} onClose={onRemoveToast} />
        </FadeIn>
      ))}
    </div>
  );
};

// Banner notification for important system-wide messages
const Banner = ({
  type = 'info',
  title,
  message,
  action,
  closable = true,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const bannerClasses = ['banner', `banner-${type}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <FadeIn>
      <div className={bannerClasses}>
        <div className='banner-content'>
          <div className='banner-icon'>
            {type === 'warning' && (
              <svg
                className='w-6 h-6'
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
            )}
            {type === 'info' && (
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            )}
            {type === 'success' && (
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            )}
            {type === 'error' && (
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            )}
          </div>

          <div className='banner-body'>
            {title && <div className='banner-title'>{title}</div>}
            {message && <div className='banner-message'>{message}</div>}
          </div>

          {action && (
            <div className='banner-action'>
              <InteractiveButton
                size='small'
                variant={type === 'error' ? 'danger' : 'primary'}
                onClick={action.onClick}
              >
                {action.label}
              </InteractiveButton>
            </div>
          )}

          {closable && (
            <button
              className='banner-close'
              onClick={handleClose}
              aria-label='Close banner'
            >
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

// Status indicator for showing current state
const StatusIndicator = ({
  status = 'idle',
  message,
  showIcon = true,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: (
            <svg
              className='w-4 h-4 animate-spin'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          ),
          className: 'status-loading',
        };
      case 'success':
        return {
          icon: (
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
                d='M5 13l4 4L19 7'
              />
            </svg>
          ),
          className: 'status-success',
        };
      case 'error':
        return {
          icon: (
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
          ),
          className: 'status-error',
        };
      case 'warning':
        return {
          icon: (
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
                d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          ),
          className: 'status-warning',
        };
      default:
        return {
          icon: null,
          className: 'status-idle',
        };
    }
  };

  const config = getStatusConfig();
  const statusClasses = ['status-indicator', config.className, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={statusClasses}>
      {showIcon && config.icon && (
        <div className='status-icon'>{config.icon}</div>
      )}
      {message && <div className='status-message'>{message}</div>}
    </div>
  );
};

export { Toast, ToastContainer, Banner, StatusIndicator };
export default ToastContainer;
