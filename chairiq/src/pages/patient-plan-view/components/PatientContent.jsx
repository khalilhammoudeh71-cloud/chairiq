import React from 'react';

/**
 * PatientContent Component - Fixed to work with step_id-based content structure
 * @param {Array} sections - Content sections with step_id, step_order, title, body, and visual
 * @param {string} language - Current language (EN/ES)
 */
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
      {sections?.map((section, index) => (
        <div key={section?.step_id || index} className="space-y-3">
          {/* Section Title */}
          {section?.title && (
            <h3 className="text-xl font-medium" style={{ color: '#e8e9ed', fontWeight: 500 }}>
              {section?.title}
            </h3>
          )}

          {/* Section Body */}
          {section?.body && (
            <div 
              className="text-base leading-relaxed" 
              style={{ color: '#b0b3ba' }}
              dangerouslySetInnerHTML={{ __html: section?.body }}
            />
          )}

          {/* Divider between sections (except last) */}
          {index < sections?.length - 1 && (
            <div 
              className="h-px w-full" 
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientContent;