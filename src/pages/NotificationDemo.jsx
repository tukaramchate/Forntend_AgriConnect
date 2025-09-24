import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useNotificationService } from '../services/notifications/NotificationService';
import NotificationPreferences from '../components/notifications/NotificationPreferences';

const NotificationDemo = () => {
  const notifications = useNotifications();
  const notificationService = useNotificationService();

  const demoNotifications = [
    {
      title: 'Success Toast',
      action: () =>
        notifications.showSuccess('This is a success message!', {
          duration: 3000,
        }),
    },
    {
      title: 'Error Toast',
      action: () =>
        notifications.showError('Something went wrong!', {
          title: 'Error',
          actions: [
            { label: 'Retry', onClick: () => console.log('Retry clicked') },
          ],
        }),
    },
    {
      title: 'Warning Toast',
      action: () =>
        notifications.showWarning('This is a warning message!', {
          duration: 4000,
        }),
    },
    {
      title: 'Info Toast',
      action: () =>
        notifications.showInfo("Here's some information for you", {
          duration: 5000,
        }),
    },
    {
      title: 'Persistent Notification',
      action: () =>
        notifications.showInfo('This notification will stay in your inbox', {
          title: 'Persistent Message',
          persistent: true,
          showToast: true,
          actions: [
            {
              label: 'View Details',
              onClick: () => console.log('Details clicked'),
            },
          ],
        }),
    },
    {
      title: 'Order Placed',
      action: () => notificationService.orderPlaced('OD-1234', 890),
    },
    {
      title: 'Order Status Update',
      action: () =>
        notificationService.orderStatusUpdate(
          'OD-1234',
          'shipped',
          'Tomorrow 2PM'
        ),
    },
    {
      title: 'Payment Success',
      action: () => notificationService.paymentSuccess(890, 'Credit Card'),
    },
    {
      title: 'Payment Failed',
      action: () => notificationService.paymentFailed('Insufficient funds'),
    },
    {
      title: 'New Order (Farmer)',
      action: () =>
        notificationService.newOrderReceived('OD-5678', 'John Doe', 650),
    },
    {
      title: 'Low Stock Alert',
      action: () => notificationService.lowStockAlert('Organic Tomatoes', 5),
    },
    {
      title: 'Product Approved',
      action: () => notificationService.productApproved('Fresh Organic Milk'),
    },
    {
      title: 'System Alert',
      action: () =>
        notificationService.systemAlert(
          'Database maintenance scheduled for tonight',
          'warning'
        ),
    },
    {
      title: 'Welcome User',
      action: () => notificationService.welcomeUser('John Doe', true),
    },
    {
      title: 'Network Error',
      action: () => notificationService.networkError(),
    },
    {
      title: 'New Promotion',
      action: () =>
        notificationService.newPromotion('Flash Sale', 'All vegetables', 25),
    },
  ];

  const handleClearAll = () => {
    notifications.clearAll();
  };

  const handlePreferencesSave = (preferences) => {
    console.log('Notification preferences saved:', preferences);
    notifications.showSuccess('Notification preferences updated successfully!');
  };

  return (
    <div className='min-h-screen bg-secondary-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-secondary-900 mb-2'>
            Notification System Demo
          </h1>
          <p className='text-secondary-600'>
            Test all notification types and features
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-sm border p-6 text-center'>
            <h3 className='text-lg font-semibold text-secondary-900 mb-2'>
              Active Toasts
            </h3>
            <p className='text-2xl font-bold text-primary-600'>
              {notifications.toasts.length}
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-sm border p-6 text-center'>
            <h3 className='text-lg font-semibold text-secondary-900 mb-2'>
              In-App Notifications
            </h3>
            <p className='text-2xl font-bold text-info-600'>
              {notifications.inAppNotifications.length}
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-sm border p-6 text-center'>
            <h3 className='text-lg font-semibold text-secondary-900 mb-2'>
              Unread Count
            </h3>
            <p className='text-2xl font-bold text-error-600'>
              {notifications.unreadCount}
            </p>
          </div>
        </div>

        {/* Demo Buttons */}
        <div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-secondary-900'>
              Test Notifications
            </h2>
            <button
              onClick={handleClearAll}
              className='bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors duration-200'
            >
              Clear All
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {demoNotifications.map((demo, index) => (
              <button
                key={index}
                onClick={demo.action}
                className='p-4 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200'
              >
                <h4 className='font-medium text-secondary-900'>{demo.title}</h4>
                <p className='text-sm text-secondary-600 mt-1'>
                  Click to trigger
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Actions */}
        <div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
          <h2 className='text-xl font-semibold text-secondary-900 mb-6'>
            Notification Actions
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button
              onClick={() => notifications.markAllAsRead()}
              className='bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200'
            >
              Mark All as Read
            </button>

            <button
              onClick={() => notifications.clearAll('persistent')}
              className='bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors duration-200'
            >
              Clear Persistent
            </button>

            <button
              onClick={() => {
                // Add multiple notifications quickly
                for (let i = 1; i <= 5; i++) {
                  setTimeout(() => {
                    notifications.showInfo(`Batch notification ${i}`, {
                      duration: 2000 + i * 500,
                    });
                  }, i * 200);
                }
              }}
              className='bg-info-600 text-white px-4 py-2 rounded-lg hover:bg-info-700 transition-colors duration-200'
            >
              Batch Test
            </button>

            <button
              onClick={() => {
                // Test long notification
                notifications.showWarning(
                  'This is a very long notification message that tests how the notification system handles longer text content and word wrapping.',
                  {
                    title: 'Long Message Test',
                    duration: 8000,
                  }
                );
              }}
              className='bg-warning-600 text-white px-4 py-2 rounded-lg hover:bg-warning-700 transition-colors duration-200'
            >
              Long Message
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <h2 className='text-xl font-semibold text-secondary-900 mb-6'>
            Notification Preferences
          </h2>
          <NotificationPreferences
            onSave={handlePreferencesSave}
            initialPreferences={{
              email: { orderUpdates: true, promotions: false },
              push: { orderUpdates: true, deliveryReminders: true },
              inApp: {
                orderUpdates: true,
                promotions: true,
                newProducts: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
