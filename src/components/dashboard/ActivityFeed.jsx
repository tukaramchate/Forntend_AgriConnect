import React from 'react';

const ActivityFeed = ({ activities, className = "" }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      order: '/src/assets/icons/shopping-cart.svg',
      product: '/src/assets/icons/box.svg',
      user: '/src/assets/icons/user.svg',
      payment: '/src/assets/icons/credit-card.svg',
      delivery: '/src/assets/icons/truck.svg',
      review: '/src/assets/icons/star.svg',
      alert: '/src/assets/icons/bell.svg'
    };
    return iconMap[type] || '/src/assets/icons/bell.svg';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      order: 'bg-primary-100 text-primary-600',
      product: 'bg-secondary-100 text-secondary-600',
      user: 'bg-success-100 text-success-600',
      payment: 'bg-warning-100 text-warning-600',
      delivery: 'bg-info-100 text-info-600',
      review: 'bg-warning-100 text-warning-600',
      alert: 'bg-error-100 text-error-600'
    };
    return colorMap[type] || 'bg-secondary-100 text-secondary-600';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="px-6 py-4 border-b border-secondary-200">
        <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
      </div>
      
      <div className="p-6">
        {activities.length === 0 ? (
          <p className="text-secondary-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <img src={getActivityIcon(activity.type)} alt="" className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-secondary-900">
                    <span className="font-medium">{activity.title}</span>
                  </p>
                  <p className="text-sm text-secondary-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-secondary-500 mt-1">{formatTime(activity.timestamp)}</p>
                </div>
                {activity.action && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={activity.action.onClick}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                    >
                      {activity.action.label}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;