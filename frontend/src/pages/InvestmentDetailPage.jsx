import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import BottomNav from '../components/BottomNav';

const Spinner = () => <div className="border-gray-300 h-16 w-16 animate-spin rounded-full border-4 border-t-emerald-600" />;

const DetailRow = ({ label, value, valueClass = 'text-gray-800' }) => (
    <div className="flex justify-between py-3 border-b border-gray-100">
        <span className="text-gray-500">{label}</span>
        <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
);

const InvestmentDetailPage = () => {
    const { id } = useParams(); // Obtém o ID do investimento a partir do URL
    const [investment, setInvestment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInvestmentDetails = async () => {
            try {
                const response = await apiClient.get(`/investments/${id}/`);
                setInvestment(response.data);
            } catch (err) {
                setError('Não foi possível carregar os detalhes deste investimento.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvestmentDetails();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50"><Spinner /></div>;
    }
    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }
    if (!investment) {
        return <div className="p-10 text-center text-gray-500">Investimento não encontrado.</div>;
    }

    const progress = Math.min((investment.days_passed / investment.plan.lifespan_days) * 100, 100);

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-24">
            <div className="container mx-auto max-w-md">
                <header className="p-4 flex items-center">
                    <Link to="/my-investments" className="p-2 rounded-full hover:bg-gray-200">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 ml-4">Detalhes do Investimento</h1>
                </header>

                <main className="p-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="h-20 w-20 rounded-lg bg-gray-200 mx-auto mb-4">
                            {investment.plan.image && <img src={investment.plan.image} alt={investment.plan.name} className="w-full h-full object-cover rounded-lg" />}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{investment.plan.name}</h2>
                        <p className="font-semibold text-4xl text-emerald-600 mt-2">
                            {parseFloat(investment.current_value).toFixed(2)} Kz
                        </p>
                        <p className="text-sm text-gray-500">Valor Atual</p>
                    </div>

                    <div className="bg-white p-4 mt-4 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-2">Progresso</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                            <span>{investment.days_passed} / {investment.plan.lifespan_days} dias</span>
                            <span>{progress.toFixed(0)}%</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 mt-4 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-2">Informações</h3>
                        <div className="space-y-2">
                           <DetailRow label="Valor Investido" value={`${parseFloat(investment.invested_amount).toFixed(2)} Kz`} />
                           <DetailRow label="Retorno Projetado" value={`${parseFloat(investment.total_return).toFixed(2)} Kz`} valueClass="text-green-600" />
                           <DetailRow label="Data de Início" value={new Date(investment.start_date).toLocaleDateString('pt-PT')} />
                           <DetailRow label="Data de Fim" value={new Date(investment.end_date).toLocaleDateString('pt-PT')} />
                           <DetailRow label="Estado" value={investment.is_active ? 'Ativo' : 'Concluído'} />
                        </div>
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default InvestmentDetailPage;
