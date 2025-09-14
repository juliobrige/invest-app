import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

// Pode reutilizar o componente TransactionItem que já criámos
import TransactionItem from './TransactionItem'; 

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // O endpoint /transactions/ já devolve as transações ordenadas pela mais recente
        apiClient.get('/transactions/')
            .then(res => setTransactions(res.data.slice(0, 5))) // Pegamos apenas nas 5 primeiras
            .catch(err => console.error("Erro ao carregar transações", err))
            .finally(() => setLoading(false));
    }, []);

    if(loading) {
        return <div className="p-4 text-center text-gray-500">A carregar transações...</div>
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-800">Transações Recentes</h2>
                <Link to="/history" className="text-sm font-medium text-emerald-600 hover:underline">
                    Ver Extrato
                </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-2 space-y-2">
                {transactions.length > 0 ? (
                    transactions.map(tx => <TransactionItem key={tx.id} transaction={tx} />)
                ) : (
                    <p className="text-center text-gray-500 py-6">Nenhuma transação recente.</p>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;
