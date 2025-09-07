import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // Se o utilizador já estiver logado, redireciona para o dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
