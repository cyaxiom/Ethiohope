import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue',
  className 
}) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="space-y-1">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>
      </div>
      {Icon && (
        <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
