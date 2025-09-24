import { apiMethods, authUtils } from './api';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
class AuthAPI {
  constructor() {
    this.baseEndpoint = '/auth';
    this.userEndpoint = '/users';
  }

  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Remember user session
   * @returns {Promise} Authentication response with user data and token
   */
  async login(credentials) {
    try {
      const response = await apiMethods.post(`${this.baseEndpoint}/login`, {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });

      const { user, token, refreshToken } = response.data;

      // Store authentication data
      authUtils.setAuthToken(token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * User registration
   * @param {Object} userData - Registration data
   * @param {string} userData.firstName - User's first name
   * @param {string} userData.lastName - User's last name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.confirmPassword - Password confirmation
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.userType - User type (customer, farmer)
   * @param {Object} userData.address - User's address (optional)
   * @returns {Promise} Registration response
   */
  async register(userData) {
    try {
      const response = await apiMethods.post(`${this.baseEndpoint}/register`, {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        phone: userData.phone?.trim(),
        userType: userData.userType || 'customer',
        address: userData.address,
      });

      const { user, token, refreshToken } = response.data;

      // Store authentication data
      authUtils.setAuthToken(token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * User logout
   * @returns {Promise} Logout response
   */
  async logout() {
    try {
      // Call backend logout endpoint
      await apiMethods.post(`${this.baseEndpoint}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local cleanup even if backend call fails
    } finally {
      // Clear local authentication data
      authUtils.clearAuthToken();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise} New token
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiMethods.post(`${this.baseEndpoint}/refresh`, {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken } = response.data;

      // Update stored tokens
      authUtils.setAuthToken(token);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear invalid tokens
      authUtils.clearAuthToken();
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw this.handleError(error);
    }
  }

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  async getCurrentUser() {
    try {
      const response = await apiMethods.get(`${this.userEndpoint}/profile`);
      const user = response.data;

      // Update local user data
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} Updated user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await apiMethods.put(`${this.userEndpoint}/profile`, {
        firstName: profileData.firstName?.trim(),
        lastName: profileData.lastName?.trim(),
        phone: profileData.phone?.trim(),
        address: profileData.address,
        bio: profileData.bio?.trim(),
        preferences: profileData.preferences,
      });

      const user = response.data;

      // Update local user data
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmPassword - Password confirmation
   * @returns {Promise} Success response
   */
  async changePassword(passwordData) {
    try {
      const response = await apiMethods.put(`${this.userEndpoint}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Request password reset
   * @param {string} email - User's email
   * @returns {Promise} Reset request response
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/forgot-password`,
        {
          email: email.toLowerCase().trim(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.password - New password
   * @param {string} resetData.confirmPassword - Password confirmation
   * @returns {Promise} Reset response
   */
  async resetPassword(resetData) {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/reset-password`,
        {
          token: resetData.token,
          password: resetData.password,
          confirmPassword: resetData.confirmPassword,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify email address
   * @param {string} token - Verification token
   * @returns {Promise} Verification response
   */
  async verifyEmail(token) {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/verify-email`,
        {
          token,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Resend email verification
   * @returns {Promise} Resend response
   */
  async resendEmailVerification() {
    try {
      const response = await apiMethods.post(
        `${this.baseEndpoint}/resend-verification`
      );
      return response.data;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check if user is authenticated locally
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return authUtils.isAuthenticated();
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data or null
   */
  getStoredUser() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  }

  /**
   * Handle API errors and provide user-friendly messages
   * @param {Object} error - API error
   * @returns {Object} Formatted error
   */
  handleError(error) {
    const defaultMessage = 'An authentication error occurred.';

    if (error.type) {
      switch (error.type) {
        case 'NETWORK_ERROR':
          return {
            message:
              'Unable to connect to the server. Please check your internet connection.',
            type: 'network',
            retryable: true,
          };
        case 'RATE_LIMIT':
          return {
            message: 'Too many login attempts. Please wait and try again.',
            type: 'rate_limit',
            retryable: true,
          };
        case 'VALIDATION_ERROR':
          return {
            message: error.message || 'Please check your input and try again.',
            type: 'validation',
            retryable: false,
            details: error.details,
          };
        case 'UNAUTHORIZED':
          return {
            message: 'Invalid email or password.',
            type: 'auth',
            retryable: false,
          };
        case 'FORBIDDEN':
          return {
            message: 'Your account has been suspended. Please contact support.',
            type: 'forbidden',
            retryable: false,
          };
        case 'NOT_FOUND':
          return {
            message: 'Account not found.',
            type: 'not_found',
            retryable: false,
          };
        case 'CONFLICT':
          return {
            message: 'An account with this email already exists.',
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
const authAPI = new AuthAPI();
export default authAPI;

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
  isAuthenticated,
  getStoredUser,
} = authAPI;
