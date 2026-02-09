import React from 'react';
import Icon from '../../../components/AppIcon';

const WhatToExpect = ({ content, isPersonalized = false, adaptedFor = null, language = 'en' }) => {
  return (
    <div className="what-to-expect bg-card rounded-xl p-6 md:p-8 shadow-subtle mb-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="Calendar" size={24} className="text-accent" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-card-foreground mb-2">
            {content?.expectTitle}
          </h2>
          <p className="text-base text-muted-foreground">
            {content?.expectSubtitle}
          </p>
          {isPersonalized && adaptedFor && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
              <Icon name="Sparkles" size={16} className="text-accent" />
              <span className="text-xs font-medium text-accent">
                {language === 'en' 
                  ? `Adapted for ${adaptedFor?.learningPace} learners` 
                  : `Adaptado para estudiantes ${adaptedFor?.learningPace === 'fast' ? 'rápidos' : adaptedFor?.learningPace === 'slow' ? 'lentos' : 'moderados'}`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {content?.expectSteps?.map((step, index) => (
          <div key={index} className="relative pl-8 pb-6 border-l-2 border-border last:border-l-0 last:pb-0">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
              {index + 1}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold font-heading text-card-foreground">
                {step?.phase}
              </h3>
              <p className="text-base text-card-foreground leading-relaxed">
                {step?.description}
              </p>
              {step?.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Icon name="Clock" size={16} />
                  <span>{step?.duration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatToExpect;
