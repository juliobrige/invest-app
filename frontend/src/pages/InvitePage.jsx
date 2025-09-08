import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from '../components/BottomNav';

const InvitePage = () => {
    const { profile } = useAuth();
    const [copySuccess, setCopySuccess] = useState('');

    // Construímos o link de convite completo
    const referralLink = `${window.location.origin}/register?ref=${profile?.referral_code}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopySuccess('Link copiado com sucesso!');
            setTimeout(() => setCopySuccess(''), 2000); // Limpa a mensagem após 2 segundos
        }, () => {
            setCopySuccess('Não foi possível copiar o link.');
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-24">
            <div className="container mx-auto max-w-md">
                <header className="p-4 pt-8">
                    <h1 className="text-3xl font-bold text-gray-800">Convidar Amigos</h1>
                    <p className="text-gray-500 mt-1">Partilhe o seu link e ganhe bónus por cada amigo que se registar e investir.</p>
                </header>

                <main className="p-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <h2 className="text-lg font-semibold text-gray-700">O seu Link de Convite Único</h2>
                        
                        <div className="my-4 p-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 break-words">
                            {referralLink}
                        </div>

                        <button
                            onClick={handleCopyLink}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                        >
                            Copiar Link
                        </button>

                        {copySuccess && <p className="text-sm text-green-600 mt-4">{copySuccess}</p>}
                    </div>

                    <div className="mt-6 text-center text-gray-500 text-sm">
                        <p>Receberá um bónus de <span className="font-bold text-emerald-600">500 Kz</span> sempre que um amigo se registar com o seu link e fizer o seu primeiro depósito.</p>
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default InvitePage;
