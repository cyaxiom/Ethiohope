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
  Clock,
  RotateCcw,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { 
  useGetDashboardStatsQuery, 
  useGetParentsWithChildrenQuery,
  useGetTeachersQuery,
  useResetDatabaseMutation,
  ParentWithChildren,
  ChildDetail
} from '../../features/dashboard/dashboardApi';
import { toast } from 'sonner';
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
  const canResetSystem = activeRole === 'super_admin';

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

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

  const [resetDatabase, { isLoading: isResetting }] = useResetDatabaseMutation();

  const handleRefresh = () => {
    refetchStats();
    if (canSeeUserDetails) {
      if (activeTab === 'parents') refetchParents();
      else refetchTeachers();
    }
  };

  const handleResetSystem = async () => {
    if (confirmInput !== 'RESET') {
      toast.error('Please type RESET to confirm');
      return;
    }
    
    try {
      const result = await resetDatabase().unwrap();
      toast.success(result.message);
      setIsResetModalOpen(false);
      setConfirmInput('');
      window.location.reload(); // Reload to ensure clean state
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reset system');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Welcome back, Admin</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your platform and view real-time insights.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {canResetSystem && (
            <button 
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-all border border-red-100"
              title="Factory Reset System"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset DB</span>
            </button>
          )}
          <button 
            onClick={handleRefresh}
            disabled={isStatsFetching}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 ${isStatsFetching ? 'animate-spin' : ''}`} />
            <span className="text-sm sm:text-base">Refresh</span>
          </button>
        </div>
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
              trend={canSeeUserDetails ? "Default List" : "Parents"}
              trendLabel={canSeeUserDetails ? "click to view" : "registered"}
              color="blue"
              isActive={canSeeUserDetails && activeTab === 'parents'}
              onClick={canSeeUserDetails ? () => setActiveTab('parents') : undefined}
            />
            <StatCard 
              title="Total Teachers" 
              value={stats?.totalTeachers?.toString() || "0"} 
              icon={<GraduationCap className="w-6 h-6" />}
              trend={canSeeUserDetails ? "View Teachers" : "Instructors"}
              trendLabel={canSeeUserDetails ? "click to switch" : "registered"}
              color="indigo"
              isActive={canSeeUserDetails && activeTab === 'teachers'}
              onClick={canSeeUserDetails ? () => setActiveTab('teachers') : undefined}
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
      ) : null}

      {/* Database Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-600 p-8 text-center text-white relative">
              <div className="absolute top-4 right-4 cursor-pointer hover:opacity-70" onClick={() => setIsResetModalOpen(false)}>✕</div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Factory Reset</h3>
              <p className="text-red-100 text-sm mt-2 opacity-90">This action is irreversible and will wipe the system.</p>
            </div>
            
            <div className="p-8">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6">
                <p className="text-red-700 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                  <Trash2 className="w-3 h-3" />
                  What will be deleted?
                </p>
                <ul className="text-xs text-red-600 space-y-1 font-medium list-disc list-inside opacity-80">
                  <li>All Student/Child profiles</li>
                  <li>All Program, Phase, and Batch data</li>
                  <li>All Course content and files</li>
                  <li>All Enrollment and Payment history</li>
                  <li>All Chat messages and Group history</li>
                  <li>All non-admin user accounts</li>
                </ul>
              </div>

              <p className="text-gray-500 text-sm mb-4 text-center">
                Type <span className="font-black text-red-600 select-none">RESET</span> below to confirm this destructive operation.
              </p>

              <input 
                type="text" 
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
                placeholder="Type RESET here..."
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-500 focus:bg-white outline-none text-center font-black tracking-widest text-red-600 transition-all mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => { setIsResetModalOpen(false); setConfirmInput(''); }}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleResetSystem}
                  disabled={isResetting || confirmInput !== 'RESET'}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isResetting ? 'Wiping System...' : 'WIPE SYSTEM'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Teacher Row Component
const TeacherRow: React.FC<{ teacher: any }> = ({ teacher }) => {
  return (
    <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
          {teacher.firstname[0]}{teacher.lastname[0]}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">{teacher.firstname} {teacher.lastname}</h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
              <Mail className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{teacher.email}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Phone className="w-3 h-3 flex-shrink-0" /> {teacher.phone || 'No phone'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:justify-end">
        <div className="text-left sm:text-right">
          <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${teacher.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {teacher.status}
          </span>
          {teacher.lastLogin && (
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 sm:justify-end">
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
        className="p-4 flex items-start sm:items-center justify-between gap-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
            {parent.firstname[0]}{parent.lastname[0]}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">{parent.firstname} {parent.lastname}</h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
                <Mail className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{parent.email}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3 flex-shrink-0" /> {parent.phone || 'N/A'}
              </span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-medium w-fit">
                {parent.parentType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
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
          <div className="ml-0 sm:ml-14 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parent.children.length > 0 ? (
              parent.children.map((child) => (
                <div key={child._id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{child.firstname} {child.lastname}</p>
                      <p className="text-[11px] text-gray-500">Grade {child.grade} • {child.gender}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${child.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
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
