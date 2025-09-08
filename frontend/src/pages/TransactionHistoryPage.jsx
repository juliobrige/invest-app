import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import BottomNav from '../components/BottomNav';
import TransactionItem from '../components/TransactionItem'; // Componente para cada linha

const Spinner = () => <div className="border-gray-300 h-16 w-16 animate-spin rounded-full border-4 border-t-emerald-600" />;

const TransactionHistoryPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Vamos precisar de um novo endpoint no backend para isto
                const response = await apiClient.get('/transactions/'); 
                setTransactions(response.data);
            } catch (err) {
                setError('Não foi possível carregar o histórico de transações.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-24">
            <div className="container mx-auto max-w-md">
                <header className="p-4 pt-8">
                    <h1 className="text-3xl font-bold text-gray-800">Meu Extrato</h1>
                    <p className="text-gray-500">O seu histórico completo de transações.</p>
                </header>

                <main className="p-4">
                    <div className="bg-white rounded-xl shadow-sm p-2 space-y-2">
                        {loading && (
                            <div className="flex justify-center py-10"><Spinner /></div>
                        )}
                        {error && <p className="text-center text-red-500 py-10">{error}</p>}
                        {!loading && !error && (
                            transactions.length > 0 ? (
                                transactions.map(tx => (
                                    <TransactionItem key={tx.id} transaction={tx} />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-10">Nenhuma transação encontrada.</p>
                            )
                        )}
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default TransactionHistoryPage;
