import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Este componente aceita uma propriedade 'checkTerms'
// Por defeito, o seu valor é 'true'
const ProtectedRoute = ({ children, checkTerms = true }) => {
  const { user, profile, loading } = useAuth();

  // Enquanto a verificação inicial está a decorrer, mostramos uma mensagem
  if (loading) {
    return <div>A carregar...</div>; // Ou um componente de spinner
  }

  // Se o utilizador não estiver logado, vai sempre para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exigir a verificação dos termos (o padrão) E o utilizador não os aceitou...
  if (checkTerms && !profile?.accepted_terms) {
    // ...redirecionamos para a página de termos para que ele os possa aceitar.
    return <Navigate to="/terms" replace />;
  }

  // Se passou em todas as verificações, mostramos a página que foi pedida
  return children;
};

export default ProtectedRoute;

