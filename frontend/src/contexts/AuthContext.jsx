import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use useCallback to prevent unnecessary re-renders
  const checkAuth = useCallback(() => {
    try {
      const user = authService.getCurrentUser();
      const hasToken = authService.getToken();
      
      // If we have a token but no user data, clear the token as it's corrupt
      if (hasToken && !user) {
        console.warn('Found token but no user data - clearing auth state');
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
        setIsAuthenticated(!!hasToken);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear localStorage on auth errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    setCurrentUser(response.user);
    setIsAuthenticated(true);
    return response;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 