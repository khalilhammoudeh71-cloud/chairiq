import React from 'react';

const WelcomeHeader = ({ patientName, treatmentTitle, currentLanguage }) => {
  const content = {
    en: {
      greeting: "Welcome",
      subtitle: "Your Personalized Treatment Plan"
    },
    es: {
      greeting: "Bienvenido",
      subtitle: "Su Plan de Tratamiento Personalizado"
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="welcome-header text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-2">
        {text?.greeting}, {patientName}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground font-medium">
        {text?.subtitle}
      </p>
      <div className="mt-4 w-20 h-1 bg-primary mx-auto rounded-full" />
    </div>
  );
};

export default WelcomeHeader;