import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [phone_number, setPhoneNumber] = useState('+244');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mensagem de sucesso vinda da página de registo
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(phone_number, password);
    
    setLoading(false);
    if (success) {
      navigate('/'); // Redireciona para o dashboard
    } else {
      setError('Número de telefone ou palavra-passe inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        {/* Logótipo ou Nome da App */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-600">InvestApp</h1>
            <p className="text-gray-500">Bem-vindo de volta!</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        {successMessage && <p className="text-green-600 text-center mb-4 text-sm">{successMessage}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">Número de Telefone</label>
            <input
              type="tel"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Palavra-passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem uma conta? <Link to="/register" className="text-emerald-600 hover:underline font-semibold">Crie uma agora</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

