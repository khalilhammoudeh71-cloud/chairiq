import React from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '../AppIcon';

const PathwaySelection = ({ className = '' }) => {
  const navigate = useNavigate();

  const pathways = [
    {
      id: 'step-by-step',
      title: 'Step by Step Guide',
      description: 'Follow a guided journey through your treatment plan with detailed explanations at each stage',
      icon: 'ListOrdered',
      route: '/step-by-step-treatment-flow',
      variant: 'default'
    },
    {
      id: 'overview',
      title: 'View All Procedures',
      description: 'Explore your complete treatment plan and dive into any procedure that interests you',
      icon: 'LayoutGrid',
      route: '/procedure-list-overview',
      variant: 'outline'
    }
  ];

  return (
    <div className={`pathway-selection ${className}`}>
      <div className="grid gap-6 md:grid-cols-2">
        {pathways?.map((pathway) => (
          <button
            key={pathway?.id}
            onClick={() => navigate(pathway?.route)}
            className="group relative flex flex-col items-start p-6 bg-card border-2 border-border rounded hover:border-primary text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/10 text-primary">
              <Icon name={pathway?.icon} size={24} />
            </div>

            <h3 className="text-xl font-semibold font-heading text-card-foreground mb-2">
              {pathway?.title}
            </h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {pathway?.description}
            </p>

            <div className="mt-auto flex items-center text-primary font-medium text-sm">
              <span>Get Started</span>
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PathwaySelection;