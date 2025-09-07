import React from 'react';

const ActionButton = ({ SvgIcon, label, bgColor }) => (
    <div className="flex flex-col items-center">
        <button className={`h-14 w-14 rounded-full ${bgColor} flex items-center justify-center text-white shadow-lg`}>
            <SvgIcon />
        </button>
        <p className="text-xs text-gray-300 mt-2">{label}</p>
    </div>
);

// Ícones SVG Placeholder
const DepositIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5l-3 3-3-3" /></svg>);
const WithdrawIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const BonusIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>);
const OrdersIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);

const ActionButtons = () => (
    <div className="grid grid-cols-4 gap-4 p-4 mt-2">
        <ActionButton SvgIcon={DepositIcon} label="Deposito" bgColor="bg-blue-500"/>
        <ActionButton SvgIcon={WithdrawIcon} label="Saque" bgColor="bg-green-500"/>
        <ActionButton SvgIcon={BonusIcon} label="Bonus" bgColor="bg-yellow-500"/>
        <ActionButton SvgIcon={OrdersIcon} label="Pedidos" bgColor="bg-red-500"/>
    </div>
);

export default ActionButtons;
