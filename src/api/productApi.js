import { apiMethods } from './api';

/**
 * Product API Service
 * Handles all product-related API calls
 */
class ProductAPI {
  constructor() {
    this.baseEndpoint = '/products';
  }

  /**
   * Get all products with optional filtering, sorting, and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category
   * @param {string} params.search - Search term
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {string} params.sortBy - Sort field (name, price, rating, createdAt)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @param {number} params.minPrice - Minimum price filter
   * @param {number} params.maxPrice - Maximum price filter
   * @param {boolean} params.organic - Filter organic products
   * @param {boolean} params.inStock - Filter in-stock products
   * @param {string} params.location - Filter by farmer location
   * @returns {Promise} API response with products and pagination info
   */
  async getProducts(params = {}) {
    try {
      const response = await apiMethods.get(this.baseEndpoint, {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get a single product by ID
   * @param {number|string} productId - Product ID
   * @returns {Promise} Product details
   */
  async getProductById(productId) {
    try {
      const response = await apiMethods.get(`${this.baseEndpoint}/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get featured/recommended products
   * @param {number} limit - Number of products to fetch (default: 8)
   * @returns {Promise} Featured products
   */
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await apiMethods.get(`${this.baseEndpoint}/featured`, {
        limit,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get products by category
   * @param {string} categorySlug - Category identifier
   * @param {Object} params - Additional query parameters
   * @returns {Promise} Products in category
   */
  async getProductsByCategory(categorySlug, params = {}) {
    try {
      const response = await apiMethods.get(
        `${this.baseEndpoint}/category/${categorySlug}`,
        {
          page: 1,
          limit: 20,
          ...params,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categorySlug}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Search results
   */
  async searchProducts(query, filters = {}) {
    try {
      const response = await apiMethods.get(`${this.baseEndpoint}/search`, {
        q: query,
        page: 1,
        limit: 20,
        ...filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get related products for a given product
   * @param {number|string} productId - Product ID
   * @param {number} limit - Number of related products (default: 6)
   * @returns {Promise} Related products
   */
  async getRelatedProducts(productId, limit = 6) {
    try {
      const response = await apiMethods.get(
        `${this.baseEndpoint}/${productId}/related`,
        { limit }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching related products for ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get product reviews
   * @param {number|string} productId - Product ID
   * @param {Object} params - Query parameters (page, limit, sortBy)
   * @returns {Promise} Product reviews
   */
  async getProductReviews(productId, params = {}) {
    try {
      const response = await apiMethods.get(
        `${this.baseEndpoint}/${productId}/reviews`,
        {
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          ...params,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Add a review for a product
   * @param {number|string} productId - Product ID
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.title - Review title
   * @param {string} reviewData.comment - Review comment
   * @returns {Promise} Created review
   */
  async addProductReview(productId, reviewData) {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/${productId}/reviews`,
        reviewData
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding review for product ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Get product categories
   * @returns {Promise} Product categories
   */
  async getCategories() {
    try {
      const response = await apiMethods.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get products by farmer
   * @param {number|string} farmerId - Farmer ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Farmer's products
   */
  async getProductsByFarmer(farmerId, params = {}) {
    try {
      const response = await apiMethods.get(
        `/farmers/${farmerId}/products`,
        {
          page: 1,
          limit: 20,
          ...params,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for farmer ${farmerId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and provide user-friendly messages
   * @param {Object} error - API error
   * @returns {Object} Formatted error
   */
  handleError(error) {
    const defaultMessage = 'An error occurred while processing your request.';
    
    if (error.type) {
      switch (error.type) {
        case 'NETWORK_ERROR':
          return {
            message: 'Unable to connect to the server. Please check your internet connection.',
            type: 'network',
            retryable: true,
          };
        case 'RATE_LIMIT':
          return {
            message: 'Too many requests. Please wait a moment and try again.',
            type: 'rate_limit',
            retryable: true,
          };
        case 'VALIDATION_ERROR':
          return {
            message: error.message || 'Invalid request parameters.',
            type: 'validation',
            retryable: false,
            details: error.details,
          };
        case 'UNAUTHORIZED':
          return {
            message: 'Please log in to access this feature.',
            type: 'auth',
            retryable: false,
          };
        case 'FORBIDDEN':
          return {
            message: 'You do not have permission to access this resource.',
            type: 'permission',
            retryable: false,
          };
        case 'NOT_FOUND':
          return {
            message: 'The requested product was not found.',
            type: 'not_found',
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
const productAPI = new ProductAPI();
export default productAPI;

// Export individual methods for convenience
export const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getRelatedProducts,
  getProductReviews,
  addProductReview,
  getCategories,
  getProductsByFarmer,
} = productAPI;
