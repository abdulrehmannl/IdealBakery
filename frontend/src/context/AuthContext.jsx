import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!localStorage.getItem('isLoggedIn')) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.get('/api/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData) => {
    localStorage.setItem('isLoggedIn', 'true');
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('isLoggedIn');
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
