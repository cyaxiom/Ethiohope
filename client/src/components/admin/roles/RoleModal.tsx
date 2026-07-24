import React, { useEffect, useState } from 'react';
import { X, Shield, Loader2 } from 'lucide-react';
import PermissionCheckboxList from './PermissionCheckboxList';
import type { Role, Permission } from '../../../features/role/roleApi';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; code: string; permissionKeys: string[] }) => void;
  role?: Role | null; // null = create mode, populated = edit mode
  allPermissions: Permission[];
  isPermissionsLoading: boolean;
  isSubmitting: boolean;
}

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  role,
  allPermissions,
  isPermissionsLoading,
  isSubmitting,
}) => {
  const isEditMode = !!role;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill when editing, reset when creating
  useEffect(() => {
    if (isOpen) {
      if (role) {
        setName(role.name);
        setCode(role.code);
        setSelectedPermissionKeys(role.permissions.map((p) => p.key));
      } else {
        setName('');
        setCode('');
        setSelectedPermissionKeys([]);
      }
      setErrors({});
    }
  }, [isOpen, role]);

  // Auto-generate code from name (only in create mode)
  useEffect(() => {
    if (!isEditMode && name) {
      setCode(name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
    }
  }, [name, isEditMode]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Role name is required';
    if (!code.trim()) newErrors.code = 'Role code is required';
    if (selectedPermissionKeys.length === 0) newErrors.permissions = 'Select at least one permission';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      code: code.trim().toLowerCase().replace(/\s+/g, '_'),
      permissionKeys: selectedPermissionKeys,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slideUp max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-50 rounded-xl flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditMode ? 'Edit Role' : 'Create New Role'}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditMode
                  ? 'Update role permissions'
                  : 'Define a new role with specific permissions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto flex-1">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isEditMode}
                placeholder="e.g. Instructor"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                           ${errors.name ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-gray-50/50'}
                           ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Code Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Role Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isEditMode}
                placeholder="e.g. instructor"
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono transition-all
                           focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                           ${errors.code ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-gray-50/50'}
                           ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
              {errors.code && (
                <p className="mt-1 text-xs text-red-500">{errors.code}</p>
              )}
              {!isEditMode && (
                <p className="mt-1 text-xs text-gray-400">
                  Auto-generated from name. Must be unique.
                </p>
              )}
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Permissions <span className="text-red-500">*</span>
              </label>
              {errors.permissions && (
                <p className="mb-2 text-xs text-red-500">{errors.permissions}</p>
              )}
              <PermissionCheckboxList
                allPermissions={allPermissions}
                selectedKeys={selectedPermissionKeys}
                onChange={setSelectedPermissionKeys}
                isLoading={isPermissionsLoading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 rounded-b-2xl pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200
                         rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl
                         hover:bg-blue-700 transition-all shadow-sm shadow-blue-200
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditMode ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
