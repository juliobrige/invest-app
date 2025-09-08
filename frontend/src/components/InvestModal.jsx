import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext'; // 1. Importar o useAuth

const InvestModal = ({ isOpen, onClose, machine }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchInitialData } = useAuth(); // 2. Obter a função para atualizar os dados

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!amount || parseFloat(amount) < machine.min_investment_value) {
            setError(`O valor mínimo para esta máquina é de ${machine.min_investment_value} Kz.`);
            return;
        }
        setError('');
        setLoading(true);

        try {
            await apiClient.post('/invest/', {
                plan_id: machine.id,
                amount: amount,
            });
            
            // 3. A CORREÇÃO: Após o sucesso, vamos buscar o novo saldo
            await fetchInitialData();
            
            navigate('/', { state: { message: 'Investimento realizado com sucesso!' } });
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Não foi possível realizar o investimento.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-bold text-gray-800">Investir em {machine.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Insira o valor que deseja investir.</p>

                <div className="mt-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Valor (Kz)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Mínimo: ${machine.min_investment_value}`}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold disabled:bg-emerald-300"
                    >
                        {loading ? 'A investir...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestModal;