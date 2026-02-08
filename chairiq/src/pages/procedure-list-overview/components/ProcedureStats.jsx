import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcedureStats = ({ stats, language }) => {
  const statItems = [
    {
      icon: 'FileText',
      labelEn: 'Total Procedures',
      labelEs: 'Procedimientos Totales',
      value: stats?.total,
      color: 'text-blue-400'
    },
    {
      icon: 'CheckCircle2',
      labelEn: 'Reviewed',
      labelEs: 'Revisados',
      value: stats?.reviewed,
      color: 'text-green-400'
    },
    {
      icon: 'Clock',
      labelEn: 'Pending',
      labelEs: 'Pendientes',
      value: stats?.pending,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-12">
      {statItems?.map((item, index) => (
        <div 
          key={index}
          className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-2xl"
        >
          <div className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-900 mb-4 ${item?.color}`}>
            <Icon name={item?.icon} size={24} />
          </div>
          <div className="text-4xl sm:text-5xl font-bold text-white mb-3">
            {item?.value}
          </div>
          <div className="text-base sm:text-lg text-gray-400 text-center font-light">
            {language === 'en' ? item?.labelEn : item?.labelEs}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcedureStats;