import React from 'react';

const BalanceCard = ({ wallet }) => {
  // Calcula o balanço total somando o disponível e o investido
  const totalBalance = (parseFloat(wallet?.available_balance || 0) + parseFloat(wallet?.invested_balance || 0)).toFixed(2);

  return (
    <div className="p-4">
      <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 p-6 text-white shadow-lg">
        <p className="text-sm opacity-80">Balanço Total</p>
        <p className="text-4xl font-bold mt-2">
          {totalBalance} <span className="text-xl font-medium">Kz</span>
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
