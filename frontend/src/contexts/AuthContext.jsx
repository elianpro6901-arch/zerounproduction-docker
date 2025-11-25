import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken, setAuthToken as saveToken, removeAuthToken } from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const data = await verifyToken();
        setIsAuthenticated(true);
        setUsername(data.username);
      } catch (error) {
        removeAuthToken();
        setIsAuthenticated(false);
        setUsername(null);
      }
    }
    setIsLoading(false);
  };

  const login = (token, user) => {
    saveToken(token);
    setIsAuthenticated(true);
    setUsername(user);
  };

  const logout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};