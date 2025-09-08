import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Importar todas as nossas Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TermsPage from './pages/TermsPage';
import AccountPage from './pages/AccountPage';
import DepositPage from './pages/DepositPage';
import InvestmentPage from './pages/InvestmentPage';
import WithdrawalPage from './pages/WithdrawalPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import InvitePage from './pages/InvitePage';
import UserDetailsPage from './pages/UserDetailsPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import SetPaymentCodePage from './pages/SetPaymentCodePage';
import MyInvestmentsPage from './pages/MyInvestmentsPage';
import InvestmentDetailPage from './pages/InvestmentDetailPage'; // A nossa nova página

// Importar os Componentes de Rota
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* --- Rotas Protegidas --- */}
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/terms" element={<ProtectedRoute checkTerms={false}><TermsPage /></ProtectedRoute>} />
          
          {/* Rotas Principais */}
          <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
          <Route path="/invest" element={<ProtectedRoute><InvestmentPage /></ProtectedRoute>} />
          <Route path="/my-investments" element={<ProtectedRoute><MyInvestmentsPage /></ProtectedRoute>} />
          
          {/* NOVA ROTA para a página de detalhes de um investimento */}
          {/* O ':id' é um parâmetro dinâmico que irá corresponder ao ID do investimento */}
          <Route path="/investments/:id" element={<ProtectedRoute><InvestmentDetailPage /></ProtectedRoute>} />
          
          <Route path="/withdraw" element={<ProtectedRoute><WithdrawalPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><TransactionHistoryPage /></ProtectedRoute>} />
          <Route path="/invite" element={<ProtectedRoute><InvitePage /></ProtectedRoute>} />

          {/* Rotas da Secção "Conta" */}
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/account/details" element={<ProtectedRoute><UserDetailsPage /></ProtectedRoute>} />
          <Route path="/account/password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
          <Route path="/account/payment-code" element={<ProtectedRoute><SetPaymentCodePage /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

