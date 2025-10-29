/**
 * @file AuthContext.jsx
 * @path frontend/src/contexts/AuthContext.jsx
 * @description Authentication context for managing user state and authentication
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createTestAccount } from '../utils/devAuthHelper';
import { authAPI } from '../services/apiClient';

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
  
  const checkAuthStatus = useCallback(async () => {
    try {
      // Check auth status via API (cookies are sent automatically)
      const response = await authAPI.checkAuth();
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);

        // Dev-only optional auto-login (toggle via localStorage.devAutoLogin = 'true')
        if (import.meta.env.MODE === 'development' && localStorage.getItem('devAutoLogin') === 'true') {
          try {
            const result = await createTestAccount(authAPI);
            if (result?.success) {
              const recheck = await authAPI.checkAuth();
              if (recheck.success && recheck.user) {
                setUser(recheck.user);
                setIsAuthenticated(true);
              }
            }
          } catch {
            // ignore dev auto-login errors
          }
        }
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

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
    checkAuthStatus,
    setUser,
    setIsAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
