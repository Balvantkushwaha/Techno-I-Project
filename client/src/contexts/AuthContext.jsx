import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      
      // If OTP login request
      if (credentials.loginMethod === 'otp' && response.message === 'OTP sent for login') {
        return { requiresOTP: true, identifier: credentials.identifier };
      }
      
      // If password login success
      if (response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const verifyLoginOTP = async (identifier, otp) => {
    try {
      setError(null);
      const response = await authService.verifyLoginOTP(identifier, otp);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      setError(error.message || 'OTP verification failed');
      throw error;
    }
  };

  const register = {
    sendOTP: async (identifier) => {
      try {
        setError(null);
        return await authService.sendRegisterOTP(identifier);
      } catch (error) {
        setError(error.message || 'Failed to send OTP');
        throw error;
      }
    },
    verifyOTP: async (identifier, otp) => {
      try {
        setError(null);
        return await authService.verifyRegisterOTP(identifier, otp);
      } catch (error) {
        setError(error.message || 'OTP verification failed');
        throw error;
      }
    },
    complete: async (userData) => {
      try {
        setError(null);
        const response = await authService.completeRegistration(userData);
        if (response.user) {
          setUser(response.user);
        }
        return response;
      } catch (error) {
        setError(error.message || 'Registration failed');
        throw error;
      }
    }
  };

  const forgotPassword = async (identifier) => {
    try {
      setError(null);
      return await authService.forgotPassword(identifier);
    } catch (error) {
      setError(error.message || 'Failed to send reset OTP');
      throw error;
    }
  };

  const resetPassword = async (data) => {
    try {
      setError(null);
      return await authService.resetPassword(data);
    } catch (error) {
      setError(error.message || 'Password reset failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (error) {
      setError(error.message || 'Logout failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    verifyLoginOTP,
    register,
    forgotPassword,
    resetPassword,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};