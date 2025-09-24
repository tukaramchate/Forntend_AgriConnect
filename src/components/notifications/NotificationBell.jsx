import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';

const NotificationBell = ({ className = '' }) => {
  const { unreadCount } = useNotifications();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleTogglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={handleTogglePanel}
          className={`
            relative p-2 rounded-lg transition-all duration-200
            ${
              isPanelOpen
                ? 'bg-primary-100 text-primary-600'
                : 'hover:bg-secondary-100 text-secondary-600 hover:text-secondary-900'
            }
          `}
          title='Notifications'
        >
          <img
            src='/src/assets/icons/bell.svg'
            alt='Notifications'
            className='w-5 h-5'
          />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-error-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-pulse'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {/* Pulse animation for new notifications */}
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-error-500 rounded-full h-5 w-5 animate-ping opacity-75'></span>
          )}
        </button>
      </div>

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  );
};

export default NotificationBell;
