import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
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
  Trash2,
  Edit2,
  X,
  Search,
  Baby,
  ExternalLink,
  CreditCard,
  BookOpen,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import {
  useGetDashboardStatsQuery,
  useGetParentsWithChildrenQuery,
  useGetTeachersQuery,
  useGetChildrenDirectoryQuery,
  useGetAdultStudentsQuery,
  useGetPersonEnrollmentsQuery,
  useResetDatabaseMutation,
  useAdminUpdateChildMutation,
  useAdminDeleteChildMutation,
  ParentWithChildren,
  ChildDetail,
  AdultStudent,
  TeacherDetail,
  PersonEnrollment,
} from '../../features/dashboard/dashboardApi';
import {
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from '../../features/user/userApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';

type DirectoryTab = 'parents' | 'children' | 'adults' | 'instructors';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('parents');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [enrollmentTarget, setEnrollmentTarget] = useState<{
    label: string;
    parentId?: string;
    childId?: string;
    userId?: string;
  } | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    isFetching: isStatsFetching,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery();

  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const activeRole = useSelector((state: RootState) => state.auth.activeRole);
  const canSeeUserDetails = permissions.includes('user.detail.view') || activeRole === 'super_admin';
  const canResetSystem = activeRole === 'super_admin';
  const canEditChild = hasPermission(permissions, 'child.update') || activeRole === 'super_admin';
  const canDeleteChild = hasPermission(permissions, 'child.delete') || activeRole === 'super_admin';
  const canUpdateUser = hasPermission(permissions, 'user.update') || activeRole === 'super_admin';
  const canDeleteUser = hasPermission(permissions, 'user.delete') || activeRole === 'super_admin';
  const canReadPayments = hasPermission(permissions, 'payment.read') || activeRole === 'super_admin';
  const canReadUsers = hasPermission(permissions, 'user.read') || activeRole === 'super_admin';

  const searchParam = debouncedSearch ? { search: debouncedSearch } : undefined;

  const {
    data: parentsData,
    isLoading: isParentsLoading,
    isFetching: isParentsFetching,
    refetch: refetchParents,
  } = useGetParentsWithChildrenQuery(searchParam, {
    skip: !canSeeUserDetails || activeTab !== 'parents',
  });

  const {
    data: childrenData,
    isLoading: isChildrenLoading,
    isFetching: isChildrenFetching,
    refetch: refetchChildren,
  } = useGetChildrenDirectoryQuery(searchParam, {
    skip: !canSeeUserDetails || activeTab !== 'children',
  });

  const {
    data: adultsData,
    isLoading: isAdultsLoading,
    isFetching: isAdultsFetching,
    refetch: refetchAdults,
  } = useGetAdultStudentsQuery(searchParam, {
    skip: !canSeeUserDetails || activeTab !== 'adults',
  });

  const {
    data: teachersData,
    isLoading: isTeachersLoading,
    isFetching: isTeachersFetching,
    refetch: refetchTeachers,
  } = useGetTeachersQuery(searchParam, {
    skip: !canSeeUserDetails || activeTab !== 'instructors',
  });

  const [resetDatabase, { isLoading: isResetting }] = useResetDatabaseMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const handleRefresh = () => {
    refetchStats();
    if (!canSeeUserDetails) return;
    if (activeTab === 'parents') refetchParents();
    if (activeTab === 'children') refetchChildren();
    if (activeTab === 'adults') refetchAdults();
    if (activeTab === 'instructors') refetchTeachers();
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
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reset system');
    }
  };

  const handleToggleUserStatus = async (userId: string, current: string) => {
    const next = current === 'active' ? 'suspended' : 'active';
    try {
      await updateUserStatus({ userId, status: next }).unwrap();
      toast.success(`Account marked ${next}`);
      handleRefresh();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id).unwrap();
      toast.success('User deleted');
      setUserToDelete(null);
      handleRefresh();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete user');
    }
  };

  const tabMeta = useMemo(
    () => ({
      parents: {
        title: 'Parents',
        subtitle: 'Parents and their linked children',
        count: parentsData?.length ?? stats?.totalParents ?? 0,
        icon: UserIcon,
        color: 'blue' as const,
      },
      children: {
        title: 'Children / Students',
        subtitle: 'All child login accounts across parents',
        count: childrenData?.length ?? stats?.totalChildren ?? 0,
        icon: Baby,
        color: 'emerald' as const,
      },
      adults: {
        title: 'Adult students',
        subtitle: 'Self-enrolled adult student accounts',
        count: adultsData?.length ?? stats?.totalAdultStudents ?? 0,
        icon: BookOpen,
        color: 'violet' as const,
      },
      instructors: {
        title: 'Instructors',
        subtitle: 'Teachers and instructors',
        count: teachersData?.length ?? stats?.totalTeachers ?? 0,
        icon: GraduationCap,
        color: 'indigo' as const,
      },
    }),
    [parentsData, childrenData, adultsData, teachersData, stats]
  );

  const listLoading =
    (activeTab === 'parents' && (isParentsLoading || isParentsFetching)) ||
    (activeTab === 'children' && (isChildrenLoading || isChildrenFetching)) ||
    (activeTab === 'adults' && (isAdultsLoading || isAdultsFetching)) ||
    (activeTab === 'instructors' && (isTeachersLoading || isTeachersFetching));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">People & platform hub</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage parents, children, adult students, and instructors end to end.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap justify-end">
          {canReadUsers && (
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Users <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          {canReadPayments && (
            <Link
              to="/admin/payments"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100"
            >
              Applications <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {isStatsLoading ? (
          Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : isStatsError ? (
          <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100">
            Failed to load dashboard statistics.
          </div>
        ) : (
          <>
            <StatCard
              title="Parents"
              value={String(stats?.totalParents ?? 0)}
              icon={<UserIcon className="w-5 h-5" />}
              color="blue"
              isActive={activeTab === 'parents'}
              onClick={canSeeUserDetails ? () => setActiveTab('parents') : undefined}
            />
            <StatCard
              title="Children"
              value={String(stats?.totalChildren ?? 0)}
              icon={<Baby className="w-5 h-5" />}
              color="emerald"
              isActive={activeTab === 'children'}
              onClick={canSeeUserDetails ? () => setActiveTab('children') : undefined}
            />
            <StatCard
              title="Adult students"
              value={String(stats?.totalAdultStudents ?? 0)}
              icon={<BookOpen className="w-5 h-5" />}
              color="violet"
              isActive={activeTab === 'adults'}
              onClick={canSeeUserDetails ? () => setActiveTab('adults') : undefined}
            />
            <StatCard
              title="Instructors"
              value={String(stats?.totalTeachers ?? 0)}
              icon={<GraduationCap className="w-5 h-5" />}
              color="indigo"
              isActive={activeTab === 'instructors'}
              onClick={canSeeUserDetails ? () => setActiveTab('instructors') : undefined}
            />
            <StatCard
              title="Pending apps"
              value={String(stats?.pendingEnrollments ?? 0)}
              icon={<Clock className="w-5 h-5" />}
              color="amber"
              href={canReadPayments ? '/admin/payments?status=PENDING' : undefined}
            />
            <StatCard
              title="Active enrollments"
              value={String(stats?.activeEnrollments ?? 0)}
              icon={<Activity className="w-5 h-5" />}
              color="emerald"
              href={canReadPayments ? '/admin/payments' : undefined}
            />
          </>
        )}
      </div>

      {canSeeUserDetails ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 bg-gray-50/50 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                  {React.createElement(tabMeta[activeTab].icon, { className: 'w-5 h-5' })}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-800">{tabMeta[activeTab].title}</h2>
                  <p className="text-sm text-gray-500">{tabMeta[activeTab].subtitle}</p>
                </div>
              </div>
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, username…"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(Object.keys(tabMeta) as DirectoryTab[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    activeTab === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {tabMeta[key].title}
                  <span className="ml-1.5 opacity-80">{tabMeta[key].count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {listLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Fetching records…</p>
              </div>
            ) : activeTab === 'parents' ? (
              parentsData && parentsData.length > 0 ? (
                parentsData.map((parent) => (
                  <ParentRow
                    key={parent._id}
                    parent={parent}
                    canEditChild={canEditChild}
                    canDeleteChild={canDeleteChild}
                    canUpdateUser={canUpdateUser}
                    canDeleteUser={canDeleteUser}
                    canReadPayments={canReadPayments}
                    canReadUsers={canReadUsers}
                    onToggleStatus={() => handleToggleUserStatus(parent._id, parent.status)}
                    onDeleteUser={() =>
                      setUserToDelete({
                        id: parent._id,
                        name: `${parent.firstname} ${parent.lastname}`,
                      })
                    }
                    onViewEnrollments={() =>
                      setEnrollmentTarget({
                        label: `${parent.firstname} ${parent.lastname}`,
                        parentId: parent._id,
                      })
                    }
                    isUpdatingStatus={isUpdatingStatus}
                  />
                ))
              ) : (
                <EmptyState text="No parent records found." />
              )
            ) : activeTab === 'children' ? (
              childrenData && childrenData.length > 0 ? (
                childrenData.map((child) => (
                  <ChildDirectoryRow
                    key={child._id}
                    child={child}
                    canEditChild={canEditChild}
                    canDeleteChild={canDeleteChild}
                    canReadPayments={canReadPayments}
                    onViewEnrollments={() =>
                      setEnrollmentTarget({
                        label: `${child.firstname} ${child.lastname}`,
                        childId: child._id,
                      })
                    }
                  />
                ))
              ) : (
                <EmptyState text="No child accounts found." />
              )
            ) : activeTab === 'adults' ? (
              adultsData && adultsData.length > 0 ? (
                adultsData.map((student) => (
                  <AdultStudentRow
                    key={student._id}
                    student={student}
                    canUpdateUser={canUpdateUser}
                    canDeleteUser={canDeleteUser}
                    canReadPayments={canReadPayments}
                    canReadUsers={canReadUsers}
                    onToggleStatus={() => handleToggleUserStatus(student._id, student.status)}
                    onDeleteUser={() =>
                      setUserToDelete({
                        id: student._id,
                        name: `${student.firstname} ${student.lastname}`,
                      })
                    }
                    onViewEnrollments={() =>
                      setEnrollmentTarget({
                        label: `${student.firstname} ${student.lastname}`,
                        userId: student._id,
                      })
                    }
                    isUpdatingStatus={isUpdatingStatus}
                  />
                ))
              ) : (
                <EmptyState text="No adult student accounts found." />
              )
            ) : teachersData && teachersData.length > 0 ? (
              teachersData.map((teacher) => (
                <TeacherRow
                  key={teacher._id}
                  teacher={teacher}
                  canUpdateUser={canUpdateUser}
                  canDeleteUser={canDeleteUser}
                  canReadUsers={canReadUsers}
                  onToggleStatus={() => handleToggleUserStatus(teacher._id, teacher.status)}
                  onDeleteUser={() =>
                    setUserToDelete({
                      id: teacher._id,
                      name: `${teacher.firstname} ${teacher.lastname}`,
                    })
                  }
                  isUpdatingStatus={isUpdatingStatus}
                />
              ))
            ) : (
              <EmptyState text="No instructor records found." />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-amber-800 text-sm">
          You can see stats, but detailed people directories need the <strong>user.detail.view</strong> permission.
        </div>
      )}

      {enrollmentTarget && (
        <EnrollmentsDrawer target={enrollmentTarget} onClose={() => setEnrollmentTarget(null)} />
      )}

      {userToDelete && (
        <ConfirmDeleteUserModal
          name={userToDelete.name}
          isLoading={isDeletingUser}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteUser}
        />
      )}

      {isResetModalOpen && (
        <ResetDbModal
          confirmInput={confirmInput}
          setConfirmInput={setConfirmInput}
          isResetting={isResetting}
          onClose={() => {
            setIsResetModalOpen(false);
            setConfirmInput('');
          }}
          onConfirm={handleResetSystem}
        />
      )}
    </div>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <div className="p-12 text-center text-gray-500 italic">{text}</div>
);

const StatusBadge = ({ status }: { status?: string }) => (
  <span
    className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
      status === 'active'
        ? 'bg-emerald-50 text-emerald-600'
        : status === 'suspended'
          ? 'bg-amber-50 text-amber-600'
          : 'bg-red-50 text-red-600'
    }`}
  >
    {status || 'unknown'}
  </span>
);

const TeacherRow: React.FC<{
  teacher: TeacherDetail;
  canUpdateUser: boolean;
  canDeleteUser: boolean;
  canReadUsers: boolean;
  onToggleStatus: () => void;
  onDeleteUser: () => void;
  isUpdatingStatus: boolean;
}> = ({
  teacher,
  canUpdateUser,
  canDeleteUser,
  canReadUsers,
  onToggleStatus,
  onDeleteUser,
  isUpdatingStatus,
}) => (
  <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
        {teacher.firstname?.[0]}
        {teacher.lastname?.[0]}
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">
          {teacher.firstname} {teacher.lastname}
        </h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
            <Mail className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{teacher.email}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Phone className="w-3 h-3 flex-shrink-0" /> {teacher.phone || 'No phone'}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2 sm:justify-end flex-wrap">
      <StatusBadge status={teacher.status} />
      {canUpdateUser && (
        <button
          type="button"
          onClick={onToggleStatus}
          disabled={isUpdatingStatus}
          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
          title={teacher.status === 'active' ? 'Suspend' : 'Activate'}
        >
          {teacher.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </button>
      )}
      {canReadUsers && (
        <Link
          to={`/admin/users?search=${encodeURIComponent(teacher.email || '')}`}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
          title="Open in Users"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      )}
      {canDeleteUser && (
        <button type="button" onClick={onDeleteUser} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

const AdultStudentRow: React.FC<{
  student: AdultStudent;
  canUpdateUser: boolean;
  canDeleteUser: boolean;
  canReadPayments: boolean;
  canReadUsers: boolean;
  onToggleStatus: () => void;
  onDeleteUser: () => void;
  onViewEnrollments: () => void;
  isUpdatingStatus: boolean;
}> = ({
  student,
  canUpdateUser,
  canDeleteUser,
  canReadPayments,
  canReadUsers,
  onToggleStatus,
  onDeleteUser,
  onViewEnrollments,
  isUpdatingStatus,
}) => (
  <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold flex-shrink-0">
        {student.firstname?.[0]}
        {student.lastname?.[0]}
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">
          {student.firstname} {student.lastname}
        </h4>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {student.email}
          {student.enrollmentCount != null ? ` · ${student.enrollmentCount} enrollments` : ''}
          {student.pendingEnrollmentCount ? ` · ${student.pendingEnrollmentCount} pending` : ''}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <StatusBadge status={student.status} />
      <button
        type="button"
        onClick={onViewEnrollments}
        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
        title="View enrollments"
      >
        <CreditCard className="w-4 h-4" />
      </button>
      {canReadPayments && (
        <Link
          to={`/admin/payments?search=${encodeURIComponent(student.email || student.firstname)}`}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
          title="Applications"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      )}
      {canUpdateUser && (
        <button
          type="button"
          onClick={onToggleStatus}
          disabled={isUpdatingStatus}
          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
          title={student.status === 'active' ? 'Suspend' : 'Activate'}
        >
          {student.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        </button>
      )}
      {canReadUsers && (
        <Link
          to={`/admin/users?search=${encodeURIComponent(student.email || '')}`}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
          title="Open in Users"
        >
          <Users className="w-4 h-4" />
        </Link>
      )}
      {canDeleteUser && (
        <button type="button" onClick={onDeleteUser} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

const ChildDirectoryRow: React.FC<{
  child: ChildDetail;
  canEditChild: boolean;
  canDeleteChild: boolean;
  canReadPayments: boolean;
  onViewEnrollments: () => void;
}> = ({ child, canEditChild, canDeleteChild, canReadPayments, onViewEnrollments }) => {
  const [childToEdit, setChildToEdit] = useState<ChildDetail | null>(null);
  const [childToDelete, setChildToDelete] = useState<ChildDetail | null>(null);
  const parent = child.parent;

  return (
    <>
      <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">
              {child.firstname} {child.lastname}
            </h4>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {child.username ? `@${child.username} · ` : ''}
              Grade {child.grade || '—'} · {child.gender || '—'}
              {parent ? ` · Parent: ${parent.firstname} ${parent.lastname}` : ''}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {child.enrollmentCount ?? 0} enrollments
              {child.pendingEnrollmentCount ? ` · ${child.pendingEnrollmentCount} pending` : ''}
              {child.activeEnrollmentCount ? ` · ${child.activeEnrollmentCount} active` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={child.status} />
          <button
            type="button"
            onClick={onViewEnrollments}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="View enrollments"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          {canReadPayments && (
            <Link
              to={`/admin/payments?search=${encodeURIComponent(child.firstname)}`}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
              title="Applications"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          {canEditChild && (
            <button
              type="button"
              onClick={() => setChildToEdit(child)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Edit child"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {canDeleteChild && (
            <button
              type="button"
              onClick={() => setChildToDelete(child)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              title="Delete child"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {childToEdit && <EditChildModal child={childToEdit} onClose={() => setChildToEdit(null)} />}
      {childToDelete && <DeleteChildModal child={childToDelete} onClose={() => setChildToDelete(null)} />}
    </>
  );
};

const ParentRow: React.FC<{
  parent: ParentWithChildren;
  canEditChild: boolean;
  canDeleteChild: boolean;
  canUpdateUser: boolean;
  canDeleteUser: boolean;
  canReadPayments: boolean;
  canReadUsers: boolean;
  onToggleStatus: () => void;
  onDeleteUser: () => void;
  onViewEnrollments: () => void;
  isUpdatingStatus: boolean;
}> = ({
  parent,
  canEditChild,
  canDeleteChild,
  canUpdateUser,
  canDeleteUser,
  canReadPayments,
  canReadUsers,
  onToggleStatus,
  onDeleteUser,
  onViewEnrollments,
  isUpdatingStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState<ChildDetail | null>(null);
  const [childToDelete, setChildToDelete] = useState<ChildDetail | null>(null);

  return (
    <div className="transition-colors hover:bg-gray-50/50">
      <div className="p-4 flex items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 text-left"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
            {parent.firstname[0]}
            {parent.lastname[0]}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-800 truncate">
              {parent.firstname} {parent.lastname}
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500 min-w-0">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{parent.email}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3 flex-shrink-0" /> {parent.phone || 'N/A'}
              </span>
              <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-medium w-fit">
                {parent.parentType}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {parent.children.length} children
              {parent.enrollmentCount != null ? ` · ${parent.enrollmentCount} enrollments` : ''}
              {parent.pendingEnrollmentCount ? ` · ${parent.pendingEnrollmentCount} pending` : ''}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 flex-wrap justify-end">
          <StatusBadge status={parent.status} />
          <button
            type="button"
            onClick={onViewEnrollments}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="View enrollments"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          {canReadPayments && (
            <Link
              to={`/admin/payments?search=${encodeURIComponent(parent.email || parent.firstname)}`}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
              title="Applications"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
          {canUpdateUser && (
            <button
              type="button"
              onClick={onToggleStatus}
              disabled={isUpdatingStatus}
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
              title={parent.status === 'active' ? 'Suspend' : 'Activate'}
            >
              {parent.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </button>
          )}
          {canReadUsers && (
            <Link
              to={`/admin/users?search=${encodeURIComponent(parent.email || '')}`}
              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
              title="Open in Users"
            >
              <Users className="w-4 h-4" />
            </Link>
          )}
          {canDeleteUser && (
            <button type="button" onClick={onDeleteUser} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Delete parent">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 bg-gray-50/30">
          <div className="ml-0 sm:ml-14 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {parent.children.length > 0 ? (
              parent.children.map((child) => (
                <div
                  key={child._id}
                  className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {child.firstname} {child.lastname}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        Grade {child.grade} · {child.gender}
                        {child.username ? ` · @${child.username}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <StatusBadge status={child.status} />
                    {canEditChild && (
                      <button
                        type="button"
                        onClick={() => setChildToEdit(child)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit child"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canDeleteChild && (
                      <button
                        type="button"
                        onClick={() => setChildToDelete(child)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete child"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic col-span-full py-2">No children registered for this parent.</p>
            )}
          </div>
        </div>
      )}

      {childToEdit && <EditChildModal child={childToEdit} onClose={() => setChildToEdit(null)} />}
      {childToDelete && <DeleteChildModal child={childToDelete} onClose={() => setChildToDelete(null)} />}
    </div>
  );
};

const EnrollmentsDrawer: React.FC<{
  target: { label: string; parentId?: string; childId?: string; userId?: string };
  onClose: () => void;
}> = ({ target, onClose }) => {
  const { data, isLoading, isError } = useGetPersonEnrollmentsQuery({
    parentId: target.parentId,
    childId: target.childId,
    userId: target.userId,
  });

  return (
    <div className="fixed inset-0 z-[999] flex justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Enrollments</h3>
            <p className="text-xs text-gray-500">{target.label}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : isError ? (
            <p className="text-sm text-red-600">Failed to load enrollments.</p>
          ) : data && data.length > 0 ? (
            data.map((e: PersonEnrollment) => (
              <div key={e._id} className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-800">
                  {e.program?.title || 'Program'}
                  {e.phase?.title ? ` · ${e.phase.title}` : ''}
                  {e.package?.name ? ` · ${e.package.name}` : ''}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {e.enrolleeType || '—'}
                  {e.child ? ` · ${e.child.firstname} ${e.child.lastname}` : ''}
                  {e.user ? ` · ${e.user.firstname} ${e.user.lastname}` : ''}
                </p>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={e.status?.toLowerCase()} />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold uppercase">
                    {e.paymentStatus || 'UNPAID'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No enrollments found.</p>
          )}
          <Link
            to="/admin/payments"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline pt-2"
          >
            Open Applications <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const toDateInput = (value?: string) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const EditChildModal: React.FC<{ child: ChildDetail; onClose: () => void }> = ({ child, onClose }) => {
  const [updateChild, { isLoading }] = useAdminUpdateChildMutation();
  const [form, setForm] = useState({
    firstname: child.firstname || '',
    lastname: child.lastname || '',
    username: child.username || '',
    grade: child.grade || '',
    gender: (child.gender as 'male' | 'female') || 'male',
    status: (child.status as 'active' | 'suspended') || 'active',
    birthdate: toDateInput(child.birthdate),
    pin: '',
  });

  useEffect(() => {
    setForm({
      firstname: child.firstname || '',
      lastname: child.lastname || '',
      username: child.username || '',
      grade: child.grade || '',
      gender: (child.gender as 'male' | 'female') || 'male',
      status: (child.status as 'active' | 'suspended') || 'active',
      birthdate: toDateInput(child.birthdate),
      pin: '',
    });
  }, [child]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstname.trim() || !form.lastname.trim()) {
      toast.error('First and last name are required');
      return;
    }
    if (form.pin && !/^\d{6}$/.test(form.pin)) {
      toast.error('PIN must be exactly 6 digits');
      return;
    }
    try {
      await updateChild({
        id: child._id,
        data: {
          firstname: form.firstname.trim(),
          lastname: form.lastname.trim(),
          username: form.username.trim() || undefined,
          grade: form.grade || undefined,
          gender: form.gender,
          status: form.status,
          birthdate: form.birthdate || undefined,
          ...(form.pin ? { pin: form.pin } : {}),
        },
      }).unwrap();
      toast.success('Child account updated');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update child');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">Edit child account</h3>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First name</label>
              <input
                value={form.firstname}
                onChange={(e) => setForm((f) => ({ ...f, firstname: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last name</label>
              <input
                value={form.lastname}
                onChange={(e) => setForm((f) => ({ ...f, lastname: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grade</label>
              <select
                value={form.grade}
                onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={String(g)}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as 'male' | 'female' }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'active' | 'suspended' }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Birthdate</label>
              <input
                type="date"
                value={form.birthdate}
                onChange={(e) => setForm((f) => ({ ...f, birthdate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New PIN (optional)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Leave blank to keep current"
              value={form.pin}
              onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {isLoading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteChildModal: React.FC<{ child: ChildDetail; onClose: () => void }> = ({ child, onClose }) => {
  const [deleteChild, { isLoading }] = useAdminDeleteChildMutation();

  const handleDelete = async () => {
    try {
      await deleteChild(child._id).unwrap();
      toast.success('Child account deleted');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete child');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete child account?</h3>
        <p className="text-gray-500 text-sm mb-4">
          Delete <span className="font-bold text-gray-800">{child.firstname} {child.lastname}</span>?
        </p>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-left mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">This will also</p>
          <ul className="text-xs text-red-600 space-y-1 list-disc list-inside font-medium">
            <li>Remove the child login account</li>
            <li>Delete related enrollments</li>
          </ul>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmDeleteUserModal: React.FC<{
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ name, isLoading, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
    <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Delete user?</h3>
      <p className="text-gray-500 text-sm mb-4">
        Delete <span className="font-bold text-gray-800">{name}</span>? Linked children and enrollments may be removed.
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 font-bold rounded-xl">
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl disabled:opacity-50"
        >
          {isLoading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

const ResetDbModal: React.FC<{
  confirmInput: string;
  setConfirmInput: (v: string) => void;
  isResetting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ confirmInput, setConfirmInput, isResetting, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-red-600 p-8 text-center text-white relative">
        <button type="button" className="absolute top-4 right-4 cursor-pointer hover:opacity-70" onClick={onClose}>
          ✕
        </button>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight">Factory Reset</h3>
      </div>
      <div className="p-8">
        <p className="text-gray-500 text-sm mb-4 text-center">
          Type <span className="font-black text-red-600">RESET</span> to confirm.
        </p>
        <input
          type="text"
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
          placeholder="Type RESET here..."
          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none text-center font-black tracking-widest text-red-600 mb-6"
        />
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-500 font-bold rounded-xl">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isResetting || confirmInput !== 'RESET'}
            className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {isResetting ? 'Wiping…' : 'WIPE SYSTEM'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber';
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isActive, onClick, href }) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  const activeRing = isActive ? 'ring-2 ring-offset-2 ring-blue-500 scale-[1.02] shadow-md' : 'hover:shadow-md';

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl ${colorStyles[color]}`}>{icon}</div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link to={href} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all block ${activeRing}`}>
        {inner}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${
        onClick ? `cursor-pointer ${activeRing}` : ''
      }`}
    >
      {inner}
    </div>
  );
};

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="h-3 w-20 bg-gray-100 rounded mb-3" />
    <div className="h-7 w-12 bg-gray-100 rounded" />
  </div>
);

export default AdminDashboard;
