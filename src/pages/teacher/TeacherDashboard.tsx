import React from 'react';
import { Users, Shield, Activity, TrendingUp, MoreVertical, RefreshCw } from 'lucide-react';
import { useGetInstructorStatsQuery } from '../../features/dashboard/dashboardApi';

export const TeacherDashboard: React.FC = () => {
  const { data, isLoading, isError, isFetching, refetch } = useGetInstructorStatsQuery();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, Instructor 👋</h1>
          <p className="text-gray-500 mt-1">Here is what's happening today in your classes.</p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : isError ? (
          <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100">
            Failed to load dashboard statistics. Please try again later.
          </div>
        ) : (
          <>
            <StatCard 
              title="Total Users" 
              value={data?.totalUsers?.toString() || "0"} 
              icon={<Users className="w-6 h-6" />}
              trend="Real-time"
              trendLabel="total registered"
              color="blue"
            />
            <StatCard 
              title="Total Roles" 
              value={data?.totalRoles?.toString() || "0"} 
              icon={<Shield className="w-6 h-6" />}
              trend="Real-time"
              trendLabel="system roles"
              color="indigo"
            />
            <StatCard 
              title="Active Users" 
              value={data?.activeUsers?.toString() || "0"} 
              icon={<Activity className="w-6 h-6" />}
              trend="Real-time"
              trendLabel="active status"
              color="emerald"
            />
          </>
        )}
      </div>

      {/* Dashboard Content area (e.g. charts / recent activity placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
         <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-gray-800">Engagement Breakdown</h2>
               <button className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
                  <MoreVertical className="w-5 h-5" />
               </button>
            </div>
            
            <div className="flex items-center justify-center h-[300px] border-2 border-dashed border-gray-100 rounded-xl text-gray-400">
               <div className="text-center">
                 <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                 <p className="font-medium">Chart rendering placeholder</p>
                 <p className="text-sm">Connect data source to view</p>
               </div>
            </div>
         </div>
         
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">New user registered</p>
                    <p className="text-xs text-gray-400 mt-0.5">{i * 10} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

// Extracted Subcomponent for Stats
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendLabel: string;
  color: 'blue' | 'indigo' | 'emerald';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendLabel, color }) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
          {trend}
        </span>
        <span className="text-gray-400">{trendLabel}</span>
      </div>
    </div>
  );
};

// Basic Skeleton Loader for StatCard
const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-3 w-1/2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
    </div>
    <div className="flex gap-2 items-center mt-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default TeacherDashboard;
