import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LanguageToggle from '../../components/ui/LanguageToggle';

import NextStepsCard from './components/NextStepsCard';
import SummaryCard from './components/SummaryCard';
import ContactCard from './components/ContactCard';
import { demoTreatmentPlan } from '../../data/treatmentPlan';

const TreatmentCompletion = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('chairiq-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    const handleLanguageChange = (event) => {
      setCurrentLanguage(event?.detail?.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Get completed procedure data
  const procedureCount = demoTreatmentPlan?.procedureIds?.length || 0;
  const completionTime = new Date()?.toISOString();
  const estimatedTimeSpent = `${procedureCount * 6}-${procedureCount * 8} min`;

  const pageContent = {
    en: {
      title: "Treatment Complete - ChairIQ",
      description: "Congratulations on completing your dental treatment education plan. You\'re now better prepared for your upcoming dental visits.",
      congratulations: "Congratulations!",
      mainMessage: "You\'ve completed your treatment plan",
      subtitle: "You\'ve successfully reviewed all procedures in your personalized dental education plan. You\'re now well-prepared for your upcoming dental visits.",
      reviewButton: "Review Procedures",
      homeButton: "Return to Home"
    },
    es: {
      title: "Tratamiento Completado - ChairIQ",
      description: "Felicidades por completar su plan de educación de tratamiento dental. Ahora está mejor preparado para sus próximas visitas dentales.",
      congratulations: "¡Felicidades!",
      mainMessage: "Ha completado su plan de tratamiento",
      subtitle: "Ha revisado exitosamente todos los procedimientos en su plan de educación dental personalizado. Ahora está bien preparado para sus próximas visitas dentales.",
      reviewButton: "Revisar Procedimientos",
      homeButton: "Regresar al Inicio"
    }
  };

  const content = pageContent?.[currentLanguage];

  const handleReviewProcedures = () => {
    navigate('/procedure-list-overview');
  };

  const handleReturnHome = () => {
    navigate('/treatment-plan-landing');
  };

  return (
    <>
      <Helmet>
        <title>{content?.title}</title>
        <meta name="description" content={content?.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-success/5 to-background">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="flex justify-end mb-6">
            <LanguageToggle />
          </div>

          {/* Main Completion Section */}
          <div className="text-center mb-8">
            {/* Completion Badge/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-success/10 border-4 border-success/20 flex items-center justify-center shadow-lg">
                <Icon name="CheckCircle2" size={48} className="text-success" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                {content?.congratulations}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                {content?.mainMessage}
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {content?.subtitle}
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <SummaryCard
            procedureCount={procedureCount}
            timeSpent={estimatedTimeSpent}
            completionDate={completionTime}
            currentLanguage={currentLanguage}
          />

          {/* Next Steps */}
          <NextStepsCard currentLanguage={currentLanguage} />

          {/* Primary Actions */}
          <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={handleReviewProcedures}
                iconName="BookOpen"
                iconPosition="left"
                className="px-8"
              >
                {content?.reviewButton}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleReturnHome}
                iconName="Home"
                iconPosition="left"
                className="px-8"
              >
                {content?.homeButton}
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <ContactCard currentLanguage={currentLanguage} />

          {/* Footer Information */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              {currentLanguage === 'en' 
                ? `Completed on ${new Date()?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • Treatment Plan ID: ${demoTreatmentPlan?.treatmentPlanId}`
                : `Completado el ${new Date()?.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • ID del Plan: ${demoTreatmentPlan?.treatmentPlanId}`
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TreatmentCompletion;