import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ seconds }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const days = Math.floor(timeLeft / (60 * 60 * 24));
    const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeLeft % (60 * 60)) / 60);

    return (
        <span>{`${days}d ${hours}h ${minutes}m`}</span>
    );
};

const MachineCard = ({ machine, onInvestClick }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0">
                {machine.image ? (
                    <img src={machine.image} alt={machine.name} className="w-full h-full object-cover rounded-lg" />
                ) : null}
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-gray-800">{machine.name}</h3>
                {machine.required_vip_level && (
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        VIP {machine.required_vip_level}
                    </span>
                )}
                <p className="text-sm text-gray-500 mt-1">
                    Expira em: <CountdownTimer seconds={machine.time_left_seconds} />
                </p>
            </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500">Retorno Total</p>
                <p className="font-bold text-lg text-green-600">{machine.return_percentage}%</p>
            </div>
            <div>
                <p className="text-xs text-gray-500">Duração</p>
                <p className="font-bold text-lg text-gray-700">{machine.lifespan_days} dias</p>
            </div>
            <button
                onClick={onInvestClick}
                className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
            >
                Investir
            </button>
        </div>
    </div>
);

export default MachineCard;
