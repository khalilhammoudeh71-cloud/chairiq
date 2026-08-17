import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Sparkline from '../../../components/ui/Sparkline';

const colorMap = {
  blue: {
    bar: 'bg-accent',
    iconBg: 'bg-accent/10',
    iconBorder: 'border-accent/25',
    iconText: 'text-accent',
    spark: 'var(--accent)',
  },
  green: {
    bar: 'bg-success',
    iconBg: 'bg-success/10',
    iconBorder: 'border-success/25',
    iconText: 'text-success',
    spark: 'var(--success)',
  },
  amber: {
    bar: 'bg-warning',
    iconBg: 'bg-warning/10',
    iconBorder: 'border-warning/25',
    iconText: 'text-warning',
    spark: 'var(--warning)',
  },
  accent: {
    bar: 'bg-accent',
    iconBg: 'bg-accent/10',
    iconBorder: 'border-accent/25',
    iconText: 'text-accent',
    spark: 'var(--accent)',
  },
};

export default function StatCard({ title, value, icon: Icon, trend, suffix = '', accentColor = 'accent' }) {
  const colors = colorMap[accentColor] || colorMap.accent;

  return (
    <div className="relative overflow-hidden bg-bg1 border border-bd rounded-xl p-5 panel-glow hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-300 group">
      <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${colors.bar} opacity-70`} />
      <div className="flex items-start justify-between mb-3">
        <p className="section-label">{title}</p>
        <div className={`${colors.iconBg} p-2 rounded-lg border ${colors.iconBorder} group-hover:scale-105 transition-transform`}>
          <Icon size={16} className={colors.iconText} />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-[2rem] leading-none font-bold text-t1 tracking-tight tnum">{value}</span>
        {suffix && <span className="text-sm text-t2 font-semibold">{suffix}</span>}
        {trend && (
          <span className={`ml-auto flex items-center gap-1 text-xs font-semibold ${
            trend?.direction === 'up' ? 'text-success' : 'text-danger'
          }`}>
            {trend?.direction === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend?.value}
          </span>
        )}
      </div>
      <div className="mt-3 -mb-1 opacity-80">
        <Sparkline seed={`${title}-${value}`} color={colors.spark} height={26} />
      </div>
    </div>
  );
}
