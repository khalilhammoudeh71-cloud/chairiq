import React from 'react';
import Icon from '../../../components/AppIcon';

const NextStepsCard = ({ currentLanguage = 'en' }) => {
  const content = {
    en: {
      title: 'What\'s Next?',
      subtitle: 'Your educational journey is complete, but your dental care continues.',
      steps: [
        {
          icon: 'Calendar',
          title: 'Schedule Your Appointments',
          description: 'Contact your dental office to schedule the procedures you\'ve learned about.'
        },
        {
          icon: 'MessageSquare',
          title: 'Discuss with Your Dentist',
          description: 'Share any questions or concerns you have about your upcoming treatments.'
        },
        {
          icon: 'BookOpen',
          title: 'Review Anytime',
          description: 'You can always return to review procedure information before your appointments.'
        },
        {
          icon: 'Heart',
          title: 'Maintain Oral Health',
          description: 'Continue your daily oral hygiene routine as recommended by your dental team.'
        }
      ]
    },
    es: {
      title: '¿Qué Sigue?',
      subtitle: 'Su viaje educativo está completo, pero su cuidado dental continúa.',
      steps: [
        {
          icon: 'Calendar',
          title: 'Programe Sus Citas',
          description: 'Contacte a su consultorio dental para programar los procedimientos que ha aprendido.'
        },
        {
          icon: 'MessageSquare',
          title: 'Hable con Su Dentista',
          description: 'Comparta cualquier pregunta o inquietud sobre sus próximos tratamientos.'
        },
        {
          icon: 'BookOpen',
          title: 'Revise Cuando Guste',
          description: 'Siempre puede regresar a revisar la información antes de sus citas.'
        },
        {
          icon: 'Heart',
          title: 'Mantenga Su Salud Oral',
          description: 'Continue su rutina diaria de higiene oral como recomienda su equipo dental.'
        }
      ]
    }
  };

  const text = content?.[currentLanguage];

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-card-foreground mb-2">
          {text?.title}
        </h2>
        <p className="text-muted-foreground">
          {text?.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {text?.steps?.map((step, index) => (
          <div 
            key={index}
            className="flex gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name={step?.icon} size={24} className="text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">
                {step?.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextStepsCard;