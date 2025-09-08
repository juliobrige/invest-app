import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';

// Componente para a barra de progresso
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
    <div 
      className="bg-emerald-500 h-1.5 rounded-full" 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// Componente para cada item de investimento na lista
const InvestmentItem = ({ investment }) => {
  const progress = Math.min((investment.days_passed / investment.plan.lifespan_days) * 100, 100);
  const invested = parseFloat(investment.invested_amount).toFixed(2);
  const current = parseFloat(investment.current_value).toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-gray-200 flex-shrink-0">
                {investment.plan.image && <img src={investment.plan.image} alt={investment.plan.name} className="w-full h-full object-cover rounded-lg" />}
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-gray-800">{investment.plan.name}</p>
                <ProgressBar progress={progress} />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{investment.days_passed} / {investment.plan.lifespan_days} dias</span>
                    <span>{progress.toFixed(0)}%</span>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-800">{current} Kz</p>
                <p className="text-sm text-gray-500">de {invested}</p>
            </div>
        </div>
    </div>
  );
};

// Componente para quando não há investimentos
const EmptyState = () => (
    <div className="text-center py-10 px-4 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Sem investimentos ativos</h3>
        <p className="mt-1 text-sm text-gray-500">Comece a investir numa das nossas máquinas para ver o seu progresso aqui.</p>
        <div className="mt-6">
            <Link 
                to="/invest" 
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
                Ver Máquinas Disponíveis
            </Link>
        </div>
    </div>
);

const MyInvestmentsPage = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/investments/')
            .then(res => setInvestments(res.data))
            .catch(err => console.error("Erro ao carregar investimentos", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-24">
            <div className="container mx-auto max-w-md">
                <header className="p-4 pt-8">
                    <h1 className="text-3xl font-bold text-gray-800">Meus Investimentos</h1>
                    <p className="text-gray-500">Acompanhe o crescimento dos seus investimentos ativos.</p>
                </header>

                <main className="p-4 space-y-4">
                    {loading ? <p className="text-center text-gray-500">A carregar os seus investimentos...</p> : (
                        investments.length > 0 ? (
                            investments.map(inv => <InvestmentItem key={inv.id} investment={inv} />)
                        ) : (
                            <EmptyState />
                        )
                    )}
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default MyInvestmentsPage;

