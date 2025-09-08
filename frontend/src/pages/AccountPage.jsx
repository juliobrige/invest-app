import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

// Componente reutilizável para cada link de configuração
const SettingsLink = ({ to, title, subtitle, Icon }) => (
  <Link to={to} className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
    <div className="p-3 bg-emerald-100 rounded-lg">
      <Icon className="w-6 h-6 text-emerald-600" />
    </div>
    <div className="ml-4 flex-grow">
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <div className="text-gray-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </div>
  </Link>
);

// Ícones SVG Placeholder
const UserIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const LockIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const ShieldIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 3c4.556 0 8.512-2.812 10.118-6.944a11.953 11.953 0 01-1.25-3.21z" /></svg>;

const AccountPage = () => {
  const { user, profile, logout } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      <div className="container mx-auto max-w-md">
        <header className="p-4 pt-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-gray-600">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{user?.name || ''}</h1>
          <p className="text-gray-500">ID: {user?.id}</p>
          <p className="mt-1 text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full inline-block">
            Nível VIP: {profile?.vip_level?.name || 'Bronze'}
          </p>
        </header>

        <main className="p-4 space-y-3">
          <SettingsLink to="/account/details" title="Informações do Usuário" subtitle="Veja os seus dados" Icon={UserIcon} />
          <SettingsLink to="/account/password" title="Senha de Entrada" subtitle="Altere a sua palavra-passe" Icon={LockIcon} />
          {/* O 'to' agora aponta para o caminho correto */}
          <SettingsLink to="/account/payment-code" title="Código de Pagamento" subtitle="Configure o seu código de segurança" Icon={ShieldIcon} />
        </main>

        <div className="mt-6 px-4">
          <button
            onClick={logout}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Terminar Sessão
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AccountPage;

