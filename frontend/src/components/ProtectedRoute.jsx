import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Se o utilizador não estiver logado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
