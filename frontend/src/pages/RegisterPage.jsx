import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [phone_number, setPhoneNumber] = useState('+244');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    setError('');
    setLoading(true);

    const success = await register(phone_number, name, password, password2);
    
    setLoading(false);
    if (success) {
      navigate('/login', { state: { message: 'Conta criada com sucesso! Por favor, faça login.' } });
    } else {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
       <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-600">Criar Conta</h1>
            <p className="text-gray-500">Junte-se a nós e comece a investir.</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">Nome Completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">Número de Telefone</label>
            <input type="tel" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">Palavra-passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold">Confirmar Palavra-passe</label>
            <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:bg-emerald-300"
          >
            {loading ? 'A registar...' : 'Registar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta? <Link to="/login" className="text-emerald-600 hover:underline font-semibold">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

