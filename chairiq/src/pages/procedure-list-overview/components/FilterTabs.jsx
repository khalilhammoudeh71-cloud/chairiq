import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterTabs = ({ activeFilter, onFilterChange, language }) => {
  const filters = [
    {
      id: 'all',
      labelEn: 'All Procedures',
      labelEs: 'Todos',
      icon: 'LayoutGrid'
    },
    {
      id: 'immediate',
      labelEn: 'Immediate',
      labelEs: 'Inmediato',
      icon: 'AlertCircle'
    },
    {
      id: 'soon',
      labelEn: 'Soon',
      labelEs: 'Pronto',
      icon: 'Clock'
    },
    {
      id: 'future',
      labelEn: 'Future',
      labelEs: 'Futuro',
      icon: 'Calendar'
    }
  ];

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2 mb-12 scrollbar-hide">
      {filters?.map((filter) => (
        <button
          key={filter?.id}
          onClick={() => onFilterChange(filter?.id)}
          className={`flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-base whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            activeFilter === filter?.id
              ? 'bg-blue-600 text-white border border-blue-500' :'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-400/40 hover:bg-gray-700'
          }`}
          aria-pressed={activeFilter === filter?.id}
        >
          <Icon name={filter?.icon} size={20} className={activeFilter === filter?.id ? 'text-white' : 'text-blue-400'} />
          <span>{language === 'en' ? filter?.labelEn : filter?.labelEs}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;