import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { resetTreatmentProgress } from '../../../utils/treatmentProgress';

const CTASection = ({ currentLanguage }) => {
  const navigate = useNavigate();

  const content = {
    en: {
      primary: "Start My Treatment Plan",
      secondary: "View All Procedures",
      primaryDesc: "Follow a guided step-by-step journey",
      secondaryDesc: "Explore your complete treatment plan"
    },
    es: {
      primary: "Comenzar Mi Plan de Tratamiento",
      secondary: "Ver Todos los Procedimientos",
      primaryDesc: "Siga un viaje guiado paso a paso",
      secondaryDesc: "Explore su plan de tratamiento completo"
    }
  };

  const text = content?.[currentLanguage];

  const handleStartTreatment = () => {
    // CRITICAL: Reset all progress before starting fresh
    resetTreatmentProgress();
    // Navigate with query param to signal fresh start
    navigate('/step-by-step-treatment-flow?start=fresh');
  };

  return (
    <div className="cta-section space-y-4">
      <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="ArrowRight"
          iconPosition="right"
          onClick={handleStartTreatment}
          className="mb-3"
        >
          {text?.primary}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          {text?.primaryDesc}
        </p>
      </div>
      <div className="bg-muted/50 border-2 border-border rounded-lg p-6">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          iconName="LayoutGrid"
          iconPosition="right"
          onClick={() => navigate('/procedure-list-overview')}
          className="mb-3"
        >
          {text?.secondary}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          {text?.secondaryDesc}
        </p>
      </div>
    </div>
  );
};

export default CTASection;