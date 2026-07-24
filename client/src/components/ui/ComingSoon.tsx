import React from 'react';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title = "Coming Soon", 
  description = "This feature is currently under development.",
  icon = <Construction className="w-16 h-16 text-blue-500 mb-6" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      {icon}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  );
};

export default ComingSoon;
