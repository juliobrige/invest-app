import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const ChangePasswordPage = () => {
    // Os nomes dos estados podem continuar em camelCase, é uma convenção do React
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('As novas senhas não coincidem.');
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // A CORREÇÃO ESTÁ AQUI:
            // Criamos um objeto de dados com os nomes exatos que o backend espera (snake_case)
            const dataToSend = {
                old_password: oldPassword,
                new_password: newPassword,
            };

            await apiClient.put('/auth/password/change/', dataToSend);
            
            setSuccess('Palavra-passe alterada com sucesso!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => navigate('/account'), 2000);
        } catch (err) {
            const apiError = err.response?.data;
            if (apiError) {
                const errorMessages = Object.values(apiError).flat().join(' ');
                setError(errorMessages || 'Não foi possível alterar a senha.');
            } else {
                setError('Erro de rede. Não foi possível conectar ao servidor.');
            }
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
                    <h1 className="text-xl font-bold text-gray-800 ml-4">Alterar Senha</h1>
                </header>

                <main className="p-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Senha Atual</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Nova Senha</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg"
                                    required
                                />
                            </div>
                             <div>
                                <label className="block text-gray-700 mb-2 font-semibold">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-emerald-600 text-white py-3 rounded-lg font-bold"
                            >
                                {loading ? 'A guardar...' : 'Guardar Nova Senha'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChangePasswordPage;

