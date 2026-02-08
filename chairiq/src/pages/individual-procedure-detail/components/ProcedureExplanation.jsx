import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcedureExplanation = ({ content, isPersonalized = false, language = 'en' }) => {
  return (
    <div className="procedure-explanation bg-card rounded-xl p-6 md:p-8 shadow-subtle mb-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Info" size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-card-foreground mb-4">
            {content?.explanationTitle}
          </h2>
          {isPersonalized && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full mb-2">
              <Icon name="Sparkles" size={16} className="text-blue-500" />
              <span className="text-xs font-medium text-blue-500">
                {language === 'en' ? 'Personalized for you' : 'Personalizado para ti'}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="prose prose-lg max-w-none">
        <p className="text-base md:text-lg text-card-foreground leading-relaxed whitespace-pre-line">
          {content?.explanation}
        </p>
      </div>
    </div>
  );
};

export default ProcedureExplanation;