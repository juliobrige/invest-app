import React from 'react';

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
    // Mapeamento para nomes mais amigáveis
    const categoryNames = {
        'ALL': 'Todas',
        'STANDARD': 'Standard',
        'PREMIUM': 'Premium',
        'EXCLUSIVE': 'Exclusivas'
    };

    return (
        <div className="px-4 py-2">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map(category => {
                    const isActive = activeCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                                isActive 
                                ? 'bg-emerald-600 text-white shadow' 
                                : 'bg-white text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {categoryNames[category]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryFilter;
