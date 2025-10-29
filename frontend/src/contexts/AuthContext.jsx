/**
 * @file AuthContext.jsx
 * @path frontend/src/contexts/AuthContext.jsx
 * @description Authentication context for managing user state and authentication
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiClient';
import { createTestAccount } from '../utils/devAuthHelper';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check auth status via API (cookies are sent automatically)
      const response = await authAPI.checkAuth();
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setIsLoading(false); // Set loading to false here
      } else {
        // Auto-create test account in development mode if not authenticated
        if (import.meta.env.MODE === 'development') {
          console.log('🔧 Development mode: Auto-creating test account...');
          const testAccount = await createTestAccount(authAPI);
          if (testAccount.success && testAccount.user) {
            // Use the user data directly from test account creation
            setUser(testAccount.user);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout(); // Backend will clear HttpOnly cookies
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear state regardless of API call result
      setUser(null);
      setIsAuthenticated(false);
      // No need to clear localStorage - cookies are cleared by backend
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
