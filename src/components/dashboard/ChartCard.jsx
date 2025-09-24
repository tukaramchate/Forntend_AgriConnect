import React from 'react';

const ChartCard = ({ 
  title, 
  subtitle,
  children, 
  actions,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="px-6 py-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-secondary-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="inline-flex items-center px-3 py-1 border border-secondary-300 text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 transition-colors duration-200"
                >
                  {action.icon && <img src={action.icon} alt="" className="w-4 h-4 mr-1" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;