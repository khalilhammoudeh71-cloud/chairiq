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

          return (
            <React.Fragment key={step?.key || index}>
              {/* Step Pill with CSS transitions */}
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border"
                style={{
                  ...(isActive
                    ? {
                        backgroundColor: 'rgba(107, 124, 232, 0.2)',
                        borderColor: 'rgba(107, 124, 232, 0.4)',
                        color: '#8b9aec'
                      }
                    : isCompleted
                    ? {
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        borderColor: 'rgba(34, 197, 94, 0.3)',
                        color: '#4ade80'
                      }
                    : {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        color: '#9ca3af'
                      })
                }}
              >
                <StepIcon size={16} />
                <span className="text-sm font-medium whitespace-nowrap">
                  {step?.label}
                </span>
              </button>
              {/* Connector Line with transition */}
              {index < timelineSteps?.length - 1 && (
                <div
                  className="h-0.5 w-8 transition-all ease-out"
                  style={{
                    transitionDuration: '250ms',
                    backgroundColor: isCompleted
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'rgba(255,255,255,0.08)'
                  }}
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