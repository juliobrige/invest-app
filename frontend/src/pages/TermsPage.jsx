import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';

const TermsPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchProfile } = useAuth(); // Usamos esta função para atualizar o estado do perfil

    const handleAccept = async () => {
        setLoading(true);
        try {
            // CORRIGIDO: O caminho da API está correto, sem o '/api/' duplicado.
            await apiClient.post('/profile/accept-terms/');
            
            // Após aceitar, vamos buscar novamente os dados do perfil atualizados
            await fetchProfile();
            
            // Navegamos para o dashboard, que agora estará acessível
            navigate('/');
        } catch (error) {
            console.error("Não foi possível aceitar os termos.", error);
            alert("Ocorreu um erro. Por favor, tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-emerald-600">Termos de Uso</h1>
                    <p className="text-gray-500 mt-2">Por favor, leia e aceite os termos para continuar.</p>
                </div>
                <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-6 text-gray-600 text-sm bg-gray-50">
                    <h2 className="font-semibold text-gray-800 mb-2">1. Aceitação dos Termos</h2>
                    <p className="mb-4">Ao aceder e utilizar a InvestApp, você aceita e concorda em ficar vinculado aos termos e disposições deste acordo. Se não concordar com alguma parte dos termos, não poderá aceder ao serviço.</p>
                    <h2 className="font-semibold text-gray-800 mb-2">2. Natureza do Serviço</h2>
                    <p className="mb-4">A InvestApp é uma plataforma de simulação de investimentos. Todos os valores, transações, e retornos são fictícios e destinam-se apenas a fins educativos e de entretenimento. Nenhuma transação financeira real ocorre nesta plataforma.</p>
                    <h2 className="font-semibold text-gray-800 mb-2">3. Risco e Responsabilidade</h2>
                    <p>O investimento simulado envolve risco simulado. Não há garantia de lucros. O desempenho passado não é indicativo de resultados futuros. A InvestApp não se responsabiliza por quaisquer decisões tomadas com base nas simulações apresentadas.</p>
                </div>
                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
                >
                    {loading ? 'A processar...' : 'Li e Aceito os Termos'}
                </button>
            </div>
        </div>
    );
};

export default TermsPage;
