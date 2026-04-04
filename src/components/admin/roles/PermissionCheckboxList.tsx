import React, { useMemo } from 'react';
import type { Permission } from '../../../features/role/roleApi';
import { Search, ChevronDown, ChevronRight, Check } from 'lucide-react';

interface PermissionCheckboxListProps {
  allPermissions: Permission[];
  selectedKeys: string[];
  onChange: (keys: string[]) => void;
  isLoading?: boolean;
}

const PermissionCheckboxList: React.FC<PermissionCheckboxListProps> = ({
  allPermissions,
  selectedKeys,
  onChange,
  isLoading = false,
}) => {
  const [search, setSearch] = React.useState('');
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  // Group permissions by resource (e.g., user, role, dashboard)
  const grouped = useMemo(() => {
    const map: Record<string, Permission[]> = {};
    allPermissions.forEach((perm) => {
      const resource = perm.resource || perm.key.split('.')[0];
      if (!map[resource]) map[resource] = [];
      map[resource].push(perm);
    });
    return map;
  }, [allPermissions]);

  // Filter by search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, Permission[]> = {};
    Object.entries(grouped).forEach(([resource, perms]) => {
      const filtered = perms.filter(
        (p) =>
          p.key.toLowerCase().includes(q) ||
          resource.toLowerCase().includes(q) ||
          p.action.toLowerCase().includes(q)
      );
      if (filtered.length > 0) result[resource] = filtered;
    });
    return result;
  }, [grouped, search]);

  // Auto-expand all groups on initial render
  React.useEffect(() => {
    setExpandedGroups(new Set(Object.keys(grouped)));
  }, [grouped]);

  const togglePermission = (key: string) => {
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter((k) => k !== key));
    } else {
      onChange([...selectedKeys, key]);
    }
  };

  const toggleGroup = (resource: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(resource)) next.delete(resource);
      else next.add(resource);
      return next;
    });
  };

  const toggleAllInGroup = (resource: string) => {
    const groupPerms = grouped[resource] || [];
    const groupKeys = groupPerms.map((p) => p.key);
    const allSelected = groupKeys.every((k) => selectedKeys.includes(k));

    if (allSelected) {
      onChange(selectedKeys.filter((k) => !groupKeys.includes(k)));
    } else {
      const merged = new Set([...selectedKeys, ...groupKeys]);
      onChange(Array.from(merged));
    }
  };

  const selectAll = () => {
    onChange(allPermissions.map((p) => p.key));
  };

  const deselectAll = () => {
    onChange([]);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
            <div className="space-y-2 ml-4">
              <div className="h-4 bg-gray-100 rounded w-36" />
              <div className="h-4 bg-gray-100 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalCount = allPermissions.length;
  const selectedCount = selectedKeys.length;

  return (
    <div className="space-y-3">
      {/* Header with search + bulk actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                       transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={selectAll}
            className="px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md
                       hover:bg-blue-100 transition-colors"
          >
            All
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md
                       hover:bg-gray-200 transition-colors"
          >
            None
          </button>
        </div>
      </div>

      {/* Selection counter */}
      <div className="text-xs text-gray-500 font-medium">
        {selectedCount} of {totalCount} permissions selected
      </div>

      {/* Permission Groups */}
      <div className="max-h-[340px] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
        {Object.entries(filteredGroups).map(([resource, perms]) => {
          const isExpanded = expandedGroups.has(resource);
          const groupKeys = perms.map((p) => p.key);
          const selectedInGroup = groupKeys.filter((k) => selectedKeys.includes(k)).length;
          const allInGroupSelected = selectedInGroup === perms.length;
          const someInGroupSelected = selectedInGroup > 0 && !allInGroupSelected;

          return (
            <div
              key={resource}
              className="border border-gray-100 rounded-lg overflow-hidden bg-white"
            >
              {/* Group Header */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 bg-gray-50/80 cursor-pointer
                           hover:bg-gray-100/80 transition-colors select-none"
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(resource)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Group-level checkbox */}
                <button
                  type="button"
                  onClick={() => toggleAllInGroup(resource)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0
                    ${
                      allInGroupSelected
                        ? 'bg-blue-600 border-blue-600'
                        : someInGroupSelected
                        ? 'bg-blue-200 border-blue-400'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                >
                  {(allInGroupSelected || someInGroupSelected) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>

                <span
                  className="text-sm font-semibold text-gray-700 capitalize flex-1"
                  onClick={() => toggleGroup(resource)}
                >
                  {resource}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {selectedInGroup}/{perms.length}
                </span>
              </div>

              {/* Permissions list */}
              {isExpanded && (
                <div className="px-3 py-2 space-y-1">
                  {perms.map((perm) => {
                    const isChecked = selectedKeys.includes(perm.key);
                    return (
                      <label
                        key={perm._id}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-md cursor-pointer
                                   hover:bg-blue-50/50 transition-colors group"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0
                            ${
                              isChecked
                                ? 'bg-blue-600 border-blue-600 shadow-sm shadow-blue-200'
                                : 'border-gray-300 group-hover:border-blue-400'
                            }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.key)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {perm.action || perm.key.split('.').pop()}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(filteredGroups).length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No permissions found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionCheckboxList;
