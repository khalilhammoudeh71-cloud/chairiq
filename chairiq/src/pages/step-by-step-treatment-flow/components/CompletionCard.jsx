import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CompletionCard = ({ currentLanguage }) => {
  const navigate = useNavigate();

  const content = {
    en: {
      title: 'Treatment Plan Complete!',
      message: 'You\'ve reviewed all procedures in your treatment plan. You can now explore individual procedures in detail or return to the overview.',
      viewAllButton: 'View All Procedures',
      startOverButton: 'Start Over',
      homeButton: 'Back to Home'
    },
    es: {
      title: '¡Plan de Tratamiento Completo!',
      message: 'Ha revisado todos los procedimientos en su plan de tratamiento. Ahora puede explorar procedimientos individuales en detalle o volver a la descripción general.',
      viewAllButton: 'Ver Todos los Procedimientos',
      startOverButton: 'Comenzar de Nuevo',
      homeButton: 'Volver al Inicio'
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="completion-card bg-card rounded-lg shadow-medium p-8 text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
          <Icon name="CheckCircle2" size={48} className="text-success" />
        </div>
      </div>
      {/* Content */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold font-heading text-card-foreground">
          {text?.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {text?.message}
        </p>
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate('/procedure-list-overview')}
          iconName="LayoutGrid"
          iconPosition="left"
        >
          {text?.viewAllButton}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.location?.reload()}
          iconName="RotateCcw"
          iconPosition="left"
        >
          {text?.startOverButton}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate('/treatment-plan-landing')}
          iconName="Home"
          iconPosition="left"
        >
          {text?.homeButton}
        </Button>
      </div>
    </div>
  );
};

export default CompletionCard;