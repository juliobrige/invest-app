import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';

// Importar os nossos componentes premium
import DashboardHeader from '../components/DashboardHeader';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import ActiveInvestments from '../components/ActiveInvestments';
import BottomNav from '../components/BottomNav';

const Spinner = () => <div className="border-gray-300 h-16 w-16 animate-spin rounded-full border-4 border-t-emerald-600" />;

const DashboardPage = () => {
  const { logout } = useAuth(); // Apenas para o useEffect
  const [dashboardData, setDashboardData] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dashboardRes, investmentsRes] = await Promise.all([
          apiClient.get('/dashboard/'),
          apiClient.get('/investments/')
        ]);
        setDashboardData(dashboardRes.data);
        setInvestments(investmentsRes.data);
      } catch (error) {
        console.error("Não foi possível carregar os dados", error);
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      <div className="container mx-auto max-w-md">
        
        {/* O novo cabeçalho já inclui o botão de sair */}
        <DashboardHeader />

        {/* O resto dos componentes continua igual */}
        <BalanceCard wallet={dashboardData?.wallet} />
        <QuickActions />
        <ActiveInvestments investments={investments} />

        {/* O BOTÃO DE SAIR ANTIGO FOI REMOVIDO DAQUI */}

      </div>
      <BottomNav />
    </div>
  );
};

export default DashboardPage;

