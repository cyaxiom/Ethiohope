import React, { useState } from 'react';
import { 
  UsersRound, Search, Filter, Plus, Edit2, 
  ShieldAlert, Activity, Ban, CheckCircle2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserStatusMutation, 
  useUpdateUserRolesMutation 
} from '../../features/user/userApi';
import { useGetRolesQuery } from '../../features/role/roleApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast } from 'react-toastify'; // Or sonner
import { toast as sonnerToast } from 'sonner';

// Assuming roleApi might not be fully known, let's just make sure.
// I will just fetch roles if exists, otherwise I'll mock role fetch for now, but roleApi should exist since RoleManagement is there.
// I will write this file and then check roleApi.

const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; userId: string; newStatus: 'active' | 'suspended' | 'blocked' }>({
    isOpen: false, userId: '', newStatus: 'active'
  });
  
  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'user.read');
  const canCreate = hasPermission(permissions, 'user.create');
  const canUpdate = hasPermission(permissions, 'user.update');

  // Debounce effect
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Queries
  const { data: usersData, isLoading, isFetching } = useGetUsersQuery(
    { page, limit, search: debouncedSearch, role: roleFilter, status: statusFilter },
    { skip: !canRead }
  );

  const { data: rolesData } = useGetRolesQuery();

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view users.</p>
      </div>
    );
  }

  const handleStatusChangeClick = (userId: string, newStatus: 'active' | 'suspended' | 'blocked') => {
    setConfirmModal({ isOpen: true, userId, newStatus });
  };

  const confirmStatusChange = async () => {
    try {
      await updateStatus({ userId: confirmModal.userId, status: confirmModal.newStatus }).unwrap();
      sonnerToast.success(`User status updated to ${confirmModal.newStatus}`);
      setConfirmModal({ isOpen: false, userId: '', newStatus: 'active' });
    } catch (err) {
      sonnerToast.error('Failed to update status');
    }
  };

  const users = usersData?.data || [];
  const meta = usersData?.meta;
  const stats = meta?.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system users, roles, and access.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setStatusFilter('')}
            className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer hover:shadow-md transition-all ${
              statusFilter === '' ? 'ring-2 ring-blue-500 border-transparent bg-blue-50/10' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <UsersRound className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex gap-2 text-xs text-gray-500 font-medium flex-wrap">
              {Object.entries(stats.rolesCount || {}).map(([roleName, count]) => (
                <button 
                  key={roleName} 
                  onClick={(e) => {
                    e.stopPropagation();
                    const matchedRole = rolesData?.find((r: any) => r.name === roleName);
                    if (matchedRole) setRoleFilter(matchedRole._id);
                    setStatusFilter('');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors text-left"
                >
                  {roleName}: {count as React.ReactNode}
                </button>
              ))}
            </div>
          </div>
          
          <div 
            onClick={() => setStatusFilter('active')}
            className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer hover:shadow-md transition-all ${
              statusFilter === 'active' ? 'ring-2 ring-emerald-500 border-transparent bg-emerald-50/10' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Users</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('suspended')}
            className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer hover:shadow-md transition-all ${
              statusFilter === 'suspended' ? 'ring-2 ring-amber-500 border-transparent bg-amber-50/10' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Suspended</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.suspended}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('blocked')}
            className={`bg-white rounded-2xl p-5 border shadow-sm cursor-pointer hover:shadow-md transition-all ${
              statusFilter === 'blocked' ? 'ring-2 ring-red-500 border-transparent bg-red-50/10' : 'border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Blocked</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.blocked}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none"
          >
            <option value="">All Roles</option>
            {rolesData?.map((r: any) => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Roles</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {user.firstname?.[0]}{user.lastname?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((r: any) => (
                          <span key={r.id} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md">
                            {r.name}
                          </span>
                        ))}
                        {user.roles.length === 0 && <span className="text-gray-400 text-sm">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flexItems-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                        user.status === 'suspended' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canUpdate && (
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {user.status !== 'active' && (
                            <button 
                              onClick={() => handleStatusChangeClick(user.id, 'active')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Activate User"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {user.status !== 'suspended' && (
                            <button 
                              onClick={() => handleStatusChangeClick(user.id, 'suspended')}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              title="Suspend User"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          )}
                          {user.status !== 'blocked' && (
                            <button 
                              onClick={() => handleStatusChangeClick(user.id, 'blocked')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Block User"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => { setSelectedUser(user); setIsEditRolesModalOpen(true); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors ml-2"
                            title="Edit Roles"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {meta && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> users
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= meta.total}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {isCreateModalOpen && (
        <CreateUserModal 
          onClose={() => setIsCreateModalOpen(false)} 
          roles={rolesData || []} 
        />
      )}

      {isEditRolesModalOpen && selectedUser && (
        <EditRolesModal 
          user={selectedUser} 
          onClose={() => { setIsEditRolesModalOpen(false); setSelectedUser(null); }} 
          rolesList={rolesData || []} 
        />
      )}

      {/* Confirm Status Change Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 p-6 my-10">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Change User Status</h3>
            <p className="text-gray-500 mb-6 font-medium">
              Are you sure you want to change this user's status to <span className="font-bold text-gray-800">{confirmModal.newStatus}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, userId: '', newStatus: 'active' })} 
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmStatusChange} 
                disabled={isUpdatingStatus}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isUpdatingStatus ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Modals ---

const CreateUserModal: React.FC<{ onClose: () => void, roles: any[] }> = ({ onClose, roles }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const onSubmit = async (data: any) => {
    // Convert single role select or empty to array
    const rolesArray = Array.isArray(data.roles) ? data.roles : (data.roles ? [data.roles] : []);
    if (rolesArray.length === 0) {
      sonnerToast.error('Please select at least one role');
      return;
    }
    
    try {
      await createUser({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        roles: rolesArray
      }).unwrap();
      sonnerToast.success('User created successfully');
      onClose();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh] my-10">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Create New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input {...register('firstname', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input {...register('lastname', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" {...register('password', { required: true, minLength: 6 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
            <select multiple {...register('roles')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-24">
              {roles.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditRolesModal: React.FC<{ user: any, onClose: () => void, rolesList: any[] }> = ({ user, onClose, rolesList }) => {
  const [updateRoles, { isLoading }] = useUpdateUserRolesMutation();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles.map((r: any) => r.id));

  const handleSave = async () => {
    try {
      await updateRoles({ userId: user.id, roles: selectedRoles }).unwrap();
      sonnerToast.success('Roles updated successfully');
      onClose();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to update roles');
    }
  };

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh] my-10">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Edit Roles: {user.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {rolesList.map(role => (
              <label key={role._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedRoles.includes(role._id)} 
                  onChange={() => toggleRole(role._id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-gray-800">{role.name}</p>
                  <p className="text-xs text-gray-500">{role.code}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Roles'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
