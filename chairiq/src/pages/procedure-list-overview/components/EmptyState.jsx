import React from 'react';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ language }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
        <Icon name="Search" size={40} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold font-heading text-card-foreground mb-2">
        {language === 'en' ? 'No Procedures Found' : 'No se Encontraron Procedimientos'}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {language === 'en' ?'No procedures match your current filter. Try selecting a different category to view more options.' :'Ningún procedimiento coincide con su filtro actual. Intente seleccionar una categoría diferente para ver más opciones.'}
      </p>
    </div>
  );
};

export default EmptyState;