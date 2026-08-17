import React from 'react';

const PatientContent = ({ sections = [], language = 'EN' }) => {
  if (!sections || sections?.length === 0) {
    return (
      <div className="rounded-xl p-4 bg-warning/10 border border-warning/20">
        <p className="text-sm text-warning">
          {language === 'EN' ? 'Content unavailable' : 'Contenido no disponible'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-prose">
      {sections?.map((section, index) => {
        const bodyText = section?.body || section?.whatWeDo || section?.description || section?.content || '';
        
        return (
          <div key={section?.step_id || index} className="space-y-3">
            {section?.title && (
              <h3 className="text-xl font-medium text-t1">
                {section?.title}
              </h3>
            )}

            {bodyText && (
              <div 
                className="text-base leading-relaxed text-t2"
                dangerouslySetInnerHTML={{ __html: bodyText }}
              />
            )}

            {section?.whatYouMayFeel && (
              <div className="rounded-lg p-3 bg-accent-soft border border-accent/12">
                <p className="text-sm font-medium mb-1 text-accent">
                  {language === 'EN' ? 'What you may feel' : 'Lo que puede sentir'}
                </p>
                <p className="text-sm text-t2">{section?.whatYouMayFeel}</p>
              </div>
            )}

            {section?.whyItMatters && (
              <div className="rounded-lg p-3 bg-success/8 border border-success/12">
                <p className="text-sm font-medium mb-1 text-success">
                  {language === 'EN' ? 'Why it matters' : 'Por qué es importante'}
                </p>
                <p className="text-sm text-t2">{section?.whyItMatters}</p>
              </div>
            )}

            {section?.bullets && section?.bullets?.length > 0 && (
              <ul className="space-y-2 ml-4">
                {section?.bullets?.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span className="text-t2 leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section?.steps && section?.steps?.length > 0 && (
              <ol className="space-y-2 ml-4">
                {section?.steps?.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-3">
                    <span 
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs bg-accent-soft text-accent"
                    >
                      {stepIndex + 1}
                    </span>
                    <span className="text-t2 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {index < sections?.length - 1 && (
              <div className="h-px w-full bg-bd" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PatientContent;
