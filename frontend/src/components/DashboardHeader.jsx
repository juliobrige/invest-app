import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardHeader = () => {
  const { user, profile, logout } = useAuth(); // Obtemos a função logout do contexto

  return (
    <header className="flex items-center justify-between p-4 mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-600">{user?.name?.charAt(0) || 'U'}</span>
        </div>
        <div>
          <p className="font-bold text-gray-800">Olá, {user?.name || ''}!</p>
          <p className="text-xs text-gray-500">Nível VIP: {profile?.vip_level?.name || 'Bronze'}</p>
        </div>
      </div>
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

