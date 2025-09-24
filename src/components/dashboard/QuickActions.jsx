import React from 'react';

const QuickActions = ({ actions, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="px-6 py-4 border-b border-secondary-200">
        <h3 className="text-lg font-semibold text-secondary-900">Quick Actions</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="p-4 text-left border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                {action.icon && (
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
                    <img src={action.icon} alt="" className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-secondary-900">{action.title}</p>
                  <p className="text-sm text-secondary-600 mt-1">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;