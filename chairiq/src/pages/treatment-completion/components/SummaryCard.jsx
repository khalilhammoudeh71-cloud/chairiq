import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCard = ({ 
  procedureCount = 0, 
  timeSpent = '0 min', 
  completionDate,
  currentLanguage = 'en' 
}) => {
  const content = {
    en: {
      title: 'Learning Summary',
      procedures: 'Procedures Reviewed',
      timeSpent: 'Time Spent Learning',
      completedOn: 'Completed On',
      achievement: 'Achievement Unlocked',
      prepared: 'Well-Prepared Patient'
    },
    es: {
      title: 'Resumen de Aprendizaje',
      procedures: 'Procedimientos Revisados',
      timeSpent: 'Tiempo de Aprendizaje',
      completedOn: 'Completado El',
      achievement: 'Logro Desbloqueado',
      prepared: 'Paciente Bien Preparado'
    }
  };

  const text = content?.[currentLanguage];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return currentLanguage === 'en' ? date?.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      : date?.toLocaleDateString('es-ES', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short',
          year: 'numeric'
        });
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="BarChart3" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-card-foreground">
          {text?.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Procedures Count */}
        <div className="text-center p-4 bg-primary/5 rounded-lg">
          <div className="flex justify-center mb-2">
            <Icon name="BookOpen" size={32} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary mb-1">
            {procedureCount}
          </p>
          <p className="text-sm text-muted-foreground">
            {text?.procedures}
          </p>
        </div>

        {/* Time Spent */}
        <div className="text-center p-4 bg-success/5 rounded-lg">
          <div className="flex justify-center mb-2">
            <Icon name="Clock" size={32} className="text-success" />
          </div>
          <p className="text-3xl font-bold text-success mb-1">
            {timeSpent}
          </p>
          <p className="text-sm text-muted-foreground">
            {text?.timeSpent}
          </p>
        </div>

        {/* Achievement */}
        <div className="text-center p-4 bg-warning/5 rounded-lg">
          <div className="flex justify-center mb-2">
            <Icon name="Award" size={32} className="text-warning" />
          </div>
          <p className="text-lg font-bold text-warning mb-1">
            {text?.achievement}
          </p>
          <p className="text-sm text-muted-foreground">
            {text?.prepared}
          </p>
        </div>
      </div>

      {/* Completion Date */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>
            {text?.completedOn}: {formatDate(completionDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;