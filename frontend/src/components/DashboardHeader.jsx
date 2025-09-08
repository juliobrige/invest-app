import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; // Importar o Link para a navegação

const DashboardHeader = () => {
  const { user, profile, logout } = useAuth(); // Obtemos os dados e a função logout do nosso contexto

  return (
    <header className="flex items-center justify-between p-4 mb-4">
      {/* A ÁREA DO UTILIZADOR AGORA É UM LINK CLICÁVEL QUE LEVA PARA A PÁGINA DE CONTA */}
      <Link 
        to="/account" 
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-gray-600">{user?.name?.charAt(0) || 'U'}</span>
        </div>
        <div>
          <p className="font-bold text-gray-800">Olá, {user?.name || ''}!</p>
          <p className="text-xs text-gray-500">Nível VIP: {profile?.vip_level?.name || 'Bronze'}</p>
        </div>
      </Link>
      
      {/* O botão de logout permanece no seu novo sítio */}
      <button
        onClick={logout}
        title="Sair"
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      </button>
    </header>
  );
};

export default DashboardHeader;

