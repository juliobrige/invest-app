import React from 'react';

// Função para definir o estilo do status (Pendente, Aprovado, etc.)
const getStatusStyle = (status) => {
    switch (status) {
        case 'APPROVED': return 'bg-green-100 text-green-700';
        case 'PENDING': return 'bg-yellow-100 text-yellow-700';
        case 'PROCESSING': return 'bg-blue-100 text-blue-700';
        case 'REJECTED': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

// Função para definir o estilo do valor (entrada vs. saída)
const getAmountStyle = (type, amount) => {
    const isCredit = ['DEPOSIT', 'EARNING', 'BONUS'].includes(type);
    const prefix = isCredit ? '+' : '-';
    const color = isCredit ? 'text-green-600' : 'text-gray-800';
    return {
        text: `${prefix} ${parseFloat(amount).toFixed(2)} Kz`,
        className: color
    };
};

// Mapeamento de tipos de transação para nomes mais amigáveis
const transactionTypeMap = {
    'DEPOSIT': 'Depósito',
    'WITHDRAWAL': 'Retirada',
    'INVESTMENT': 'Investimento',
    'EARNING': 'Ganho',
    'BONUS': 'Bónus de Convite',
};

const TransactionItem = ({ transaction }) => {
    const amountStyle = getAmountStyle(transaction.transaction_type, transaction.amount);
    const transactionName = transactionTypeMap[transaction.transaction_type] || transaction.transaction_type;

    return (
        <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
            <div className="p-2 bg-gray-100 rounded-full mr-4">
                {/* Ícone (pode ser melhorado com ícones específicos por tipo no futuro) */}
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M7 9l4-4 4 4M4 20v-5h5M7 15l4 4 4-4"></path></svg>
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-gray-800">{transactionName}</p>
                <p className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleString('pt-PT')}</p>
            </div>
            <div className="text-right">
                <p className={`font-bold text-sm ${amountStyle.className}`}>{amountStyle.text}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusStyle(transaction.status)}`}>
                    {transaction.status}
                </span>
            </div>
        </div>
    );
};

export default TransactionItem;

