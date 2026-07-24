import React from 'react';
import { Heart, MessageSquare, Bell, Calendar, ChevronRight, User, Loader2 } from 'lucide-react';
import SectionCard from '../../components/dashboard/SectionCard';
import StatCard from '../../components/dashboard/StatCard';
import HeroBanner from '../../components/dashboard/HeroBanner';
import { useGetParentDashboardStatsQuery } from '../../features/user/userApi';
import { Link, useNavigate } from 'react-router-dom';

// Using the same character for consistency
const heroImage = '/dashboard_hero_character_1775105958488.png';

export const ParentDashboard: React.FC = () => {
  const { data, isLoading, error } = useGetParentDashboardStatsQuery();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-bold animate-pulse">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-3xl border border-red-100 text-center">
        <h3 className="text-red-800 font-black mb-2">Failed to load dashboard</h3>
        <p className="text-red-500 text-sm font-medium">Please check your connection and try again.</p>
      </div>
    );
  }

  const stats = data?.data || {
    totalChildren: 0,
    unreadMessages: 0,
    notifications: 0,
    childrenProgress: []
  };

  return (
    <div className="animate-fadeIn pb-8 max-w-[1400px] mx-auto">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">Parent Portal</h1>
      </header>

      {/* Hero Section */}
      <HeroBanner 
        title="Stay connected to your children's progress!"
        description="See your child progress and if you have any suggestion or idea you can chat the admin"
        ctaText="Chat With Us"
        onCtaClick={() => navigate('/parent/chat')}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
        <StatCard title="Total Children" value={stats.totalChildren.toString().padStart(2, '0')} icon={Heart} color="red" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Child Progress Section */}
        <SectionCard title="Children Progress" className="h-full" viewAllPath="/parent/children">
          <div className="space-y-6">
            {stats.childrenProgress.length > 0 ? (
              stats.childrenProgress.map((child: any, idx: number) => (
                <div key={idx} className="p-5 rounded-3xl bg-blue-50/30 border border-blue-50 hover:border-blue-100 hover:bg-blue-50 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-800 tracking-tight">{child.name}</h4>
                        <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Student Profile</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-blue-600">{child.progress}%</span>
                      <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Overall</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-white rounded-full overflow-hidden mb-5 border border-blue-100 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 group-hover:from-blue-500 group-hover:to-blue-600"
                      style={{ width: `${child.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                    </div>
                    <Link to="/parent/children" className="p-2 bg-white rounded-xl shadow-sm text-blue-500 hover:text-white hover:bg-blue-500 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold mb-4 italic text-sm">No children registered yet.</p>
                <Link to="/parent/children" className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                  Register Child
                </Link>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Recent Messages Section removed */}
      </div>
    </div>
  );
};

export default ParentDashboard;
