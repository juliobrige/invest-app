import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Importar as Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TermsPage from './pages/TermsPage';

// Importar os Componentes de Rota
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    // O AuthProvider envolve toda a aplicação para partilhar o estado
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Rotas Públicas (só para quem NÃO está logado) --- */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* --- Rotas Protegidas (só para quem ESTÁ logado) --- */}
          <Route 
            path="/" 
            element={
              // Esta rota verifica se o utilizador aceitou os termos
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/terms" 
            element={
              // Esta rota SÓ verifica se o utilizador está logado,
              // mas não se aceitou os termos.
              <ProtectedRoute checkTerms={false}>
                <TermsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

