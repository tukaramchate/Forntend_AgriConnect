import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, removeNotification } = useNotifications();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            onClose={removeNotification}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;