import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, Edit2, 
  ShieldAlert, Activity, CheckCircle2,
  ChevronLeft, ChevronRight, X, Trash2, AlertTriangle,
  GraduationCap, Calendar
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';

import { 
  useGetBatchesQuery, 
  useCreateBatchMutation, 
  useUpdateBatchMutation, 
  useDeleteBatchMutation 
} from '../../features/batches/batchApi';
import { useGetProgramsQuery } from '../../features/programs/programApi';
import { useGetPhasesByProgramQuery } from '../../features/programs/phaseApi';
import { useGetUsersQuery } from '../../features/user/userApi';

const Batches: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [batchToDelete, setBatchToDelete] = useState<any>(null);
  
  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'batch.read');
  const canCreate = hasPermission(permissions, 'batch.create');
  const canUpdate = hasPermission(permissions, 'batch.update');
  const canDelete = hasPermission(permissions, 'batch.delete');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Queries
  const { data: batchesData, isLoading, isFetching } = useGetBatchesQuery(
    { page, limit, search: debouncedSearch },
    { skip: !canRead }
  );

  const [deleteBatch, { isLoading: isDeleting }] = useDeleteBatchMutation();

  const handleDelete = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete._id).unwrap();
      sonnerToast.success('Batch deleted successfully');
      setBatchToDelete(null);
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to delete batch');
    }
  };

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view batches.</p>
      </div>
    );
  }

  const batches = batchesData?.data || [];
  const meta = batchesData?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Batch Management</h1>
          <p className="text-gray-500 text-sm mt-1">Organize student groups into program phases.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => { setSelectedBatch(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Batch
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search batches..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Batch Info</th>
                <th className="px-6 py-4 font-medium">Program / Phase</th>
                <th className="px-6 py-4 font-medium">Instructor</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading batches...
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No batches found.
                  </td>
                </tr>
              ) : (
                batches.map((batch: any) => (
                  <tr key={batch._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{batch.batchName || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{batch.program?.title}</p>
                        <p className="text-xs text-blue-600 font-medium">{batch.phase?.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {batch.instructor ? (
                        <p className="text-sm font-medium text-gray-700">
                          {batch.instructor.firstname} {batch.instructor.lastname}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        batch.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {batch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }} />
                        </div>
                        <span className="text-xs font-bold text-gray-600">0/{batch.capacity || '∞'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canUpdate && (
                          <button 
                            onClick={() => { setSelectedBatch(batch); setIsModalOpen(true); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Batch"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            onClick={() => setBatchToDelete(batch)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Batch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {meta && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> batches
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

      {/* Delete Confirmation Modal */}
      {batchToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h4>
            <p className="text-gray-500 mb-6 text-sm">
              You are about to delete batch <span className="font-bold text-gray-800">{batchToDelete.batchName}</span> for <span className="font-bold text-gray-800">{batchToDelete.program?.title}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setBatchToDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <BatchModal 
          batch={selectedBatch} 
          onClose={() => { setIsModalOpen(false); setSelectedBatch(null); }} 
        />
      )}
    </div>
  );
};

// --- Batch Modal (Create/Edit) ---

const BatchModal: React.FC<{ onClose: () => void, batch?: any }> = ({ onClose, batch }) => {
  const isEdit = !!batch;
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      program: batch?.program?._id || '',
      phase: batch?.phase?._id || '',
      instructor: batch?.instructor?._id || '',
      capacity: batch?.capacity || 20,
      batchName: batch?.batchName || '',
      isActive: batch?.isActive ?? true
    }
  });

  const selectedProgramId = watch('program');

  // Queries for form
  const { data: programsData } = useGetProgramsQuery({ limit: 100 });
  const { data: phasesData, isLoading: isLoadingPhases } = useGetPhasesByProgramQuery(selectedProgramId, { skip: !selectedProgramId });
  const { data: instructorsData } = useGetUsersQuery({ role: 'instructor', limit: 100 });

  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: any) => {
    const payload = { ...data };
    
    // Remove empty strings for optional IDs to avoid validation errors
    if (!payload.instructor) delete payload.instructor;

    // Ensure capacity is sent as a number
    if (payload.capacity) {
      payload.capacity = Number(payload.capacity);
    }

    try {
      if (isEdit) {
        await updateBatch({ id: batch._id, data: payload }).unwrap();
        sonnerToast.success('Batch updated successfully');
      } else {
        await createBatch(payload).unwrap();
        sonnerToast.success('Batch created successfully');
      }
      onClose();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} batch`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Batch' : 'Create New Batch'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Select Program</label>
            <select 
              {...register('program', { required: 'Program is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => {
                setValue('program', e.target.value);
                setValue('phase', ''); // Reset phase when program changes
              }}
            >
              <option value="">Choose a program...</option>
              {programsData?.data.map((p: any) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
            {errors.program && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase italic">Required</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Select Phase</label>
            <select 
              {...register('phase', { required: 'Phase is required' })}
              disabled={!selectedProgramId || isLoadingPhases}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{selectedProgramId ? 'Choose a phase...' : 'Select a program first'}</option>
              {phasesData?.data.map((ph: any) => (
                <option key={ph._id} value={ph._id}>{ph.title} (Index: {ph.orderIndex})</option>
              ))}
            </select>
            {errors.phase && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase italic">Required</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Instructor (Optional)</label>
            <select 
              {...register('instructor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">Unassigned</option>
              {instructorsData?.data.map((ins: any) => (
                <option key={ins.id} value={ins.id}>{ins.firstname} {ins.lastname}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Batch Name</label>
              <input 
                type="text"
                {...register('batchName', { required: 'Batch name is required' })}
                placeholder="e.g. Batch12026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.batchName && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase italic">Required</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Capacity</label>
              <input 
                type="number"
                {...register('capacity', { required: true, min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="isActive"
              {...register('isActive')}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
              Active (Available for enrollment)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-100 transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : (isEdit ? 'Update Batch' : 'Create Batch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Batches;
