import React from 'react';

import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ButtonPrimary from '../../../components/ui/ButtonPrimary';

export default function PendingActionsCard({ actions = [] }) {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-danger/10 text-danger border-danger/30';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'low':
        return 'bg-accent/10 text-accent border-accent/30';
      default:
        return 'bg-bg3 text-t3 border-bd';
    }
  };

  const handleActionClick = (action) => {
    if (action?.publicToken) {
      navigate(`/p/${action?.publicToken}`);
    }
  };

  if (!actions || actions?.length === 0) {
    return (
      <Card>
        <h2 className="text-2xl font-bold text-t1 mb-6">Pending Actions</h2>
        <div className="text-center py-8 text-t2">
          <p>All caught up! No pending actions.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-t1 mb-6">Pending Actions</h2>
      <div className="space-y-4">
        {actions?.map((action) => (
          <Card
            key={action?.id}
            padding="p-4"
            hover={true}
            className="bg-bg1"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-t1 font-semibold">{action?.title}</h3>
                <p className="text-t2 text-sm mt-1">{action?.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={action?.priority === 'high' ? 'danger' : 'warning'}>
                    {action?.priority}
                  </Badge>
                </div>
              </div>
              <ButtonPrimary size="sm">
                Take Action
              </ButtonPrimary>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}