import React from 'react';
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
  // Calcula o progresso do investimento
  const progress = Math.min((investment.days_passed / investment.plan.lifespan_days) * 100, 100);
  const invested = parseFloat(investment.invested_amount).toFixed(2);
  const current = parseFloat(investment.current_value).toFixed(2);

  return (
    <Link 
      to={`/investments/${investment.id}`} // No futuro, levará para a página de detalhes
      className="block p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center space-x-4">
        {/* Imagem da Máquina */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
            {investment.plan.image ? (
                <img src={investment.plan.image} alt={investment.plan.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
          </div>
        </div>
        
        {/* Informações e Progresso */}
        <div className="flex-grow">
          <p className="font-semibold text-gray-800">{investment.plan.name}</p>
          <ProgressBar progress={progress} />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{investment.days_passed} / {investment.plan.lifespan_days} dias</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
        </div>

        {/* Valores */}
        <div className="text-right">
          <p className="font-semibold text-gray-800">{current} Kz</p>
          <p className="text-sm text-gray-500">de {invested}</p>
        </div>
      </div>
    </Link>
  );
};

// Componente para quando não há investimentos
const EmptyState = () => (
    <div className="text-center py-10 px-4">
        <div className="mx-auto h-16 w-16 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-800">Sem investimentos ativos</h3>
        <p className="mt-1 text-sm text-gray-500">Comece a investir numa das nossas máquinas para ver o seu progresso aqui.</p>
        <div className="mt-6">
            <Link 
                to="/invest" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
            >
                Ver Máquinas
            </Link>
        </div>
    </div>
);

// Componente principal
const ActiveInvestments = ({ investments }) => (
  <div className="p-4">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-bold text-gray-800">Meus Investimentos</h2>
      <Link to="/investments" className="text-sm font-medium text-emerald-600 hover:underline">
        Ver Todos
      </Link>
    </div>
    <div className="bg-white rounded-xl shadow-sm">
      {investments && investments.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {investments.slice(0, 3).map(inv => <InvestmentItem key={inv.id} investment={inv} />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  </div>
);

export default ActiveInvestments;

