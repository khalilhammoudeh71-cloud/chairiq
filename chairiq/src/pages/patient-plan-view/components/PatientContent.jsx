import React from 'react';

const PatientContent = ({ sections = [], language = 'EN' }) => {
  if (!sections || sections?.length === 0) {
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
        <p className="text-sm" style={{ color: '#fbbf24' }}>
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
              <h3 className="text-xl font-medium" style={{ color: '#e8e9ed', fontWeight: 500 }}>
                {section?.title}
              </h3>
            )}

            {bodyText && (
              <div 
                className="text-base leading-relaxed" 
                style={{ color: '#b0b3ba' }}
                dangerouslySetInnerHTML={{ __html: bodyText }}
              />
            )}

            {section?.whatYouMayFeel && (
              <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(107, 124, 232, 0.06)', border: '1px solid rgba(107, 124, 232, 0.12)' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#8b9aec' }}>
                  {language === 'EN' ? 'What you may feel' : 'Lo que puede sentir'}
                </p>
                <p className="text-sm" style={{ color: '#b0b3ba' }}>{section?.whatYouMayFeel}</p>
              </div>
            )}

            {section?.whyItMatters && (
              <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.12)' }}>
                <p className="text-sm font-medium mb-1" style={{ color: '#10b981' }}>
                  {language === 'EN' ? 'Why it matters' : 'Por qué es importante'}
                </p>
                <p className="text-sm" style={{ color: '#b0b3ba' }}>{section?.whyItMatters}</p>
              </div>
            )}

            {section?.bullets && section?.bullets?.length > 0 && (
              <ul className="space-y-2 ml-4">
                {section?.bullets?.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-2">
                    <span style={{ color: '#8b9aec', marginTop: '0.25rem' }}>•</span>
                    <span style={{ color: '#b0b3ba', lineHeight: '1.6' }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section?.steps && section?.steps?.length > 0 && (
              <ol className="space-y-2 ml-4">
                {section?.steps?.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-3">
                    <span 
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs"
                      style={{ backgroundColor: 'rgba(107, 124, 232, 0.2)', color: '#8b9aec' }}
                    >
                      {stepIndex + 1}
                    </span>
                    <span style={{ color: '#b0b3ba', lineHeight: '1.6' }}>{step}</span>
                  </li>
                ))}
              </ol>
            )}

            {index < sections?.length - 1 && (
              <div 
                className="h-px w-full" 
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PatientContent;
