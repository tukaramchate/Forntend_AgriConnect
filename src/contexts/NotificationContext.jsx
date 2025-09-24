import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Action types
const ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ'
};

// Initial state
const initialState = {
  toasts: [],
  inAppNotifications: [],
  unreadCount: 0
};

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_NOTIFICATION: {
      const newNotification = {
        ...action.payload,
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        isRead: false
      };

      return {
        ...state,
        toasts: action.payload.showToast !== false 
          ? [...state.toasts, newNotification] 
          : state.toasts,
        inAppNotifications: action.payload.persistent 
          ? [...state.inAppNotifications, newNotification]
          : state.inAppNotifications,
        unreadCount: action.payload.persistent 
          ? state.unreadCount + 1 
          : state.unreadCount
      };
    }

    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload),
        inAppNotifications: state.inAppNotifications.filter(notif => notif.id !== action.payload)
      };

    case ACTIONS.CLEAR_ALL:
      return {
        ...state,
        toasts: [],
        inAppNotifications: action.payload === 'persistent' 
          ? [] 
          : state.inAppNotifications
      };

    case ACTIONS.MARK_AS_READ:
      return {
        ...state,
        inAppNotifications: state.inAppNotifications.map(notif =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        inAppNotifications: state.inAppNotifications.map(notif => ({ ...notif, isRead: true })),
        unreadCount: 0
      };

    default:
      return state;
  }
}

// Context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Helper functions
  const showNotification = useCallback((notification) => {
    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: notification 
    });
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    showNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      ...options
    });
  }, [showNotification]);

  const showError = useCallback((message, options = {}) => {
    showNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      ...options
    });
  }, [showNotification]);

  const showWarning = useCallback((message, options = {}) => {
    showNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      ...options
    });
  }, [showNotification]);

  const showInfo = useCallback((message, options = {}) => {
    showNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      ...options
    });
  }, [showNotification]);

  const removeNotification = useCallback((id) => {
    dispatch({ 
      type: ACTIONS.REMOVE_NOTIFICATION, 
      payload: id 
    });
  }, []);

  const clearAll = useCallback((type = 'all') => {
    dispatch({ 
      type: ACTIONS.CLEAR_ALL, 
      payload: type 
    });
  }, []);

  const markAsRead = useCallback((id) => {
    dispatch({ 
      type: ACTIONS.MARK_AS_READ, 
      payload: id 
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: ACTIONS.MARK_ALL_AS_READ });
  }, []);

  const value = {
    ...state,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Export context for advanced usage
export { NotificationContext };