import React from 'react';
import { Link } from 'react-router-dom';

const InvestmentItem = ({ investment }) => (
  <Link to={`/investments/${investment.id}`} className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg">
    <div className="flex-shrink-0">
      <div className="h-10 w-10 rounded-lg bg-gray-200">
        {/* Placeholder para a imagem da máquina */}
      </div>
    </div>
    <div className="flex-grow">
      <p className="font-semibold text-gray-800">{investment.plan.name}</p>
      <p className="text-sm text-gray-500">Retorno: {investment.plan.return_percentage}%</p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-800">{parseFloat(investment.current_value).toFixed(2)} Kz</p>
      <p className="text-sm text-green-600">↗ A crescer</p>
    </div>
  </Link>
);

const ActiveInvestments = ({ investments }) => (
  <div className="p-4">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-bold text-gray-800">Meus Investimentos</h2>
      <Link to="/investments" className="text-sm font-medium text-emerald-600">Ver Todos</Link>
    </div>
    <div className="bg-white p-2 rounded-xl shadow-sm">
      {investments && investments.length > 0 ? (
        investments.slice(0, 3).map(inv => <InvestmentItem key={inv.id} investment={inv} />)
      ) : (
        <p className="text-center text-gray-500 py-4">Ainda não tem investimentos ativos.</p>
      )}
    </div>
  </div>
);

export default ActiveInvestments;
