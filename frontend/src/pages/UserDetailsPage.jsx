import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserDetailsPage = () => {
    const { user, profile } = useAuth();

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto max-w-md">
                <header className="p-4 flex items-center">
                    <Link to="/account" className="p-2 rounded-full hover:bg-gray-200">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 ml-4">Informações do Usuário</h1>
                </header>

                <main className="p-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <div>
                            <label className="text-sm text-gray-500">Nome Completo</label>
                            <p className="font-semibold text-gray-800 text-lg">{user?.name || 'N/A'}</p>
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <div>
                            <label className="text-sm text-gray-500">Número de Telefone</label>
                            <p className="font-semibold text-gray-800 text-lg">{user?.phone_number || 'N/A'}</p>
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <div>
                            <label className="text-sm text-gray-500">ID de Utilizador</label>
                            <p className="font-semibold text-gray-800 text-lg">{user?.id || 'N/A'}</p>
                        </div>
                         <div className="border-t border-gray-100"></div>
                        <div>
                            <label className="text-sm text-gray-500">Nível VIP</label>
                            <p className="font-semibold text-emerald-600 text-lg">{profile?.vip_level?.name || 'N/A'}</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDetailsPage;
