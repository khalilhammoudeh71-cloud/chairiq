import React from 'react';
import Icon from '../../../components/AppIcon';

const WhyThisTreatment = ({ content }) => {
  return (
    <div className="why-treatment bg-secondary/5 border-2 border-secondary/20 rounded-xl p-6 md:p-8 mb-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
          <Icon name="Heart" size={24} className="text-secondary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-card-foreground mb-4">
            {content?.whyTitle}
          </h2>
        </div>
      </div>
      <div className="space-y-4">
        {content?.whyReasons?.map((reason, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center mt-1">
              <Icon name="Check" size={16} className="text-secondary-foreground" />
            </div>
            <p className="text-base md:text-lg text-card-foreground leading-relaxed flex-1">
              {reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyThisTreatment;