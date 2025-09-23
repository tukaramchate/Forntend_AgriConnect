import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call
        // In a real implementation, this would be:
        // const userData = await getCurrentUser();

        // For now, just check localStorage
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        setError('Failed to authenticate. Please log in again.');
        // Clear potentially corrupted auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      // In a real implementation: const data = await loginUser(email, password);

      // Mock login for demonstration
      if (email === 'user@example.com' && password === 'password') {
        const mockUser = {
          id: '123',
          name: 'Test User',
          email: 'user@example.com',
          role: 'customer',
        };

        const mockToken = 'mock-jwt-token';

        // Save to localStorage
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));

        setUser(mockUser);
        setIsAuthenticated(true);
        return mockUser;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call
      // In a real implementation: const data = await registerUser(userData);

      // Mock registration
      const mockUser = {
        id: '123',
        name: userData.name,
        email: userData.email,
        role: 'customer',
      };

      const mockToken = 'mock-jwt-token';

      // Save to localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Simulate API call
      // In a real implementation: await logoutUser();

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
