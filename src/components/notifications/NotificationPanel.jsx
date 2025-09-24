import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationPanel = ({ isOpen, onClose }) => {
  const {
    inAppNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // all, unread, read

  const filteredNotifications = inAppNotifications.filter((notification) => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      success: '/src/assets/icons/checkmark-circle.svg',
      error: '/src/assets/icons/x-circle.svg',
      warning: '/src/assets/icons/alert-triangle.svg',
      info: '/src/assets/icons/info-circle.svg',
      order: '/src/assets/icons/shopping-cart.svg',
      payment: '/src/assets/icons/credit-card.svg',
      delivery: '/src/assets/icons/truck.svg',
      product: '/src/assets/icons/box.svg',
    };
    return iconMap[type] || iconMap.info;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      success: 'text-success-600',
      error: 'text-error-600',
      warning: 'text-warning-600',
      info: 'text-info-600',
      order: 'text-primary-600',
      payment: 'text-secondary-600',
      delivery: 'text-info-600',
      product: 'text-secondary-600',
    };
    return colorMap[type] || colorMap.info;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-40'
        onClick={onClose}
      />

      {/* Panel */}
      <div className='fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-secondary-200'>
          <div>
            <h2 className='text-lg font-semibold text-secondary-900'>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className='text-sm text-secondary-600'>{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200'
          >
            <img
              src='/src/assets/icons/x.svg'
              alt='Close'
              className='w-5 h-5'
            />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className='flex border-b border-secondary-200'>
          {[
            { id: 'all', label: 'All', count: inAppNotifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            {
              id: 'read',
              label: 'Read',
              count: inAppNotifications.length - unreadCount,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                filter === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-secondary-100 text-secondary-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className='p-4 border-b border-secondary-200'>
            <button
              onClick={markAllAsRead}
              className='text-sm text-primary-600 hover:text-primary-700 font-medium'
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className='flex-1 overflow-y-auto'>
          {filteredNotifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-secondary-500'>
              <img
                src='/src/assets/icons/bell.svg'
                alt=''
                className='w-12 h-12 opacity-50 mb-4'
              />
              <p className='text-sm'>No notifications</p>
            </div>
          ) : (
            <div className='space-y-1'>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-secondary-100 hover:bg-secondary-50 transition-colors duration-200 ${
                    !notification.isRead ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className='flex items-start space-x-3'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        !notification.isRead
                          ? 'bg-primary-100'
                          : 'bg-secondary-100'
                      }`}
                    >
                      <img
                        src={getNotificationIcon(notification.type)}
                        alt=''
                        className={`w-4 h-4 ${getNotificationColor(notification.type)}`}
                      />
                    </div>

                    <div className='flex-1 min-w-0'>
                      {notification.title && (
                        <h4 className='text-sm font-medium text-secondary-900 mb-1'>
                          {notification.title}
                        </h4>
                      )}
                      <p className='text-sm text-secondary-700 mb-2'>
                        {notification.message}
                      </p>
                      <p className='text-xs text-secondary-500'>
                        {formatTime(notification.timestamp)}
                      </p>

                      {notification.actions &&
                        notification.actions.length > 0 && (
                          <div className='mt-3 flex space-x-2'>
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  action.onClick();
                                  if (!notification.isRead) {
                                    markAsRead(notification.id);
                                  }
                                }}
                                className='text-xs text-primary-600 hover:text-primary-700 font-medium'
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>

                    <div className='flex items-center space-x-2'>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className='w-2 h-2 bg-primary-600 rounded-full'
                          title='Mark as read'
                        />
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className='p-1 hover:bg-secondary-200 rounded transition-colors duration-200'
                        title='Remove notification'
                      >
                        <img
                          src='/src/assets/icons/x.svg'
                          alt='Remove'
                          className='w-3 h-3'
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
