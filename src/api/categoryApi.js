import { apiMethods } from './api';

/**
 * Category API Service
 * Handles all category-related API calls
 */
class CategoryAPI {
  constructor() {
    this.baseEndpoint = '/categories';
  }

  /**
   * Get all categories with optional filters
   * @param {Object} filters - Filter options
   * @param {boolean} filters.includeSubcategories - Include subcategories
   * @param {boolean} filters.activeOnly - Only active categories
   * @param {string} filters.sort - Sort order (name, created_date, product_count)
   * @returns {Promise} Categories list
   */
  async getCategories(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.includeSubcategories !== undefined) {
        params.append('include_subcategories', filters.includeSubcategories);
      }
      if (filters.activeOnly) {
        params.append('active_only', 'true');
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }

      const queryString = params.toString();
      const url = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;
      
      const response = await apiMethods.get(url);
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get category by ID
   * @param {string|number} categoryId - Category ID
   * @param {Object} options - Additional options
   * @param {boolean} options.includeProducts - Include products in category
   * @param {number} options.limit - Limit number of products
   * @returns {Promise} Category details
   */
  async getCategoryById(categoryId, options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.includeProducts) {
        params.append('include_products', 'true');
      }
      if (options.limit) {
        params.append('limit', options.limit);
      }

      const queryString = params.toString();
      const url = queryString 
        ? `${this.baseEndpoint}/${categoryId}?${queryString}` 
        : `${this.baseEndpoint}/${categoryId}`;
      
      const response = await apiMethods.get(url);
      return response.data;
    } catch (error) {
      console.error('Get category by ID error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get category hierarchy (parent-child relationships)
   * @returns {Promise} Category hierarchy
   */
  async getCategoryHierarchy() {
    try {
      const response = await apiMethods.get(`${this.baseEndpoint}/hierarchy`);
      return response.data;
    } catch (error) {
      console.error('Get category hierarchy error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get popular categories based on product count or sales
   * @param {Object} options - Options
   * @param {number} options.limit - Number of categories to return
   * @param {string} options.sortBy - Sort by (product_count, sales, views)
   * @returns {Promise} Popular categories
   */
  async getPopularCategories(options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) {
        params.append('limit', options.limit);
      }
      if (options.sortBy) {
        params.append('sort_by', options.sortBy);
      }

      const queryString = params.toString();
      const url = queryString 
        ? `${this.baseEndpoint}/popular?${queryString}` 
        : `${this.baseEndpoint}/popular`;
      
      const response = await apiMethods.get(url);
      return response.data;
    } catch (error) {
      console.error('Get popular categories error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Search categories by name or description
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {number} options.limit - Limit results
   * @param {boolean} options.includeInactive - Include inactive categories
   * @returns {Promise} Search results
   */
  async searchCategories(query, options = {}) {
    try {
      const params = new URLSearchParams();
      params.append('q', query.trim());
      
      if (options.limit) {
        params.append('limit', options.limit);
      }
      if (options.includeInactive) {
        params.append('include_inactive', 'true');
      }

      const response = await apiMethods.get(`${this.baseEndpoint}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search categories error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get subcategories for a parent category
   * @param {string|number} parentId - Parent category ID
   * @param {Object} options - Options
   * @param {boolean} options.activeOnly - Only active subcategories
   * @returns {Promise} Subcategories list
   */
  async getSubcategories(parentId, options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.activeOnly) {
        params.append('active_only', 'true');
      }

      const queryString = params.toString();
      const url = queryString 
        ? `${this.baseEndpoint}/${parentId}/subcategories?${queryString}` 
        : `${this.baseEndpoint}/${parentId}/subcategories`;
      
      const response = await apiMethods.get(url);
      return response.data;
    } catch (error) {
      console.error('Get subcategories error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create new category (Admin only)
   * @param {Object} categoryData - Category data
   * @param {string} categoryData.name - Category name
   * @param {string} categoryData.description - Category description
   * @param {string} categoryData.parentId - Parent category ID (optional)
   * @param {string} categoryData.image - Category image URL
   * @param {boolean} categoryData.isActive - Category status
   * @returns {Promise} Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await apiMethods.post(this.baseEndpoint, {
        name: categoryData.name.trim(),
        description: categoryData.description?.trim(),
        parentId: categoryData.parentId,
        image: categoryData.image,
        isActive: categoryData.isActive !== false, // Default to true
      });

      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update category (Admin only)
   * @param {string|number} categoryId - Category ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated category
   */
  async updateCategory(categoryId, updateData) {
    try {
      const response = await apiMethods.put(`${this.baseEndpoint}/${categoryId}`, {
        name: updateData.name?.trim(),
        description: updateData.description?.trim(),
        parentId: updateData.parentId,
        image: updateData.image,
        isActive: updateData.isActive,
      });

      return response.data;
    } catch (error) {
      console.error('Update category error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete category (Admin only)
   * @param {string|number} categoryId - Category ID
   * @param {Object} options - Delete options
   * @param {boolean} options.force - Force delete even with products
   * @returns {Promise} Delete response
   */
  async deleteCategory(categoryId, options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.force) {
        params.append('force', 'true');
      }

      const queryString = params.toString();
      const url = queryString 
        ? `${this.baseEndpoint}/${categoryId}?${queryString}` 
        : `${this.baseEndpoint}/${categoryId}`;
      
      const response = await apiMethods.delete(url);
      return response.data;
    } catch (error) {
      console.error('Delete category error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get category statistics (Admin only)
   * @param {string|number} categoryId - Category ID
   * @returns {Promise} Category statistics
   */
  async getCategoryStats(categoryId) {
    try {
      const response = await apiMethods.get(`${this.baseEndpoint}/${categoryId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get category stats error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and provide user-friendly messages
   * @param {Object} error - API error
   * @returns {Object} Formatted error
   */
  handleError(error) {
    const defaultMessage = 'An error occurred while processing categories.';
    
    if (error.type) {
      switch (error.type) {
        case 'NETWORK_ERROR':
          return {
            message: 'Unable to connect to the server. Please check your internet connection.',
            type: 'network',
            retryable: true,
          };
        case 'NOT_FOUND':
          return {
            message: 'Category not found.',
            type: 'not_found',
            retryable: false,
          };
        case 'VALIDATION_ERROR':
          return {
            message: error.message || 'Invalid category data.',
            type: 'validation',
            retryable: false,
            details: error.details,
          };
        case 'UNAUTHORIZED':
          return {
            message: 'You are not authorized to perform this action.',
            type: 'auth',
            retryable: false,
          };
        case 'FORBIDDEN':
          return {
            message: 'You do not have permission to access this category.',
            type: 'forbidden',
            retryable: false,
          };
        case 'CONFLICT':
          return {
            message: 'Category name already exists.',
            type: 'conflict',
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
const categoryAPI = new CategoryAPI();
export default categoryAPI;

// Export individual methods for convenience
export const {
  getCategories,
  getCategoryById,
  getCategoryHierarchy,
  getPopularCategories,
  searchCategories,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} = categoryAPI;