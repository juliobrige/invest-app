import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';

// Componente para um item do histórico de saques
const WithdrawalHistoryItem = ({ withdrawal }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
                <p className="font-semibold text-gray-800">{parseFloat(withdrawal.amount).toFixed(2)} Kz</p>
                <p className="text-xs text-gray-500">{new Date(withdrawal.timestamp).toLocaleDateString('pt-PT')}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(withdrawal.status)}`}>
                {withdrawal.status}
            </span>
        </div>
    );
};

const WithdrawalPage = () => {
    const { wallet, fetchInitialData } = useAuth();
    const [amount, setAmount] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [payment_code, setPaymentCode] = useState(''); // Estado para o código de pagamento
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchHistory = async () => {
        try {
            const response = await apiClient.get('/withdrawals/');
            setHistory(response.data);
        } catch (err) {
            console.error("Não foi possível carregar o histórico de saques.", err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await apiClient.post('/withdraw/', { 
                amount,
                account_name: accountName,
                account_number: accountNumber,
                payment_code: payment_code, // Enviamos o código de pagamento
            });
            await fetchInitialData(); 
            await fetchHistory();
            // Limpa todos os campos
            setAmount('');
            setAccountName('');
            setAccountNumber('');
            setPaymentCode('');
            navigate('/', { state: { message: 'Pedido de saque enviado com sucesso!' } });
        } catch (err) {
            const apiError = err.response?.data;
            const errorMessages = Object.values(apiError).flat().join(' ');
            setError(errorMessages || 'Ocorreu um erro ao processar o seu pedido.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-24">
            <div className="container mx-auto max-w-md">
                <header className="p-4 pt-8">
                    <h1 className="text-3xl font-bold text-gray-800">Retirar Saldo</h1>
                    <p className="text-gray-500">Solicite um saque do seu saldo disponível.</p>
                </header>

                <main className="p-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-baseline mb-4">
                            <p className="text-gray-500">Saldo Disponível:</p>
                            <p className="font-bold text-lg text-emerald-600">{wallet?.available_balance || '0.00'} Kz</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Nome Completo do Titular</label>
                                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Número da Conta / IBAN</label>
                                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Valor a Retirar (Kz)</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
                            </div>
                            {/* CAMPO DE SEGURANÇA ADICIONADO */}
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Código de Pagamento</label>
                                <input
                                    type="password"
                                    value={payment_code}
                                    onChange={(e) => setPaymentCode(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg"
                                    maxLength="6"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold">
                                {loading ? 'A processar...' : 'Confirmar Saque'}
                            </button>
                        </form>
                    </div>
                </main>

                <section className="p-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Histórico de Saques</h2>
                    <div className="space-y-2">
                        {history.length > 0 ? (
                            history.map(tx => <WithdrawalHistoryItem key={tx.id} withdrawal={tx} />)
                        ) : (
                            <p className="text-center text-gray-500 pt-4">Nenhum saque solicitado ainda.</p>
                        )}
                    </div>
                </section>
            </div>
            <BottomNav />
        </div>
    );
};

export default WithdrawalPage;

