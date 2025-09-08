import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, SvgIcon, label, end = false }) => (
    <NavLink 
        to={to}
        end={end} // Garante que a rota "Início" só fica ativa no caminho exato "/"
        className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`
        }
    >
        <SvgIcon />
        <span className="text-xs mt-1 font-medium">{label}</span>
    </NavLink>
);

// --- Ícones para a Navegação ---
const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const MachinesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const HistoryIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
// NOVO ÍCONE para a lista de investimentos do utilizador
const MyInvestmentsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m6 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" /></svg>;


const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white flex justify-around items-center max-w-md mx-auto rounded-t-2xl border-t border-gray-200 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
            <NavItem to="/" SvgIcon={HomeIcon} label="Início" end={true} />
            <NavItem to="/invest" SvgIcon={MachinesIcon} label="Máquinas" />
            {/* NOVO BOTÃO ADICIONADO */}
            <NavItem to="/my-investments" SvgIcon={MyInvestmentsIcon} label="Meus Invest." />
            <NavItem to="/history" SvgIcon={HistoryIcon} label="Extrato" />
        </nav>
    );
};

export default BottomNav;

