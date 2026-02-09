import React from 'react';
import Icon from '../../../components/AppIcon';

const CompletionBadge = ({ size = 'large', showText = true, currentLanguage = 'en' }) => {
  const content = {
    en: {
      completed: 'Completed',
      certified: 'Treatment Plan Certified'
    },
    es: {
      completed: 'Completado', 
      certified: 'Plan de Tratamiento Certificado'
    }
  };

  const text = content?.[currentLanguage];

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const iconSizes = {
    small: 20,
    medium: 28,
    large: 48,
    xl: 64
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={`${sizeClasses?.[size]} rounded-full bg-success/10 border-4 border-success/20 flex items-center justify-center shadow-lg`}>
        <Icon 
          name="CheckCircle2" 
          size={iconSizes?.[size]} 
          className="text-success" 
        />
      </div>
      
      {showText && (
        <div className="text-center">
          <p className="text-sm font-semibold text-success">
            {text?.completed}
          </p>
          <p className="text-xs text-muted-foreground">
            {text?.certified}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletionBadge;