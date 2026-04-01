import React from 'react';
import ComingSoon from '../../components/ui/ComingSoon';
import { ShieldAlert } from 'lucide-react';

export const RoleManagement: React.FC = () => {
  return (
    <div className="h-[calc(100vh-120px)] flex">
      <ComingSoon 
        title="Role Management Coming Soon" 
        description="We are currently building the advanced role management module. Check back later for updates."
        icon={<ShieldAlert className="w-16 h-16 text-blue-500 mb-6" />}
      />
    </div>
  );
};

export default RoleManagement;
