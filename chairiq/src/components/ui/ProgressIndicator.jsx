import React from 'react';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 1, 
  variant = 'bar',
  className = '' 
}) => {
  const percentage = (currentStep / totalSteps) * 100;

  if (variant === 'numeric') {
    return (
      <div className={`progress-indicator-numeric ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-semibold text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-smooth rounded-full"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`progress-indicator-bar ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-smooth rounded-full"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;