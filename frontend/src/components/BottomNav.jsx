import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, SvgIcon, label }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`
        }
    >
        <SvgIcon />
        <span className="text-xs mt-1">{label}</span>
    </NavLink>
);

// Ícones SVG Placeholder
const HomeIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const AccountIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const MachinesIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>);
const WithdrawalsIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5l-3 3-3-3" /></svg>);

const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-800 flex justify-around items-center max-w-md mx-auto rounded-t-2xl border-t border-gray-700 shadow-2xl">
        <NavItem to="/" SvgIcon={HomeIcon} label="Home" />
        <NavItem to="/account" SvgIcon={AccountIcon} label="Conta" />
        <NavItem to="/machines" SvgIcon={MachinesIcon} label="Máquinas" />
        <NavItem to="/withdrawals" SvgIcon={WithdrawalsIcon} label="Saques" />
    </div>
);

export default BottomNav;
