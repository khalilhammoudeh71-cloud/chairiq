import React from 'react';
import { Plus, BarChart3, BookOpen, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import ButtonSecondary from '../../../components/ui/ButtonSecondary';

export default function ShortcutsCard() {
  const navigate = useNavigate();

  const shortcuts = [
    {
      id: 1,
      title: 'Create New Plan',
      description: 'Start a new treatment plan',
      icon: Plus,
      path: '/create-patient-plan',
    },
    {
      id: 2,
      title: 'View Analytics',
      description: 'Check engagement metrics',
      icon: BarChart3,
      path: '/dentist-admin-analytics-dashboard',
    },
    {
      id: 3,
      title: 'Treatment Content',
      description: 'View all treatment explanations',
      icon: BookOpen,
      path: '/treatment-content-management-dashboard',
    },
    {
      id: 4,
      title: 'Modify Plans',
      description: 'Edit existing treatment plans',
      icon: Edit3,
      path: '/admin-home-dashboard',
    },
  ];

  return (
    <Card>
      <h2 className="text-2xl font-bold text-t1 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {shortcuts?.map((shortcut, index) => (
          <ButtonSecondary
            key={index}
            onClick={() => navigate(shortcut?.path)}
            className="flex items-center gap-3 justify-start h-auto py-4"
          >
            {shortcut?.icon && <shortcut.icon size={20} className="text-accent" />}
            <div className="text-left">
              <div className="font-semibold text-t1">{shortcut?.title}</div>
              <div className="text-xs text-t2">{shortcut?.description}</div>
            </div>
          </ButtonSecondary>
        ))}
      </div>
    </Card>
  );
}