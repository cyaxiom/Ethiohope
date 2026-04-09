import React, { useState, useEffect } from 'react';
import { 
  Library, Search, Plus, Edit2, 
  ShieldAlert, Activity, CheckCircle2,
  ChevronLeft, ChevronRight, X, Layers, Trash2, AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { 
  useGetProgramsQuery, 
  useCreateProgramMutation, 
  useUpdateProgramMutation 
} from '../../features/programs/programApi';
import { 
  useGetPhasesByProgramQuery, 
  useCreatePhaseMutation,
  useUpdatePhaseMutation,
  useDeletePhaseMutation
} from '../../features/programs/phaseApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';

const Programs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhasesModalOpen, setIsPhasesModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  
  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'program.read');
  const canCreate = hasPermission(permissions, 'program.create');
  const canUpdate = hasPermission(permissions, 'program.update');
  const canReadPhase = hasPermission(permissions, 'phase.read');

  // Debounce effect
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Queries
  const { data: programsData, isLoading, isFetching } = useGetProgramsQuery(
    { page, limit, search: debouncedSearch },
    { skip: !canRead }
  );

  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view programs.</p>
      </div>
    );
  }

  const handleToggleStatus = async (program: any) => {
    try {
      await updateProgram({ 
        id: program._id, 
        isActive: !program.isActive 
      }).unwrap();
      sonnerToast.success(`Program ${program.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      sonnerToast.error('Failed to update program status');
    }
  };

  const programs = programsData?.data || [];
  const meta = programsData?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Program Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage educational programs.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Program
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by program title..." 
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
                <th className="px-6 py-4 font-medium">Program Title</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading programs...
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((program: any) => (
                  <tr key={program._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Library className="w-5 h-5" />
                        </div>
                        <p className="font-medium text-gray-800">{program.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 max-w-xs truncate" title={program.description}>
                        {program.description || 'No description'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        program.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {program.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(program.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canReadPhase && (
                          <button 
                            onClick={() => { setSelectedProgram(program); setIsPhasesModalOpen(true); }}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Manage Phases"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                        )}
                        {canUpdate && (
                          <>
                            <button 
                              onClick={() => handleToggleStatus(program)}
                              className={`p-1.5 rounded-md transition-colors ${
                                program.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={program.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => { setSelectedProgram(program); setIsEditModalOpen(true); }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Program"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
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
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> programs
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
        <ProgramModal onClose={() => setIsCreateModalOpen(false)} />
      )}

      {isEditModalOpen && selectedProgram && (
        <ProgramModal 
          program={selectedProgram} 
          onClose={() => { setIsEditModalOpen(false); setSelectedProgram(null); }} 
        />
      )}

      {isPhasesModalOpen && selectedProgram && (
        <PhaseManagementModal 
          program={selectedProgram} 
          onClose={() => { setIsPhasesModalOpen(false); setSelectedProgram(null); }} 
        />
      )}
    </div>
  );
};

// --- Program Modal (Create/Edit) ---

const ProgramModal: React.FC<{ onClose: () => void, program?: any }> = ({ onClose, program }) => {
  const isEdit = !!program;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: program?.title || '',
      description: program?.description || '',
      isActive: program?.isActive ?? true
    }
  });

  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await updateProgram({ id: program._id, ...data }).unwrap();
        sonnerToast.success('Program updated successfully');
      } else {
        await createProgram(data).unwrap();
        sonnerToast.success('Program created successfully');
      }
      onClose();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} program`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Program' : 'Create New Program'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
            <input 
              {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Minimum 3 characters' } })} 
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.title ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
              }`}
              placeholder="e.g., Coding Essentials"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea 
              {...register('description')} 
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Brief description of the program..."
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input 
              type="checkbox" 
              id="isActive"
              {...register('isActive')}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Mark as Active
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 min-w-[100px]">
              {isLoading ? 'Saving...' : (isEdit ? 'Update Program' : 'Create Program')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Phase Management Modal ---

const PhaseManagementModal: React.FC<{ program: any, onClose: () => void }> = ({ program, onClose }) => {
  const { data: phasesData, isLoading: isLoadingPhases } = useGetPhasesByProgramQuery(program._id);
  const [createPhase, { isLoading: isCreating }] = useCreatePhaseMutation();
  const [updatePhase, { isLoading: isUpdating }] = useUpdatePhaseMutation();
  const [deletePhase, { isLoading: isDeleting }] = useDeletePhaseMutation();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any>(null);
  const [phaseToDelete, setPhaseToDelete] = useState<any>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Handle setting values when editing
  useEffect(() => {
    if (editingPhase) {
      setValue('title', editingPhase.title);
      setValue('description', editingPhase.description);
      setValue('price', editingPhase.price);
      setValue('durationWeeks', editingPhase.durationWeeks);
      setValue('orderIndex', editingPhase.orderIndex);
      setIsAddFormOpen(true);
    } else {
      reset();
    }
  }, [editingPhase, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (editingPhase) {
        await updatePhase({
          id: editingPhase._id,
          programId: program._id,
          data: {
            title: data.title,
            description: data.description,
            price: Number(data.price),
            durationWeeks: Number(data.durationWeeks),
            orderIndex: Number(data.orderIndex)
          }
        }).unwrap();
        sonnerToast.success('Phase updated successfully');
      } else {
        await createPhase({
          program: program._id,
          title: data.title,
          description: data.description,
          price: Number(data.price),
          durationWeeks: Number(data.durationWeeks),
          orderIndex: Number(data.orderIndex)
        }).unwrap();
        sonnerToast.success('Phase created successfully');
      }
      setIsAddFormOpen(false);
      setEditingPhase(null);
      reset();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to save phase');
    }
  };

  const handleDelete = async () => {
    if (!phaseToDelete) return;
    try {
      await deletePhase({ id: phaseToDelete._id, programId: program._id }).unwrap();
      sonnerToast.success('Phase deleted successfully');
      setPhaseToDelete(null);
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to delete phase');
    }
  };

  const phases = phasesData?.data || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] relative">
        
        {/* Delete Confirmation Overlay */}
        {phaseToDelete && (
          <div className="absolute inset-0 z-[60] bg-white/95 flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h4>
              <p className="text-gray-500 mb-6">
                You are about to delete <span className="font-bold text-gray-800">"{phaseToDelete.title}"</span>. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPhaseToDelete(null)}
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

        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Manage Phases</h3>
            <p className="text-xs text-blue-600 font-medium">Program: {program.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Phases List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Current Phases</h4>
              <button 
                onClick={() => {
                  if (isAddFormOpen) {
                    setIsAddFormOpen(false);
                    setEditingPhase(null);
                  } else {
                    setIsAddFormOpen(true);
                  }
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {isAddFormOpen ? 'Cancel' : (
                  <><Plus className="w-3 h-3" /> Add New Phase</>
                )}
              </button>
            </div>

            {isAddFormOpen && (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                <div className="sm:col-span-2">
                  <h5 className="text-sm font-bold text-blue-800 mb-2">
                    {editingPhase ? 'Edit Phase' : 'New Phase'}
                  </h5>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Phase Title</label>
                  <input {...register('title', { required: true })} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Phase name..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Description (Optional)</label>
                  <textarea {...register('description')} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={2} placeholder="What this phase covers..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Price ($)</label>
                  <input type="number" {...register('price')} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Duration (Weeks)</label>
                  <input type="number" {...register('durationWeeks')} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Order Index (Unique)</label>
                  <input type="number" {...register('orderIndex', { required: true })} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit" 
                    disabled={isCreating || isUpdating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isCreating || isUpdating ? 'Saving...' : (editingPhase ? 'Update Phase' : 'Add Phase')}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {isLoadingPhases ? (
                <div className="flex items-center justify-center py-12">
                  <Activity className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : phases.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400">No phases defined for this program yet.</p>
                </div>
              ) : (
                phases.map((phase: any) => (
                  <div key={phase._id} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {phase.orderIndex}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-gray-800 truncate">{phase.title}</h5>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => setEditingPhase(phase)}
                             className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                           >
                              <Edit2 className="w-3.5 h-3.5" />
                           </button>
                           <button 
                             onClick={() => setPhaseToDelete(phase)}
                             className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                           >
                              <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        </div>
                      </div>
                      <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                           <span>{phase.durationWeeks} Weeks</span>
                           <span>${phase.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{phase.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-800 hover:bg-black text-white rounded-lg font-bold text-sm transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Programs;
