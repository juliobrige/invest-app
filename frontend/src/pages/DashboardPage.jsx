import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

// Importar os nossos componentes premium
import DashboardHeader from '../components/DashboardHeader';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import ActiveInvestments from '../components/ActiveInvestments';
import BottomNav from '../components/BottomNav';

const DashboardPage = () => {
  // Obtemos os dados e a função para os atualizar do nosso contexto
  const { wallet, fetchInitialData } = useAuth();
  const [investments, setInvestments] = useState([]);
  
  // Lógica para mostrar a mensagem de sucesso (vinda de outras páginas)
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.message;

  // Limpa a mensagem da localização após a mostrar para não reaparecer
  useEffect(() => {
      if (successMessage) {
          navigate(location.pathname, { replace: true, state: {} });
      }
  }, [successMessage, navigate, location.pathname]);

  // Efeito para ir buscar os dados dos investimentos
  useEffect(() => {
    const fetchInvestments = () => {
        apiClient.get('/investments/').then(res => {
            setInvestments(res.data);
        }).catch(err => {
            console.error("Não foi possível carregar os investimentos.", err);
        });
    };
    
    // Vamos buscar os dados quando a página carrega
    fetchInitialData();
    fetchInvestments();
  }, [fetchInitialData]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      <div className="container mx-auto max-w-md">
        
        <DashboardHeader />
        
        {successMessage && (
            <div className="mx-4 mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg shadow-sm">
                {successMessage}
            </div>
        )}

        <BalanceCard wallet={wallet} />
        <QuickActions />
        <ActiveInvestments investments={investments} />
      </div>
      <BottomNav />
    </div>
  );
};

export default DashboardPage;

