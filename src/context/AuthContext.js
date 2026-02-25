import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { usersAPI } from '../api/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userId = await storage.getUserId();
      const username = await storage.getUsername();
      
      if (userId && username) {
        setUser({ userId, username });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, email = null) => {
    try {
      const data = await usersAPI.createOrLogin(username, email);
      
      await storage.setUserId(data.userId);
      await storage.setUsername(username);
      
      setUser({ userId: data.userId, username });
      setIsAuthenticated(true);
      
      return { success: true, userId: data.userId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await storage.clearUserData();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
