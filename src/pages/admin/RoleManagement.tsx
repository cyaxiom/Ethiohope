import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAppSelector } from '../../hooks/reduxHooks';
import { hasPermission } from '../../lib/rbac';
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../../features/role/roleApi';
import type { Role } from '../../features/role/roleApi';
import { getErrorMessage } from '../../lib/error-handler';
import RoleModal from '../../components/admin/roles/RoleModal';
import DeleteConfirmModal from '../../components/admin/roles/DeleteConfirmModal';

// ─── Toast Component ────────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({
  toasts,
  onDismiss,
}) => (
  <div className="fixed top-6 right-6 z-[60] space-y-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slideIn cursor-pointer
          ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        onClick={() => onDismiss(toast.id)}
      >
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        )}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    ))}
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export const RoleManagement: React.FC = () => {
  // Permissions from Redux auth state (top-level, not on user object)
  const permissions = useAppSelector((state) => state.auth.permissions) ?? [];

  // RBAC checks
  const canRead = hasPermission(permissions, 'role.read');
  const canCreate = hasPermission(permissions, 'role.create');
  const canUpdate = hasPermission(permissions, 'role.update');
  const canDelete = hasPermission(permissions, 'role.delete');

  // RTK Queries
  const {
    data: roles = [],
    isLoading: rolesLoading,
    isError: rolesError,
    error: rolesErrorObj,
    refetch: refetchRoles,
  } = useGetRolesQuery(undefined, { skip: !canRead });

  const {
    data: allPermissions = [],
    isLoading: permissionsLoading,
  } = useGetPermissionsQuery(undefined, { skip: !canRead });

  // RTK Mutations
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter roles by search
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSubmitRole = async (data: {
    name: string;
    code: string;
    permissionKeys: string[];
  }) => {
    try {
      if (editingRole) {
        // Update mode — only send permission keys
        await updateRole({
          id: editingRole._id,
          permissionKeys: data.permissionKeys,
        }).unwrap();
        showToast(`Role "${editingRole.name}" updated successfully`, 'success');
      } else {
        // Create mode
        await createRole(data).unwrap();
        showToast(`Role "${data.name}" created successfully`, 'success');
      }
      handleCloseModal();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save role'), 'error');
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;
    try {
      await deleteRole(deletingRole._id).unwrap();
      showToast(`Role "${deletingRole.name}" deleted successfully`, 'success');
      setDeletingRole(null);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to delete role'), 'error');
    }
  };

  // ─── Access Denied ────────────────────────────────────────────────────────

  if (!canRead) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-500">
            You don't have the required permissions to view role management.
            Contact your administrator to request access.
          </p>
        </div>
      </div>
    );
  }

  // ─── Loading State ────────────────────────────────────────────────────────

  if (rolesLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-52 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-72" />
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="h-10 bg-gray-100 rounded-xl w-64 animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 animate-pulse">
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-50 rounded w-20" />
              </div>
              <div className="h-6 bg-gray-100 rounded-full w-16" />
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────────

  if (rolesError) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Failed to Load Roles</h3>
          <p className="text-sm text-gray-500 mb-4">
            {getErrorMessage(rolesErrorObj, 'An unexpected error occurred while fetching roles.')}
          </p>
          <button
            onClick={refetchRoles}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl
                       hover:bg-blue-700 transition-all shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Role color avatar based on name hash ─────────────────────────────────

  const roleColors = [
    'bg-blue-100 text-blue-600',
    'bg-indigo-100 text-indigo-600',
    'bg-violet-100 text-violet-600',
    'bg-emerald-100 text-emerald-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
    'bg-cyan-100 text-cyan-600',
    'bg-fuchsia-100 text-fuchsia-600',
  ];

  const getRoleColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return roleColors[Math.abs(hash) % roleColors.length];
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Role Management
          </h1>
          <p className="text-gray-500 mt-1">Manage roles and permissions for your organization</p>
        </div>

        {canCreate && (
          <button
            id="create-role-btn"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                       text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-blue-200
                       hover:shadow-md hover:shadow-blue-200 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Roles</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{roles.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">System Roles</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {roles.filter((r) => r.isSystem).length}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Permissions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{allPermissions.length}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                         transition-all placeholder:text-gray-400"
            />
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Showing {filteredRoles.length} of {roles.length} roles
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">
                  Code
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Permissions
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">
                  Type
                </th>
                {(canUpdate || canDelete) && (
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="text-gray-400">
                      <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No roles found</p>
                      <p className="text-sm mt-1">
                        {searchQuery
                          ? `No results for "${searchQuery}"`
                          : 'Create your first role to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => (
                  <tr
                    key={role._id}
                    className="group hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Role Name + Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                                     ${getRoleColor(role.name)} transition-transform group-hover:scale-105`}
                        >
                          {role.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{role.name}</p>
                          <p className="text-xs text-gray-400 md:hidden font-mono">{role.code}</p>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <code className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                        {role.code}
                      </code>
                    </td>

                    {/* Permissions Count */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700
                                       bg-blue-50 px-2.5 py-1 rounded-full">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {role.permissions?.length ?? 0}
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {role.isSystem ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700
                                         bg-amber-50 px-2 py-1 rounded-full">
                          <Lock className="w-3 h-3" />
                          System
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                          Custom
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    {(canUpdate || canDelete) && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {canUpdate && (
                            <button
                              id={`edit-role-${role._id}`}
                              onClick={() => handleOpenEdit(role)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50
                                         rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Edit role"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && !role.isSystem && (
                            <button
                              id={`delete-role-${role._id}`}
                              onClick={() => setDeletingRole(role)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50
                                         rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Delete role"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {role.isSystem && canDelete && (
                            <span className="text-xs text-gray-300 italic px-2">Protected</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitRole}
        role={editingRole}
        allPermissions={allPermissions}
        isPermissionsLoading={permissionsLoading}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDeleteRole}
        roleName={deletingRole?.name ?? ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RoleManagement;
