import React from 'react';
import { Check, Clock, FileText, Calendar } from 'lucide-react';

/**
 * ProcedureTimeline Component
 * Displays an at-a-glance horizontal timeline with 3-6 step pills
 * Shows icons and short labels for each procedure step
 * Includes smooth CSS transitions for hover and active states
 */
const ProcedureTimeline = ({ steps = [], currentStep = -1, language = 'EN' }) => {
  // Default step icons mapping
  const getStepIcon = (stepIndex) => {
    const icons = [Check, FileText, Calendar, Clock];
    const IconComponent = icons?.[stepIndex % icons?.length];
    return IconComponent;
  };

  // Translations for common steps
  const translations = {
    EN: {
      consultation: 'Consultation',
      preparation: 'Preparation',
      procedure: 'Procedure',
      followUp: 'Follow-up',
      recovery: 'Recovery',
      complete: 'Complete'
    },
    ES: {
      consultation: 'Consulta',
      preparation: 'Preparación',
      procedure: 'Procedimiento',
      followUp: 'Seguimiento',
      recovery: 'Recuperación',
      complete: 'Completo'
    }
  };

  const t = translations?.[language];

  // Default steps if none provided
  const defaultSteps = [
    { label: t?.consultation, key: 'consultation' },
    { label: t?.preparation, key: 'preparation' },
    { label: t?.procedure, key: 'procedure' },
    { label: t?.followUp, key: 'followUp' }
  ];

  const timelineSteps = steps?.length > 0 ? steps : defaultSteps;

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max">
        {timelineSteps?.map((step, index) => {
          const StepIcon = getStepIcon(index);
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          let pillClass = 'flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ease-out';
          if (isActive) {
            pillClass += ' bg-accent-soft border-accent/40 text-accent';
          } else if (isCompleted) {
            pillClass += ' bg-success/15 border-success/30 text-success';
          } else {
            pillClass += ' bg-bg2 border-bd text-t3';
          }

          return (
            <React.Fragment key={step?.key || index}>
              {/* Step Pill with CSS transitions */}
              <button className={pillClass}>
                <StepIcon size={16} />
                <span className="text-sm font-medium whitespace-nowrap">
                  {step?.label}
                </span>
              </button>
              {/* Connector Line with transition */}
              {index < timelineSteps?.length - 1 && (
                <div
                  className={`h-0.5 w-8 transition-all ease-out ${isCompleted ? 'bg-success/30' : 'bg-bd'}`}
                  style={{ transitionDuration: '250ms' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProcedureTimeline;
