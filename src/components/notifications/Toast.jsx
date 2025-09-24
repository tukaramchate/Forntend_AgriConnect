import React, { useState, useEffect } from 'react';

const Toast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  actions = [],
  icon
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClose = React.useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose(id);
    }, 300); // Animation duration
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const typeStyles = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: '/src/assets/icons/checkmark-circle.svg',
      iconBg: 'bg-success-100'
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-800',
      icon: '/src/assets/icons/x-circle.svg',
      iconBg: 'bg-error-100'
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: '/src/assets/icons/alert-triangle.svg',
      iconBg: 'bg-warning-100'
    },
    info: {
      container: 'bg-info-50 border-info-200 text-info-800',
      icon: '/src/assets/icons/info-circle.svg',
      iconBg: 'bg-info-100'
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.info;

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 max-w-md w-full
        transform transition-all duration-300 ease-in-out
        ${isRemoving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className={`
        rounded-lg border p-4 shadow-lg
        ${currentStyle.container}
      `}>
        <div className="flex items-start">
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3
            ${currentStyle.iconBg}
          `}>
            <img 
              src={icon || currentStyle.icon} 
              alt="" 
              className="w-4 h-4"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold mb-1">{title}</h4>
            )}
            <p className="text-sm">{message}</p>
            
            {actions.length > 0 && (
              <div className="mt-3 flex space-x-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      if (action.closeOnClick !== false) {
                        handleClose();
                      }
                    }}
                    className={`
                      text-xs font-medium px-3 py-1 rounded-md
                      ${action.variant === 'primary' 
                        ? 'bg-primary-600 text-white hover:bg-primary-700' 
                        : 'bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-300'
                      }
                      transition-colors duration-200
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-3 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
          >
            <img src="/src/assets/icons/x.svg" alt="Close" className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar for timed toasts */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
            <div 
              className="h-full bg-current opacity-30 animate-shrink-width"
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;