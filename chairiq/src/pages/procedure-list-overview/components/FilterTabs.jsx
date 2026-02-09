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
          className={`flex items-center gap-3 px-6 py-4 rounded-lg font-medium text-base whitespace-nowrap transition-all duration-200 focus:border-accent focus:outline-none ${
            activeFilter === filter?.id
              ? 'bg-accent text-white border border-accent' :'bg-bg2 text-t3 border border-bd hover:border-accent/40 hover:brightness-110'
          }`}
          aria-pressed={activeFilter === filter?.id}
        >
          <Icon name={filter?.icon} size={20} className={activeFilter === filter?.id ? 'text-white' : 'text-accent'} />
          <span>{language === 'en' ? filter?.labelEn : filter?.labelEs}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
