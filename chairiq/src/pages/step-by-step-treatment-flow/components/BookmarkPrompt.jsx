import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookmarkPrompt = ({ 
  currentLanguage, 
  onContinue, 
  onPause 
}) => {
  const content = {
    en: {
      title: 'Pause & Review Later',
      description: 'You can bookmark your progress and return to this exact step anytime using your SMS link.',
      continueButton: 'Continue Learning',
      pauseButton: 'Pause & Save Progress'
    },
    es: {
      title: 'Pausar y Revisar Más Tarde',
      description: 'Puede marcar su progreso y volver a este paso exacto en cualquier momento usando su enlace SMS.',
      continueButton: 'Continuar Aprendiendo',
      pauseButton: 'Pausar y Guardar Progreso'
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="bookmark-prompt bg-accent/5 border border-accent/20 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon name="Bookmark" size={24} className="text-accent" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {text?.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {text?.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={onContinue}
              iconName="Play"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              {text?.continueButton}
            </Button>
            <Button
              variant="outline"
              onClick={onPause}
              iconName="Pause"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              {text?.pauseButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkPrompt;