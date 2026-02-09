import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const ContextualNavigation = ({ 
  showPrevious = false,
  showNext = false,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  previousRoute = null,
  nextRoute = null,
  onPrevious = null,
  onNext = null,
  position = 'bottom',
  className = '' 
}) => {
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (previousRoute) {
      navigate(previousRoute);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextRoute) {
      navigate(nextRoute);
    }
  };

  const positionClasses = {
    bottom: 'mt-8',
    top: 'mb-8',
    sticky: 'sticky bottom-0 bg-background py-4 border-t border-border z-10'
  };

  return (
    <div className={`contextual-navigation ${positionClasses?.[position]} ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {showPrevious && (
          <Button
            variant="default"
            size="lg"
            onClick={handlePrevious}
            iconName="ChevronLeft"
            iconPosition="left"
            className="flex-1 sm:flex-none min-w-[140px] bg-accent hover:brightness-110 text-white"
          >
            {previousLabel}
          </Button>
        )}

        {!showPrevious && <div className="flex-1 sm:flex-none" />}

        {showNext && (
          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            iconName="ChevronRight"
            iconPosition="right"
            className="flex-1 sm:flex-none min-w-[140px] bg-accent hover:brightness-110 text-white"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContextualNavigation;