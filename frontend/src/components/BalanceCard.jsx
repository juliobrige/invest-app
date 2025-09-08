import React, { useState } from 'react';

// Ícone de "olho" para a funcionalidade de mostrar/ocultar
const EyeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.67.127 2.454.364m-3.09 5.825a3 3 0 11-4.243-4.243m4.243 4.243l-4.243-4.243" /></svg>;

const BalanceCard = ({ wallet }) => {
  const [isVisible, setIsVisible] = useState(true);

  const totalBalance = (parseFloat(wallet?.available_balance || 0) + parseFloat(wallet?.invested_balance || 0)).toFixed(2);
  const availableBalance = parseFloat(wallet?.available_balance || 0).toFixed(2);
  const investedBalance = parseFloat(wallet?.invested_balance || 0).toFixed(2);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="p-4">
      <div className="relative rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 p-6 text-white shadow-lg overflow-hidden">
        {/* Elemento de design subtil no fundo */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
        
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm opacity-80">Balanço Total</p>
                <p className="text-4xl font-bold mt-2 transition-all duration-300">
                    {isVisible ? totalBalance : '••••••'} <span className="text-xl font-medium">Kz</span>
                </p>
            </div>
            <button onClick={toggleVisibility} className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>

        <div className="mt-6 border-t border-white border-opacity-30 pt-4 flex justify-between">
            <div>
                <p className="text-xs opacity-80">Disponível</p>
                <p className="font-semibold transition-all duration-300">{isVisible ? availableBalance : '••••••'}</p>
            </div>
            <div className="text-right">
                <p className="text-xs opacity-80">Investido</p>
                <p className="font-semibold transition-all duration-300">{isVisible ? investedBalance : '••••••'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;

