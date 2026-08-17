import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const TreatmentStepCard = ({ 
  step, 
  currentLanguage,
  onImageClick,
  personalizedContent = null,
  isPersonalized = false
}) => {
  const content = step?.content?.[currentLanguage];

  const displayExpectation = personalizedContent?.expectations?.[0]?.description || content?.expectation;
  const displayAftercare = personalizedContent?.aftercare || content?.necessity;

  return (
    <div className="treatment-step-card bg-card rounded-xl border-[5px] border-bd shadow-md overflow-hidden cursor-pointer">
      <div className="relative aspect-video bg-muted overflow-hidden group" onClick={onImageClick}>
        <Image
          src={step?.image}
          alt={step?.imageAlt}
          className="w-full h-full object-cover"
        />
        {isPersonalized && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-accent rounded-full shadow-md">
            <div className="flex items-center gap-1.5">
              <Icon name="Sparkles" size={14} className="text-accent-foreground" />
              <span className="text-xs font-semibold text-accent-foreground">
                {currentLanguage === 'en' ? 'AI Personalized' : 'Personalizado IA'}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-card-foreground mb-2">
            {content?.name}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>{content?.duration}</span>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-primary/5 border-2 border-primary/20 rounded-lg">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Icon name="Info" size={20} className="text-primary" />
            {currentLanguage === 'en' ? 'What to Expect' : 'Qué Esperar'}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {displayExpectation}
          </p>
        </div>

        <div className="space-y-2 p-4 bg-secondary/5 border-2 border-secondary/20 rounded-lg">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Icon name="AlertCircle" size={20} className="text-secondary" />
            {isPersonalized 
              ? (currentLanguage === 'en' ? 'Aftercare for You' : 'Cuidados Posteriores para Ti')
              : (currentLanguage === 'en' ? 'Why It\'s Needed' : 'Por Qué Es Necesario')}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {displayAftercare}
          </p>
        </div>

        <div className="pt-4 border-t-2 border-border">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
              <Icon name="Calendar" size={22} className="text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-card-foreground mb-1">
                {currentLanguage === 'en' ? 'Timeline Position' : 'Posición en el Cronograma'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {content?.timelineNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentStepCard;
