import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const fetchProfile = async () => {
    try {
      // CORRIGIDO: Removido o '/api/' do início
      const { data } = await apiClient.get('/profile/');
      setUser(data.user);
      setProfile(data);
      return data;
    } catch (error) {
      console.error("Falha ao ir buscar os dados do perfil", error);
      logout();
      return null;
    }
  };

  const login = async (phone_number, password) => {
    try {
      // CORRIGIDO: Removido o '/api/' do início
      const { data } = await apiClient.post('/auth/login/', { phone_number, password });
      localStorage.setItem('access_token', data.access);
      await fetchProfile();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const register = async (phone_number, name, password, password2) => {
    try {
      // CORRIGIDO: Removido o '/api/' do início
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
        await fetchProfile();
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const value = { user, profile, loading, login, logout, register, fetchProfile };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

