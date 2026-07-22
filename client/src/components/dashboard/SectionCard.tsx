import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  viewAllPath?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  viewAllPath,
  className,
  headerAction 
}) => {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-50 h-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
        </div>
        {viewAllPath ? (
          <a 
            href={viewAllPath} 
            className="text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors"
          >
            View All
          </a>
        ) : headerAction}
      </div>
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
