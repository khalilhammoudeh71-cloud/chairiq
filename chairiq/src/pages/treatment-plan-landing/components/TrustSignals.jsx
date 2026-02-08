import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = ({ currentLanguage }) => {
  const content = {
    en: {
      title: "What to Expect",
      signals: [
        {
          icon: "Shield",
          text: "Educational content designed by dental professionals"
        },
        {
          icon: "Eye",
          text: "Clear explanations with visual guides"
        },
        {
          icon: "Languages",
          text: "Available in English and Spanish"
        },
        {
          icon: "Clock",
          text: "Learn at your own pace"
        }
      ]
    },
    es: {
      title: "Qué Esperar",
      signals: [
        {
          icon: "Shield",
          text: "Contenido educativo diseñado por profesionales dentales"
        },
        {
          icon: "Eye",
          text: "Explicaciones claras con guías visuales"
        },
        {
          icon: "Languages",
          text: "Disponible en inglés y español"
        },
        {
          icon: "Clock",
          text: "Aprenda a su propio ritmo"
        }
      ]
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="trust-signals mb-8">
      <h3 className="text-xl font-semibold font-heading text-foreground mb-4 text-center">
        {text?.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {text?.signals?.map((signal, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={signal?.icon} size={20} className="text-primary" />
            </div>
            <p className="text-sm text-card-foreground leading-relaxed">
              {signal?.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSignals;