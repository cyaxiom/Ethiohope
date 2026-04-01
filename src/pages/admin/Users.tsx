import React from 'react';
import ComingSoon from '../../components/ui/ComingSoon';
import { UsersRound } from 'lucide-react';

export const Users: React.FC = () => {
  return (
    <div className="h-[calc(100vh-120px)] flex">
      <ComingSoon 
        title="User Management Coming Soon" 
        description="The comprehensive user management dashboard is currently in development."
        icon={<UsersRound className="w-16 h-16 text-blue-500 mb-6" />}
      />
    </div>
  );
};

export default Users;
