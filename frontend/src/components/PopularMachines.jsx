import React from 'react';
import { Link } from 'react-router-dom';

const PopularMachines = () => (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold">Máquinas Populares</h2>
            <Link to="/machines" className="text-sm text-blue-400 hover:text-blue-300">ver mais &rarr;</Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
            {/* Placeholders para as máquinas */}
            <div className="h-32 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
    </div>
);

export default PopularMachines;
