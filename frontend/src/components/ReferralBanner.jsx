import React from 'react';
import { Link } from 'react-router-dom';

const ReferralBanner = () => (
    <div className="p-4">
        <Link to="/referrals" className="block bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-lg text-center text-white shadow-lg">
            <h3 className="font-bold text-lg">Convide Amigos através de Links</h3>
            <p className="text-sm">e ganhe bónus contínuos!</p>
        </Link>
    </div>
);

export default ReferralBanner;
