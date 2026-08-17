import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Icon from '../../../components/AppIcon';

const colorMap = {
  blue: {
    border: 'border-l-accent',
    iconBg: 'bg-accent/10',
    iconBorder: 'border-accent/20',
    iconText: 'text-accent',
  },
  green: {
    border: 'border-l-success',
    iconBg: 'bg-success/10',
    iconBorder: 'border-success/20',
    iconText: 'text-success',
  },
  amber: {
    border: 'border-l-warning',
    iconBg: 'bg-warning/10',
    iconBorder: 'border-warning/20',
    iconText: 'text-warning',
  },
  accent: {
    border: 'border-l-accent',
    iconBg: 'bg-accent/10',
    iconBorder: 'border-accent/20',
    iconText: 'text-accent',
  },
};

export default function StatCard({ title, value, icon: Icon, trend, suffix = '', accentColor = 'accent' }) {
  const colors = colorMap[accentColor] || colorMap.accent;

  return (
    <div className={`bg-bg2 border border-bd border-l-[3px] ${colors.border} rounded-2xl p-6 relative card-highlight hover:border-accent/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-t3 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-5xl font-bold text-t1 tracking-tight">
              {value}
              {suffix && <span className="text-2xl ml-1 text-t2 font-semibold">{suffix}</span>}
            </h3>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${
              trend?.direction === 'up' ? 'text-success' : 'text-danger'
            }`}>
              {trend?.direction === 'up' ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{trend?.value}</span>
            </div>
          )}
        </div>
        <div className={`${colors.iconBg} p-4 rounded-full border ${colors.iconBorder}`}>
          <Icon size={32} className={colors.iconText} />
        </div>
      </div>
    </div>
  );
}