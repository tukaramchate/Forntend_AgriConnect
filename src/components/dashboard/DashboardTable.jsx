import React from 'react';

const DashboardTable = ({
  title,
  headers,
  data,
  actions,
  emptyMessage = 'No data available',
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className='px-6 py-4 border-b border-secondary-200'>
        <h3 className='text-lg font-semibold text-secondary-900'>{title}</h3>
      </div>

      {data.length === 0 ? (
        <div className='px-6 py-12 text-center'>
          <p className='text-secondary-500'>{emptyMessage}</p>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead className='bg-secondary-50'>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className='px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider'
                  >
                    {header}
                  </th>
                ))}
                {actions && (
                  <th className='px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider'>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-secondary-200'>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className='hover:bg-secondary-50'>
                  {headers.map((header, cellIndex) => (
                    <td
                      key={cellIndex}
                      className='px-6 py-4 whitespace-nowrap text-sm text-secondary-900'
                    >
                      {row[header.toLowerCase().replace(' ', '_')]}
                    </td>
                  ))}
                  {actions && (
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <div className='flex justify-end space-x-2'>
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded ${
                              action.variant === 'danger'
                                ? 'text-error-700 bg-error-100 hover:bg-error-200'
                                : 'text-primary-700 bg-primary-100 hover:bg-primary-200'
                            } transition-colors duration-200`}
                          >
                            {action.icon && (
                              <img
                                src={action.icon}
                                alt=''
                                className='w-3 h-3 mr-1'
                              />
                            )}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;
