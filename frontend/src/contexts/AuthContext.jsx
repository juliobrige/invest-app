import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    setWallet(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/dashboard/');
      setUser(data.profile.user);
      setProfile(data.profile);
      setWallet(data.wallet);
      return data;
    } catch (error) {
      console.error("Falha ao ir buscar os dados iniciais, fazendo logout.", error);
      logout();
      return null;
    }
  }, [logout]);

  const login = async (phone_number, password) => {
    try {
      const { data } = await apiClient.post('/auth/login/', { phone_number, password });
      localStorage.setItem('access_token', data.access);
      await fetchInitialData();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const register = async (phone_number, name, password, password2) => {
    try {
      await apiClient.post('/auth/register/', { phone_number, name, password, password2 });
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const initializeAuth = async () => {
      if (token) {
        await fetchInitialData();
      }
      setLoading(false);
    };
    initializeAuth();
  }, [fetchInitialData]);

  const value = { user, profile, wallet, loading, login, logout, register, fetchInitialData };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

