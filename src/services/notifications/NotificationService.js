// Notification Service - Pre-configured notification patterns for common use cases
import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

export class NotificationService {
  constructor(notificationContext) {
    this.notifications = notificationContext;
  }

  // Order-related notifications
  orderPlaced(orderNumber, amount) {
    this.notifications.showSuccess(
      `Order #${orderNumber} placed successfully for ₹${amount}!`,
      {
        title: 'Order Confirmed',
        persistent: true,
        actions: [
          {
            label: 'Track Order',
            onClick: () => (window.location.href = `/orders/${orderNumber}`),
          },
        ],
      }
    );
  }

  orderStatusUpdate(orderNumber, status, estimatedDelivery = null) {
    const statusMessages = {
      processing: 'Your order is being processed',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
    };

    const type =
      status === 'cancelled'
        ? 'error'
        : status === 'delivered'
          ? 'success'
          : 'info';

    this.notifications.showNotification({
      type,
      title: `Order #${orderNumber} ${status}`,
      message:
        statusMessages[status] +
        (estimatedDelivery
          ? ` - Estimated delivery: ${estimatedDelivery}`
          : ''),
      persistent: true,
      actions: [
        {
          label: 'View Details',
          onClick: () => (window.location.href = `/orders/${orderNumber}`),
        },
      ],
    });
  }

  paymentSuccess(amount, method) {
    this.notifications.showSuccess(
      `Payment of ₹${amount} processed successfully via ${method}`,
      {
        title: 'Payment Confirmed',
        duration: 4000,
      }
    );
  }

  paymentFailed(reason = 'Payment processing failed') {
    this.notifications.showError(reason, {
      title: 'Payment Failed',
      persistent: true,
      actions: [
        {
          label: 'Retry Payment',
          onClick: () => window.location.reload(),
        },
        {
          label: 'Contact Support',
          onClick: () => (window.location.href = '/support'),
        },
      ],
    });
  }

  // Farmer-specific notifications
  newOrderReceived(orderNumber, customerName, amount) {
    this.notifications.showInfo(
      `New order from ${customerName} for ₹${amount}`,
      {
        title: 'New Order Received',
        persistent: true,
        actions: [
          {
            label: 'View Order',
            onClick: () =>
              (window.location.href = `/farmer/orders/${orderNumber}`),
          },
        ],
      }
    );
  }

  lowStockAlert(productName, currentStock) {
    this.notifications.showWarning(
      `${productName} is running low (${currentStock} remaining)`,
      {
        title: 'Low Stock Alert',
        persistent: true,
        actions: [
          {
            label: 'Update Stock',
            onClick: () => (window.location.href = '/farmer/inventory'),
          },
        ],
      }
    );
  }

  productApproved(productName) {
    this.notifications.showSuccess(
      `Your product "${productName}" has been approved and is now live!`,
      {
        title: 'Product Approved',
        persistent: true,
        actions: [
          {
            label: 'View Product',
            onClick: () => (window.location.href = '/farmer/products'),
          },
        ],
      }
    );
  }

  // Admin notifications
  newFarmerRegistration(farmerName, location) {
    this.notifications.showInfo(
      `New farmer registration: ${farmerName} from ${location}`,
      {
        title: 'New Farmer Registration',
        persistent: true,
        actions: [
          {
            label: 'Review Application',
            onClick: () => (window.location.href = '/admin/farmers'),
          },
        ],
      }
    );
  }

  systemAlert(message, severity = 'warning') {
    this.notifications.showNotification({
      type: severity,
      title: 'System Alert',
      message,
      persistent: true,
      duration: 0, // Don't auto-dismiss system alerts
      actions: [
        {
          label: 'View Details',
          onClick: () => (window.location.href = '/admin/system'),
        },
      ],
    });
  }

  // Generic notifications
  welcomeUser(userName, isFirstTime = false) {
    if (isFirstTime) {
      this.notifications.showSuccess(
        `Welcome to AgriConnect, ${userName}! Let's get you started.`,
        {
          title: 'Welcome!',
          duration: 6000,
          actions: [
            {
              label: 'Take Tour',
              onClick: () => this.startOnboardingTour(),
            },
          ],
        }
      );
    } else {
      this.notifications.showInfo(`Welcome back, ${userName}!`, {
        duration: 3000,
      });
    }
  }

  profileUpdated() {
    this.notifications.showSuccess(
      'Your profile has been updated successfully',
      {
        duration: 3000,
      }
    );
  }

  networkError() {
    this.notifications.showError(
      'Network connection issue. Please check your internet connection.',
      {
        title: 'Connection Error',
        persistent: true,
        actions: [
          {
            label: 'Retry',
            onClick: () => window.location.reload(),
          },
        ],
      }
    );
  }

  maintenanceNotice(startTime, duration) {
    this.notifications.showWarning(
      `Scheduled maintenance from ${startTime} (${duration}). Some features may be unavailable.`,
      {
        title: 'Maintenance Notice',
        persistent: true,
        duration: 0,
      }
    );
  }

  // Promotional notifications
  newPromotion(title, description, discountPercent) {
    this.notifications.showInfo(`${discountPercent}% off! ${description}`, {
      title: `🎉 ${title}`,
      persistent: true,
      actions: [
        {
          label: 'Shop Now',
          onClick: () => (window.location.href = '/products?promo=active'),
        },
      ],
    });
  }

  // Helper method to start onboarding tour (placeholder)
  startOnboardingTour() {
    console.log('Starting onboarding tour...');
    // This would integrate with an onboarding library
  }
}

// Factory function to create service instance
export const createNotificationService = (notificationContext) => {
  return new NotificationService(notificationContext);
};

// Hook to use notification service
export const useNotificationService = () => {
  const notifications = useNotifications();
  return React.useMemo(
    () => createNotificationService(notifications),
    [notifications]
  );
};
