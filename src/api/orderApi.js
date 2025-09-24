import { apiMethods } from './api';

/**
 * Order API Service
 * Handles all order-related API calls
 */
class OrderAPI {
  constructor() {
    this.baseEndpoint = '/orders';
  }

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @param {Array} orderData.items - Order items
   * @param {Object} orderData.shippingAddress - Shipping address
   * @param {Object} orderData.billingAddress - Billing address (optional)
   * @param {string} orderData.paymentMethod - Payment method
   * @param {string} orderData.notes - Order notes (optional)
   * @returns {Promise} Created order
   */
  async createOrder(orderData) {
    try {
      const response = await apiMethods.post(this.baseEndpoint, {
        items: orderData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes?.trim(),
        })),
        shippingAddress: {
          street: orderData.shippingAddress.street.trim(),
          city: orderData.shippingAddress.city.trim(),
          state: orderData.shippingAddress.state.trim(),
          zipCode: orderData.shippingAddress.zipCode.trim(),
          country: orderData.shippingAddress.country.trim(),
        },
        billingAddress: orderData.billingAddress
          ? {
              street: orderData.billingAddress.street.trim(),
              city: orderData.billingAddress.city.trim(),
              state: orderData.billingAddress.state.trim(),
              zipCode: orderData.billingAddress.zipCode.trim(),
              country: orderData.billingAddress.country.trim(),
            }
          : null,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes?.trim(),
      });

      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user orders
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Order status filter
   * @param {Date} filters.startDate - Start date filter
   * @param {Date} filters.endDate - End date filter
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.sort - Sort order
   * @returns {Promise} Orders list
   */
  async getUserOrders(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.startDate) {
        params.append('start_date', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params.append('end_date', filters.endDate.toISOString());
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${this.baseEndpoint}?${queryString}`
        : this.baseEndpoint;

      const response = await apiMethods.get(url);
      return response.data;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get order by ID
   * @param {string|number} orderId - Order ID
   * @returns {Promise} Order details
   */
  async getOrderById(orderId) {
    try {
      const response = await apiMethods.get(`${this.baseEndpoint}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update order status (Admin/Farmer only)
   * @param {string|number} orderId - Order ID
   * @param {string} status - New status
   * @param {string} notes - Status update notes (optional)
   * @returns {Promise} Updated order
   */
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await apiMethods.put(
        `${this.baseEndpoint}/${orderId}/status`,
        {
          status,
          notes: notes.trim(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel order
   * @param {string|number} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Cancellation response
   */
  async cancelOrder(orderId, reason) {
    try {
      const response = await apiMethods.put(
        `${this.baseEndpoint}/${orderId}/cancel`,
        {
          reason: reason.trim(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get order tracking information
   * @param {string|number} orderId - Order ID
   * @returns {Promise} Tracking information
   */
  async getOrderTracking(orderId) {
    try {
      const response = await apiMethods.get(
        `${this.baseEndpoint}/${orderId}/tracking`
      );
      return response.data;
    } catch (error) {
      console.error('Get order tracking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Add tracking information (Admin/Farmer only)
   * @param {string|number} orderId - Order ID
   * @param {Object} trackingData - Tracking data
   * @param {string} trackingData.carrier - Shipping carrier
   * @param {string} trackingData.trackingNumber - Tracking number
   * @param {string} trackingData.estimatedDelivery - Estimated delivery date
   * @returns {Promise} Tracking response
   */
  async addOrderTracking(orderId, trackingData) {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/${orderId}/tracking`,
        {
          carrier: trackingData.carrier.trim(),
          trackingNumber: trackingData.trackingNumber.trim(),
          estimatedDelivery: trackingData.estimatedDelivery,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Add order tracking error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get order invoice
   * @param {string|number} orderId - Order ID
   * @returns {Promise} Invoice data
   */
  async getOrderInvoice(orderId) {
    try {
      const response = await apiMethods.get(
        `${this.baseEndpoint}/${orderId}/invoice`
      );
      return response.data;
    } catch (error) {
      console.error('Get order invoice error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Request order refund
   * @param {string|number} orderId - Order ID
   * @param {Object} refundData - Refund request data
   * @param {Array} refundData.items - Items to refund
   * @param {string} refundData.reason - Refund reason
   * @param {string} refundData.description - Detailed description
   * @returns {Promise} Refund request response
   */
  async requestRefund(orderId, refundData) {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/${orderId}/refund`,
        {
          items: refundData.items.map((item) => ({
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            reason: item.reason?.trim(),
          })),
          reason: refundData.reason,
          description: refundData.description?.trim(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Request refund error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Rate order and products
   * @param {string|number} orderId - Order ID
   * @param {Object} ratingData - Rating data
   * @param {number} ratingData.overallRating - Overall order rating (1-5)
   * @param {Array} ratingData.productRatings - Individual product ratings
   * @param {string} ratingData.review - Written review (optional)
   * @returns {Promise} Rating response
   */
  async rateOrder(orderId, ratingData) {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/${orderId}/rating`,
        {
          overallRating: ratingData.overallRating,
          productRatings: ratingData.productRatings.map((rating) => ({
            productId: rating.productId,
            rating: rating.rating,
            review: rating.review?.trim(),
          })),
          review: ratingData.review?.trim(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Rate order error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get order statistics (Admin only)
   * @param {Object} filters - Filter options
   * @param {Date} filters.startDate - Start date
   * @param {Date} filters.endDate - End date
   * @param {string} filters.groupBy - Group by (day, week, month)
   * @returns {Promise} Order statistics
   */
  async getOrderStats(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) {
        params.append('start_date', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        params.append('end_date', filters.endDate.toISOString());
      }
      if (filters.groupBy) {
        params.append('group_by', filters.groupBy);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${this.baseEndpoint}/stats?${queryString}`
        : `${this.baseEndpoint}/stats`;

      const response = await apiMethods.get(url);
      return response.data;
    } catch (error) {
      console.error('Get order stats error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get farmer orders (Farmer dashboard)
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Order status filter
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise} Farmer orders
   */
  async getFarmerOrders(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${this.baseEndpoint}/farmer?${queryString}`
        : `${this.baseEndpoint}/farmer`;

      const response = await apiMethods.get(url);
      return response.data;
    } catch (error) {
      console.error('Get farmer orders error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and provide user-friendly messages
   * @param {Object} error - API error
   * @returns {Object} Formatted error
   */
  handleError(error) {
    const defaultMessage = 'An error occurred while processing your order.';

    if (error.type) {
      switch (error.type) {
        case 'NETWORK_ERROR':
          return {
            message:
              'Unable to connect to the server. Please check your internet connection.',
            type: 'network',
            retryable: true,
          };
        case 'NOT_FOUND':
          return {
            message: 'Order not found.',
            type: 'not_found',
            retryable: false,
          };
        case 'VALIDATION_ERROR':
          return {
            message: error.message || 'Invalid order data.',
            type: 'validation',
            retryable: false,
            details: error.details,
          };
        case 'UNAUTHORIZED':
          return {
            message: 'You are not authorized to access this order.',
            type: 'auth',
            retryable: false,
          };
        case 'FORBIDDEN':
          return {
            message: 'You do not have permission to modify this order.',
            type: 'forbidden',
            retryable: false,
          };
        case 'CONFLICT':
          return {
            message: 'Order cannot be modified in its current state.',
            type: 'conflict',
            retryable: false,
          };
        case 'PAYMENT_ERROR':
          return {
            message:
              'Payment processing failed. Please try again or use a different payment method.',
            type: 'payment',
            retryable: true,
          };
        case 'INVENTORY_ERROR':
          return {
            message: 'Some items in your order are no longer available.',
            type: 'inventory',
            retryable: false,
          };
        case 'SERVER_ERROR':
          return {
            message: 'Server error. Please try again later.',
            type: 'server',
            retryable: true,
          };
        default:
          return {
            message: error.message || defaultMessage,
            type: 'unknown',
            retryable: true,
          };
      }
    }

    return {
      message: error.message || defaultMessage,
      type: 'unknown',
      retryable: true,
    };
  }
}

// Create and export singleton instance
const orderAPI = new OrderAPI();
export default orderAPI;

// Export individual methods for convenience
export const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderTracking,
  addOrderTracking,
  getOrderInvoice,
  requestRefund,
  rateOrder,
  getOrderStats,
  getFarmerOrders,
} = orderAPI;
