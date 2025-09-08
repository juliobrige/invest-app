import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext'; // Importar o useAuth

// --- Sub-componentes para manter o código limpo ---

const BankListItem = ({ bank, onSelect }) => (
    <button 
        onClick={() => onSelect(bank)}
        className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors text-left"
    >
        <div className="p-3 bg-emerald-100 rounded-lg">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
        </div>
        <div className="ml-4 flex-grow">
            <p className="font-semibold text-gray-800">{bank.bank_name}</p>
            <p className="text-sm text-gray-500">{bank.account_holder}</p>
        </div>
        <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
    </button>
);

const DepositForm = ({ bank, onBack }) => {
    const [amount, setAmount] = useState('');
    const [referenceId, setReferenceId] = useState('');
    const [proof, setProof] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchInitialData } = useAuth(); // <<< A FERRAMENTA PARA ATUALIZAR OS DADOS

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !referenceId || !proof) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('reference_id', referenceId);
        formData.append('proof_of_payment', proof);
        formData.append('destination_bank_id', bank.id);

        try {
            await apiClient.post('/deposit/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // A CORREÇÃO PRINCIPAL: Pedimos ao contexto para ir buscar os dados novos
            await fetchInitialData();

            // Redireciona para o dashboard com uma mensagem de sucesso
            navigate('/', { state: { message: 'Pedido de depósito enviado com sucesso! Aguarde a aprovação.' } });
        } catch (err) {
            setError('Ocorreu um erro ao enviar o depósito. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={onBack} className="text-sm font-semibold text-emerald-600 mb-4 hover:underline">
                &larr; Voltar para a seleção de bancos
            </button>
            <div className="bg-gray-100 p-4 rounded-xl mb-6">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Dados para Transferência</h3>
                <p className="text-gray-700"><strong>Banco:</strong> {bank.bank_name}</p>
                <p className="text-gray-700"><strong>Beneficiário:</strong> {bank.account_holder}</p>
                {bank.iban && <p className="text-gray-700"><strong>IBAN:</strong> {bank.iban}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">Valor Transferido (Kz)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-semibold">ID/Referência</label>
                    <input type="text" value={referenceId} onChange={e => setReferenceId(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">Comprovativo</label>
                    <input type="file" onChange={e => setProof(e.target.files[0])} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" required />
                </div>
                {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold">
                    {loading ? 'A enviar...' : 'Submeter Comprovativo'}
                </button>
            </form>
        </div>
    );
};


const DepositPage = () => {
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await apiClient.get('/banks/');
                setBanks(response.data);
            } catch (error) {
                console.error("Não foi possível carregar os bancos.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanks();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">A carregar bancos...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-emerald-600">Realizar Depósito</h1>
                    <p className="text-gray-500 mt-2">
                        {selectedBank ? 'Preencha os dados da sua transferência' : 'Selecione a conta para a qual transferiu'}
                    </p>
                </div>
                {!selectedBank ? (
                    <div className="space-y-3">
                        {banks.map(bank => <BankListItem key={bank.id} bank={bank} onSelect={setSelectedBank} />)}
                    </div>
                ) : (
                    <DepositForm bank={selectedBank} onBack={() => setSelectedBank(null)} />
                )}
            </div>
        </div>
    );
};

export default DepositPage;

