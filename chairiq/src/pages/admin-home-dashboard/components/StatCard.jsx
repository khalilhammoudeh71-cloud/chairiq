import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Icon from '../../../components/AppIcon';


export default function StatCard({ title, value, icon: Icon, trend, suffix = '' }) {
  return (
    <div className="bg-bg2 border border-bd rounded-2xl p-6 relative card-highlight hover:border-accent/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-t3 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-semibold text-t1 tracking-tight">
              {value}
              {suffix && <span className="text-2xl ml-1 text-t2">{suffix}</span>}
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
        <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
          <Icon size={28} className="text-accent" />
        </div>
      </div>
    </div>
  );
}