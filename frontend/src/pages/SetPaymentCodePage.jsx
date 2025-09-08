import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const SetPaymentCodePage = () => {
    const [current_password, setCurrentPassword] = useState('');
    const [new_payment_code, setNewPaymentCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await apiClient.post('/account/payment-code/set/', {
                current_password,
                new_payment_code,
            });
            setSuccess('Código de pagamento definido com sucesso!');
            setTimeout(() => navigate('/account'), 2000);
        } catch (err) {
            const apiError = err.response?.data;
            const errorMessages = Object.values(apiError).flat().join(' ');
            setError(errorMessages || 'Não foi possível definir o código.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto max-w-md">
                <header className="p-4 flex items-center">
                    <Link to="/account" className="p-2 rounded-full hover:bg-gray-200">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 ml-4">Código de Pagamento</h1>
                </header>

                <main className="p-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-600 mb-4">Este código de 4 a 6 dígitos será usado para autorizar os seus saques e outras transações importantes.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Palavra-passe Atual</label>
                                <input
                                    type="password"
                                    value={current_password}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg"
                                    placeholder="A sua senha de login"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Novo Código de Pagamento (4-6 dígitos)</label>
                                <input
                                    type="password"
                                    value={new_payment_code}
                                    onChange={(e) => setNewPaymentCode(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg"
                                    maxLength="6"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700"
                            >
                                {loading ? 'A definir...' : 'Definir Código'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SetPaymentCodePage;
