import React, { useState } from 'react';

const NotificationPreferences = ({ onSave, initialPreferences = {} }) => {
  const [preferences, setPreferences] = useState({
    email: {
      orderUpdates: true,
      promotions: true,
      newProducts: false,
      weeklyDigest: true,
      securityAlerts: true,
      ...initialPreferences.email,
    },
    push: {
      orderUpdates: true,
      promotions: false,
      newProducts: false,
      deliveryReminders: true,
      securityAlerts: true,
      ...initialPreferences.push,
    },
    inApp: {
      orderUpdates: true,
      promotions: true,
      newProducts: true,
      systemAlerts: true,
      farmerMessages: true,
      ...initialPreferences.inApp,
    },
  });

  const handleToggle = (category, setting) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(preferences);
    }
  };

  const PreferenceSection = ({ title, category, settings }) => (
    <div className='bg-white rounded-lg border border-secondary-200 p-6'>
      <h3 className='text-lg font-semibold text-secondary-900 mb-4'>{title}</h3>
      <div className='space-y-4'>
        {Object.entries(settings).map(([key, config]) => (
          <div key={key} className='flex items-center justify-between'>
            <div>
              <label className='text-sm font-medium text-secondary-900'>
                {config.label}
              </label>
              <p className='text-sm text-secondary-600 mt-1'>
                {config.description}
              </p>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={preferences[category][key]}
                onChange={() => handleToggle(category, key)}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const notificationSettings = {
    email: {
      orderUpdates: {
        label: 'Order Updates',
        description: 'Receive updates about your order status and delivery',
      },
      promotions: {
        label: 'Promotions & Offers',
        description: 'Get notified about special deals and discounts',
      },
      newProducts: {
        label: 'New Products',
        description:
          'Be the first to know about new products from your favorite farmers',
      },
      weeklyDigest: {
        label: 'Weekly Digest',
        description: 'Weekly summary of activity and recommendations',
      },
      securityAlerts: {
        label: 'Security Alerts',
        description: 'Important security notifications and account changes',
      },
    },
    push: {
      orderUpdates: {
        label: 'Order Updates',
        description: 'Push notifications for order status changes',
      },
      promotions: {
        label: 'Promotions',
        description: 'Promotional push notifications',
      },
      newProducts: {
        label: 'New Products',
        description: 'Notifications when farmers add new products',
      },
      deliveryReminders: {
        label: 'Delivery Reminders',
        description: 'Reminders about upcoming deliveries',
      },
      securityAlerts: {
        label: 'Security Alerts',
        description: 'Critical security notifications',
      },
    },
    inApp: {
      orderUpdates: {
        label: 'Order Updates',
        description: 'In-app notifications for order changes',
      },
      promotions: {
        label: 'Promotions',
        description: 'Promotional banners and offers',
      },
      newProducts: {
        label: 'New Products',
        description: 'Notifications about new product listings',
      },
      systemAlerts: {
        label: 'System Alerts',
        description: 'Important system maintenance and updates',
      },
      farmerMessages: {
        label: 'Farmer Messages',
        description: 'Direct messages from farmers',
      },
    },
  };

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-8'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-secondary-900 mb-2'>
          Notification Preferences
        </h2>
        <p className='text-secondary-600'>
          Customize how and when you receive notifications
        </p>
      </div>

      <div className='space-y-6'>
        <PreferenceSection
          title='📧 Email Notifications'
          category='email'
          settings={notificationSettings.email}
        />

        <PreferenceSection
          title='📱 Push Notifications'
          category='push'
          settings={notificationSettings.push}
        />

        <PreferenceSection
          title='🔔 In-App Notifications'
          category='inApp'
          settings={notificationSettings.inApp}
        />
      </div>

      {/* Save Button */}
      <div className='flex justify-center pt-6'>
        <button
          onClick={handleSave}
          className='bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium'
        >
          Save Preferences
        </button>
      </div>

      {/* Notification Timing */}
      <div className='bg-secondary-50 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-secondary-900 mb-4'>
          🕐 Quiet Hours
        </h3>
        <p className='text-sm text-secondary-600 mb-4'>
          Set times when you don't want to receive non-urgent notifications
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-secondary-700 mb-2'>
              Start Time
            </label>
            <input
              type='time'
              className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              defaultValue='22:00'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-secondary-700 mb-2'>
              End Time
            </label>
            <input
              type='time'
              className='w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              defaultValue='08:00'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
