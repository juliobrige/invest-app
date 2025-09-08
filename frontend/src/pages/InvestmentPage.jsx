import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import BottomNav from '../components/BottomNav';
import MachineCard from '../components/MachineCard';
import InvestModal from '../components/InvestModal';
import CategoryFilter from '../components/CategoryFilter'; // Novo componente de filtro

const Spinner = () => <div className="border-gray-300 h-16 w-16 animate-spin rounded-full border-4 border-t-emerald-600" />;

const InvestmentPage = () => {
    const [machines, setMachines] = useState([]);
    const [filteredMachines, setFilteredMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');

    // Estado para controlar o modal de investimento
    const [selectedMachine, setSelectedMachine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Categorias que teremos. Poderiam também vir da API.
    const categories = ['ALL', 'STANDARD', 'PREMIUM', 'EXCLUSIVE'];

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await apiClient.get('/machines/');
                setMachines(response.data);
                setFilteredMachines(response.data); // Inicialmente, mostramos todas
            } catch (err) {
                setError('Não foi possível carregar as máquinas de investimento.');
            } finally {
                setLoading(false);
            }
        };
        fetchMachines();
    }, []);

    useEffect(() => {
        // Lógica para filtrar as máquinas quando a categoria ativa muda
        if (activeCategory === 'ALL') {
            setFilteredMachines(machines);
        } else {
            const filtered = machines.filter(m => m.category === activeCategory);
            setFilteredMachines(filtered);
        }
    }, [activeCategory, machines]);

    const handleInvestClick = (machine) => {
        setSelectedMachine(machine);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMachine(null);
    };

    return (
        <>
            <div className="bg-gray-50 min-h-screen font-sans pb-24">
                <div className="container mx-auto max-w-md">
                    <header className="p-4 pt-8">
                        <h1 className="text-3xl font-bold text-gray-800">Investir</h1>
                        <p className="text-gray-500">Escolha uma máquina para começar.</p>
                    </header>

                    {/* Filtro de Categorias */}
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />

                    <main className="p-4 space-y-4">
                        {loading && <div className="flex justify-center pt-10"><Spinner /></div>}
                        {error && <p className="text-center text-red-500">{error}</p>}
                        {!loading && !error && (
                            filteredMachines.length > 0 ? (
                                filteredMachines.map(machine => (
                                    <MachineCard 
                                        key={machine.id} 
                                        machine={machine} 
                                        onInvestClick={() => handleInvestClick(machine)}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 pt-10">Nenhuma máquina encontrada nesta categoria.</p>
                            )
                        )}
                    </main>
                </div>
                <BottomNav />
            </div>
            {selectedMachine && (
                <InvestModal isOpen={isModalOpen} onClose={handleCloseModal} machine={selectedMachine} />
            )}
        </>
    );
};

export default InvestmentPage;

