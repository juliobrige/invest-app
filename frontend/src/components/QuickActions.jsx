import React from 'react';
import { Link } from 'react-router-dom';

// Componente para um único botão de ação
const ActionButton = ({ to, label, Icon }) => (
  <Link to={to} className="flex flex-col items-center space-y-2">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110">
      <Icon className="h-6 w-6 text-gray-700" />
    </div>
    <span className="text-xs font-medium text-gray-600">{label}</span>
  </Link>
);

// Ícones SVG Placeholder
const DepositIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20m8-8-8 8-8-8"></path></svg>;
const WithdrawIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 18V2m-8 8 8-8 8 8"></path></svg>;
const InvestIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23"></line><path d="m17 5 5 5-5 5"></path><path d="m7 19-5-5 5-5"></path></svg>;
const InviteIcon = () => <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>;

const QuickActions = () => (
  <div className="grid grid-cols-4 gap-4 px-4 py-6">
    <ActionButton to="/deposit" label="Depositar" Icon={DepositIcon} />
    <ActionButton to="/withdraw" label="Retirar" Icon={WithdrawIcon} />
    <ActionButton to="/invest" label="Investir" Icon={InvestIcon} />
    {/* ATUALIZADO: Este 'to' agora aponta para a nova página de convites */}
    <ActionButton to="/invite" label="Convidar" Icon={InviteIcon} />
  </div>
);

export default QuickActions;

