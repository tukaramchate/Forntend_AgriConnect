import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  trend, 
  subtitle,
  onClick 
}) => {
  const changeColor = {
    positive: 'text-success-600',
    negative: 'text-error-600',
    neutral: 'text-secondary-500'
  }[changeType];

  const bgColor = {
    positive: 'bg-success-50',
    negative: 'bg-error-50',
    neutral: 'bg-secondary-50'
  }[changeType];

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <img src={icon} alt="" className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>
      
      {(change || trend) && (
        <div className="mt-4 flex items-center space-x-2">
          {change && (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${changeColor}`}>
              {changeType === 'positive' && <span className="mr-1">↗</span>}
              {changeType === 'negative' && <span className="mr-1">↘</span>}
              {change}
            </div>
          )}
          {trend && (
            <span className="text-xs text-secondary-500">{trend}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;