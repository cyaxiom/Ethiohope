import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Activity, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  User as UserIcon,
  Mail,
  Phone,
  Clock
} from 'lucide-react';
import { 
  useGetDashboardStatsQuery, 
  useGetParentsWithChildrenQuery,
  useGetTeachersQuery,
  ParentWithChildren,
  ChildDetail
} from '../../features/dashboard/dashboardApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parents' | 'teachers'>('parents');
  
  const { 
    data: stats, 
    isLoading: isStatsLoading, 
    isError: isStatsError, 
    isFetching: isStatsFetching, 
    refetch: refetchStats 
  } = useGetDashboardStatsQuery();

  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const activeRole = useSelector((state: RootState) => state.auth.activeRole);
  const canSeeUserDetails = permissions.includes('user.detail.view') || activeRole === 'super_admin';

  const {
    data: parentsData,
    isLoading: isParentsLoading,
    isError: isParentsError,
    refetch: refetchParents
  } = useGetParentsWithChildrenQuery(undefined, {
    skip: !canSeeUserDetails || activeTab !== 'parents'
  });

  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    isError: isTeachersError,
    refetch: refetchTeachers
  } = useGetTeachersQuery(undefined, {
    skip: !canSeeUserDetails || activeTab !== 'teachers'
  });

  const handleRefresh = () => {
    refetchStats();
    if (canSeeUserDetails) {
      if (activeTab === 'parents') refetchParents();
      else refetchTeachers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, Admin 👋</h1>
          <p className="text-gray-500 mt-1">Manage your platform and view real-time insights.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isStatsFetching}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
        >
          <RefreshCw className={`w-4 h-4 ${isStatsFetching ? 'animate-spin' : ''}`} />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isStatsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : isStatsError ? (
          <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100">
            Failed to load dashboard statistics. Please try again later.
          </div>
        ) : (
          <>
            <StatCard 
              title="Total Parents" 
              value={stats?.totalParents?.toString() || "0"} 
              icon={<UserIcon className="w-6 h-6" />}
              trend="Default List"
              trendLabel="click to view"
              color="blue"
              isActive={activeTab === 'parents'}
              onClick={() => setActiveTab('parents')}
            />
            <StatCard 
              title="Total Teachers" 
              value={stats?.totalTeachers?.toString() || "0"} 
              icon={<GraduationCap className="w-6 h-6" />}
              trend="View Teachers"
              trendLabel="click to switch"
              color="indigo"
              isActive={activeTab === 'teachers'}
              onClick={() => setActiveTab('teachers')}
            />
            <StatCard 
              title="Total Users" 
              value={stats?.totalUsers?.toString() || "0"} 
              icon={<Users className="w-6 h-6" />}
              trend="Real-time"
              trendLabel="total accounts"
              color="emerald"
            />
            <StatCard 
              title="Active Users" 
              value={stats?.activeUsers?.toString() || "0"} 
              icon={<Activity className="w-6 h-6" />}
              trend="Real-time"
              trendLabel="current activity"
              color="emerald"
            />
          </>
        )}
      </div>

      {/* Detail List Section */}
      {canSeeUserDetails ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${activeTab === 'parents' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {activeTab === 'parents' ? <UserIcon className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {activeTab === 'parents' ? 'Parent & Student Directory' : 'Instructor Directory'}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTab === 'parents' ? 'Browse parents and their linked children' : 'Browse registered teachers and instructors'}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${activeTab === 'parents' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'}`}>
              {activeTab === 'parents' ? (parentsData?.length || 0) : (teachersData?.length || 0)} Total
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {/* Loading State for Tab Content */}
            {(isParentsLoading || isTeachersLoading) ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Fetching records...</p>
              </div>
            ) : (activeTab === 'parents') ? (
              /* Parent List */
              parentsData && parentsData.length > 0 ? (
                parentsData.map((parent) => (
                  <ParentRow key={parent._id} parent={parent} />
                ))
              ) : (
                <div className="p-12 text-center text-gray-500 italic">No parent records found.</div>
              )
            ) : (
              /* Teacher List */
              teachersData && teachersData.length > 0 ? (
                teachersData.map((teacher) => (
                  <TeacherRow key={teacher._id} teacher={teacher} />
                ))
              ) : (
                <div className="p-12 text-center text-gray-500 italic">No teacher records found.</div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold">Access Restricted (ABAC)</h3>
          <p className="text-sm mt-1">Missing required attribute: 'user.detail.view'</p>
          <p className="text-xs mt-2 opacity-70">Role: {activeRole} | Token Permissions Cached</p>
        </div>
      )}
    </div>
  );
};

// Teacher Row Component
const TeacherRow: React.FC<{ teacher: any }> = ({ teacher }) => {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {teacher.firstname[0]}{teacher.lastname[0]}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{teacher.firstname} {teacher.lastname}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Mail className="w-3 h-3" /> {teacher.email}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Phone className="w-3 h-3" /> {teacher.phone || 'No phone'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${teacher.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {teacher.status}
          </span>
          {teacher.lastLogin && (
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
              <Clock className="w-2 h-2" /> {new Date(teacher.lastLogin).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Parent Row Component with Toggle
const ParentRow: React.FC<{ parent: ParentWithChildren }> = ({ parent }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="transition-colors hover:bg-gray-50/50">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {parent.firstname[0]}{parent.lastname[0]}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{parent.firstname} {parent.lastname}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Mail className="w-3 h-3" /> {parent.email}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3" /> {parent.phone || 'N/A'}
              </span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-medium">
                {parent.parentType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Children</p>
            <p className="text-sm font-bold text-blue-600">{parent.children.length}</p>
          </div>
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Children List */}
      {isOpen && (
        <div className="px-4 pb-4 pt-2 bg-gray-50/30">
          <div className="ml-14 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parent.children.length > 0 ? (
              parent.children.map((child) => (
                <div key={child._id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{child.firstname} {child.lastname}</p>
                      <p className="text-[11px] text-gray-500">Grade {child.grade} • {child.gender}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${child.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {child.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic col-span-full py-2">No children registered for this parent.</p>
            )}
          </div>
        </div>
      )}
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
  isActive?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendLabel, color, isActive, onClick }) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  const activeStyles = isActive 
    ? `ring-2 ring-offset-2 ${color === 'blue' ? 'ring-blue-500' : color === 'indigo' ? 'ring-indigo-500' : 'ring-emerald-500'} scale-[1.02] shadow-md` 
    : 'hover:shadow-md hover:scale-[1.01]';

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all cursor-pointer group ${activeStyles}`}
    >
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

export default AdminDashboard;

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
