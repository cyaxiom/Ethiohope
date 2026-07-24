import React, { useState, useEffect } from 'react';
import { 
  Library, Search, Plus, Edit2, 
  ShieldAlert, Activity, CheckCircle2,
  ChevronLeft, ChevronRight, X, Layers, Trash2, AlertTriangle,
  Upload, Link as LinkIcon, Package
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { stripHtml } from '../../lib/html';
import { 
  useGetProgramsQuery, 
  useCreateProgramMutation, 
  useUpdateProgramMutation,
  useDeleteProgramMutation
} from '../../features/programs/programApi';
import { 
  useGetPhasesByProgramQuery, 
  useCreatePhaseMutation,
  useUpdatePhaseMutation,
  useDeletePhaseMutation
} from '../../features/programs/phaseApi';
import {
  useGetPackagesByProgramQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from '../../features/programs/packageApi';
import { PACKAGE_DAYS_LABELS } from '../../common/academicSubjects';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';
import { useUploadFileMutation } from '../../features/upload/uploadApi';
import { getImageUrl } from '../../lib/utils';

const Programs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhasesModalOpen, setIsPhasesModalOpen] = useState(false);
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [programToDelete, setProgramToDelete] = useState<any>(null);
  
  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'program.read');
  const canCreate = hasPermission(permissions, 'program.create');
  const canUpdate = hasPermission(permissions, 'program.update');
  const canDelete = hasPermission(permissions, 'program.delete');
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
  const [deleteProgram, { isLoading: isDeleting }] = useDeleteProgramMutation();

  const handleDeleteProgram = async () => {
    if (!programToDelete) return;
    try {
      await deleteProgram(programToDelete._id).unwrap();
      sonnerToast.success('Program deleted successfully');
      setProgramToDelete(null);
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to delete program');
    }
  };

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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Program Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage educational programs.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors w-full sm:w-auto"
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

      {/* Programs list — cards on mobile, table on md+ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {isLoading || isFetching ? (
            <div className="px-4 py-10 text-center text-gray-400">
              <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading programs...
            </div>
          ) : programs.length === 0 ? (
            <div className="px-4 py-10 text-center text-gray-400">No programs found.</div>
          ) : (
            programs.map((program: any) => (
              <div key={program._id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-blue-100 text-blue-600 flex items-center justify-center border border-gray-100 flex-shrink-0">
                    {program.image ? (
                      <img src={getImageUrl(program.image)} alt={program.title} className="w-full h-full object-cover" />
                    ) : (
                      <Library className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{program.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">#{program.orderIndex} · {new Date(program.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 ${
                        program.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {program.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {program.ageRange?.trim() || '—'}
                      </span>
                      {program.isForChildren && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-100">
                          Kids
                        </span>
                      )}
                      {program.programType === 'ACADEMIC_TUTORIAL' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-violet-50 text-violet-700 border border-violet-100">
                          Tutorial
                        </span>
                      )}
                    </div>
                    {program.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{stripHtml(program.description)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-50">
                  {program.programType === 'ACADEMIC_TUTORIAL' ? (
                    canUpdate && (
                      <button
                        onClick={() => { setSelectedProgram(program); setIsPackagesModalOpen(true); }}
                        className="p-2 text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                        title="Manage Packages"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                    )
                  ) : (
                    canReadPhase && (
                      <button
                        onClick={() => { setSelectedProgram(program); setIsPhasesModalOpen(true); }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Manage Phases"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                    )
                  )}
                  {canUpdate && (
                    <>
                      <button
                        onClick={() => handleToggleStatus(program)}
                        className={`p-2 rounded-md transition-colors ${
                          program.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={program.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedProgram(program); setIsEditModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Program"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => setProgramToDelete(program)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Program Title</th>
                <th className="px-6 py-4 font-medium">Age Range</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading programs...
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((program: any) => (
                  <tr key={program._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-400">#{program.orderIndex}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-100 text-blue-600 flex items-center justify-center border border-gray-100 flex-shrink-0">
                          {program.image ? (
                            <img src={getImageUrl(program.image)} alt={program.title} className="w-full h-full object-cover" />
                          ) : (
                            <Library className="w-5 h-5" />
                          )}
                        </div>
                        <p className="font-medium text-gray-800">{program.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 w-fit">
                          {program.ageRange?.trim() || '—'}
                        </span>
                        {program.isForChildren && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-100 w-fit">
                            Kids
                          </span>
                        )}
                        {program.programType === 'ACADEMIC_TUTORIAL' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide bg-violet-50 text-violet-700 border border-violet-100 w-fit">
                            Academic Tutorial
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 max-w-xs truncate" title={stripHtml(program.description)}>
                        {stripHtml(program.description) || 'No description'}
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
                        {program.programType === 'ACADEMIC_TUTORIAL' ? (
                          canUpdate && (
                            <button 
                              onClick={() => { setSelectedProgram(program); setIsPackagesModalOpen(true); }}
                              className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
                              title="Manage Packages"
                            >
                              <Package className="w-4 h-4" />
                            </button>
                          )
                        ) : (
                          canReadPhase && (
                            <button 
                              onClick={() => { setSelectedProgram(program); setIsPhasesModalOpen(true); }}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                              title="Manage Phases"
                            >
                              <Layers className="w-4 h-4" />
                            </button>
                          )
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
                        {canDelete && (
                          <button 
                            onClick={() => setProgramToDelete(program)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Program"
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
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> programs
            </p>
            <div className="flex gap-2 justify-center sm:justify-end">
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

      {isPackagesModalOpen && selectedProgram && (
        <PackageManagementModal
          program={selectedProgram}
          onClose={() => { setIsPackagesModalOpen(false); setSelectedProgram(null); }}
        />
      )}

      {/* Delete Program Confirmation Modal */}
      {programToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 p-8 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Cascade Delete Program?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-gray-800">"{programToDelete.title}"</span>? <br/><br/>
              <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded text-xs uppercase tracking-wider">Warning:</span><br/>
              This will permanently delete all related <strong>Phases</strong>, <strong>Batches</strong>, <strong>Courses</strong>, and <strong>Enrollments</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setProgramToDelete(null)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProgram}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Program Modal (Create/Edit) ---

const ProgramModal: React.FC<{ onClose: () => void, program?: any }> = ({ onClose, program }) => {
  const isEdit = !!program;
  const [imageTab, setImageTab] = useState<'upload' | 'url'>(program?.image?.startsWith('http') ? 'url' : 'upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(program?.image ? getImageUrl(program.image) : '');
  
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm({
    defaultValues: {
      title: program?.title || '',
      description: program?.description || '',
      image: program?.image || '',
      ageRange: program?.ageRange || '',
      isForChildren: program?.isForChildren ?? false,
      programType: program?.programType || 'STANDARD',
      isActive: program?.isActive ?? true,
      orderIndex: program?.orderIndex || 0
    }
  });

  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const isLoading = isCreating || isUpdating || isUploading;
  const currentImageUrl = watch('image');

  // Update preview when URL changes manually
  useEffect(() => {
    if (imageTab === 'url' && currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl, imageTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let finalImageUrl = data.image;

      // If there's a selected file, upload it first
      if (imageTab === 'upload' && selectedFile) {
        const uploadResult = await uploadFile({ file: selectedFile, category: 'programs' }).unwrap();
        finalImageUrl = uploadResult.data.url;
      }

      const programData = { 
        ...data, 
        image: finalImageUrl,
        orderIndex: Number(data.orderIndex),
        isForChildren: Boolean(data.isForChildren),
        programType: data.programType || 'STANDARD',
        isActive: Boolean(data.isActive),
      };

      if (isEdit) {
        await updateProgram({ id: program._id, ...programData }).unwrap();
        sonnerToast.success('Program updated successfully');
      } else {
        await createProgram(programData).unwrap();
        sonnerToast.success('Program created successfully');
      }
      onClose();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} program`);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 md:p-8">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh] sm:max-h-[85vh] sm:my-10">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Program' : 'Create New Program'}</h3>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
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
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write a detailed program description. Use bold, lists, and headings…"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Image</label>
              <div className="space-y-3">
                {/* Image Preview */}
                <div className="w-full h-32 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Library className="w-8 h-8 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-400 mt-1">No image selected</p>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                      imageTab === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload local
                  </button>
                  <button 
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                      imageTab === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    URL Link
                  </button>
                </div>

                {/* Input Based on Tab */}
                {imageTab === 'upload' ? (
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4" />
                      {selectedFile ? selectedFile.name : 'Choose image file...'}
                    </div>
                  </div>
                ) : (
                  <input 
                    {...register('image')} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Range <span className="text-gray-400 font-normal">(optional, kids programs)</span>
              </label>
              <input 
                {...register('ageRange')} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. 9-12 — leave blank if open to everyone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Index (Unique)</label>
              <input 
                type="number"
                {...register('orderIndex', { required: 'Order Index is required' })} 
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.orderIndex ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                }`}
                placeholder="e.g., 1"
              />
              {errors.orderIndex && <p className="text-xs text-red-500 mt-1">{errors.orderIndex.message as string}</p>}
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <input 
                type="checkbox" 
                id="isForChildren"
                {...register('isForChildren')}
                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
              />
              <label htmlFor="isForChildren" className="text-sm font-medium text-gray-700 cursor-pointer">
                <span className="font-bold">For children</span>
                <span className="block text-xs text-gray-500 font-normal mt-0.5">
                  Enrollment will only offer the child registration flow (no adult self-apply).
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program type</label>
              <select
                {...register('programType')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="STANDARD">Standard (phases + batches)</option>
                <option value="ACADEMIC_TUTORIAL">Academic Tutorial (monthly packages)</option>
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                Academic Tutorial uses weekly packages with recurring monthly billing — no phases.
              </p>
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
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 min-w-[100px]">
              {isUploading ? 'Uploading...' : (isLoading ? 'Saving...' : (isEdit ? 'Update Program' : 'Create Program'))}
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
      setValue('isActive', editingPhase.isActive ?? true);
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
            orderIndex: Number(data.orderIndex),
            isActive: Boolean(data.isActive)
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
          orderIndex: Number(data.orderIndex),
          isActive: data.isActive === undefined ? true : Boolean(data.isActive)
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
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 md:p-8">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh] sm:max-h-[85vh] sm:my-10 relative">
        
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
            {/* Phases List - Hide when editing */}
            {!editingPhase && (
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
                    <div className="flex items-center gap-2 pt-6">
                      <input type="checkbox" id="phaseIsActive" {...register('isActive')} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      <label htmlFor="phaseIsActive" className="text-xs font-bold text-gray-700 cursor-pointer">
                        Phase is Active (Open)
                      </label>
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
                             <div className="flex items-center gap-2 truncate">
                               <h5 className="font-bold text-gray-800 truncate">{phase.title}</h5>
                               <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest ${phase.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                 {phase.isActive !== false ? 'Open' : 'Closed'}
                               </span>
                             </div>
                            <div className="flex gap-1 flex-shrink-0">
                               <button 
                                 onClick={() => setEditingPhase(phase)}
                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                 title="Edit phase"
                               >
                                  <Edit2 className="w-3.5 h-3.5" />
                               </button>
                               <button 
                                 onClick={() => setPhaseToDelete(phase)}
                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                 title="Delete phase"
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
            )}

            {/* If editing, show the form outside the list */}
            {editingPhase && (
               <form onSubmit={handleSubmit(onSubmit)} className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="sm:col-span-2 flex justify-between items-center mb-2">
                    <h5 className="text-lg font-bold text-blue-800">Editing Phase: {editingPhase.title}</h5>
                    <button type="button" onClick={() => setEditingPhase(null)} className="text-xs font-bold text-gray-500 hover:text-gray-700">Cancel Edit</button>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Phase Title</label>
                    <input {...register('title', { required: true })} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Phase name..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Description (Optional)</label>
                    <textarea {...register('description')} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="What this phase covers..." />
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
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="editPhaseIsActive" {...register('isActive')} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <label htmlFor="editPhaseIsActive" className="text-xs font-bold text-gray-700 cursor-pointer">
                      Phase is Active (Open)
                    </label>
                  </div>
                  <div className="sm:col-span-2 mt-4">
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isUpdating ? 'Updating...' : 'Save Phase Changes'}
                    </button>
                  </div>
               </form>
            )}
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

// --- Package Management Modal (Academic Tutorial) ---

const PackageManagementModal: React.FC<{ program: any; onClose: () => void }> = ({ program, onClose }) => {
  const { data: packagesData, isLoading } = useGetPackagesByProgramQuery(program._id);
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [updatePackage, { isLoading: isUpdating }] = useUpdatePackageMutation();
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [packageToDelete, setPackageToDelete] = useState<any>(null);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      price: 100,
      daysPerWeek: 3,
      description: '',
      isPopular: true,
      isActive: true,
      orderIndex: 3,
    },
  });

  useEffect(() => {
    if (editingPackage) {
      setValue('name', editingPackage.name);
      setValue('price', editingPackage.price);
      setValue('daysPerWeek', editingPackage.daysPerWeek);
      setValue('description', editingPackage.description || '');
      setValue('isPopular', editingPackage.isPopular ?? false);
      setValue('isActive', editingPackage.isActive ?? true);
      setValue('orderIndex', editingPackage.orderIndex ?? editingPackage.daysPerWeek);
      setIsAddFormOpen(true);
    } else {
      reset();
    }
  }, [editingPackage, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name || PACKAGE_DAYS_LABELS[Number(data.daysPerWeek)],
        price: Number(data.price),
        daysPerWeek: Number(data.daysPerWeek),
        description: data.description,
        isPopular: Boolean(data.isPopular),
        isActive: data.isActive === undefined ? true : Boolean(data.isActive),
        orderIndex: Number(data.orderIndex || data.daysPerWeek),
      };

      if (editingPackage) {
        await updatePackage({
          id: editingPackage._id,
          programId: program._id,
          data: payload,
        }).unwrap();
        sonnerToast.success('Package updated');
      } else {
        await createPackage({ program: program._id, ...payload }).unwrap();
        sonnerToast.success('Package created');
      }
      setIsAddFormOpen(false);
      setEditingPackage(null);
      reset();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to save package');
    }
  };

  const handleDelete = async () => {
    if (!packageToDelete) return;
    try {
      await deletePackage({ id: packageToDelete._id, programId: program._id }).unwrap();
      sonnerToast.success('Package deleted');
      setPackageToDelete(null);
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to delete package');
    }
  };

  const packages = packagesData?.data || [];

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 md:p-8">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Tutoring Packages</h3>
            <p className="text-sm text-gray-500 truncate">{program.title} · monthly prices</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
            <p className="text-sm text-gray-500">
              Each package is billed monthly. Parents pick frequency, subjects, and availability blocks.
            </p>
            {!isAddFormOpen && (
              <button
                type="button"
                onClick={() => {
                  setEditingPackage(null);
                  reset({
                    name: '',
                    price: 100,
                    daysPerWeek: 3,
                    description: '',
                    isPopular: true,
                    isActive: true,
                    orderIndex: 3,
                  });
                  setIsAddFormOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 w-full sm:w-auto flex-shrink-0"
              >
                <Plus className="w-4 h-4" /> Add package
              </button>
            )}
          </div>

          {isAddFormOpen && !editingPackage && (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-violet-50/60 border border-violet-100 rounded-xl p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Days per week</label>
                  <select {...register('daysPerWeek', { required: true })} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <option key={d} value={d}>{PACKAGE_DAYS_LABELS[d]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Monthly price ($)</label>
                  <input type="number" step="0.01" {...register('price', { required: true })} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Display name</label>
                  <input {...register('name')} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none" placeholder="Auto from days if empty" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                  <textarea {...register('description')} rows={2} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <input type="checkbox" {...register('isActive')} className="rounded" /> Active
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <input type="checkbox" {...register('isPopular')} className="rounded" /> Popular (shown center with badge)
                </label>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={isCreating} className="flex-1 py-2.5 bg-violet-600 text-white font-bold rounded-lg disabled:opacity-50">
                  {isCreating ? 'Saving…' : 'Create package'}
                </button>
                <button type="button" onClick={() => setIsAddFormOpen(false)} className="px-4 py-2.5 text-gray-600 font-medium">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="py-10 text-center text-gray-400">Loading packages…</div>
          ) : packages.length === 0 ? (
            <div className="py-10 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
              No packages yet. Add once / twice / 3x / 4x / 5x weekly options with monthly prices.
            </div>
          ) : (
            <div className="space-y-2">
              {packages.map((pkg: any) => (
                <div key={pkg._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-violet-200">
                  <div>
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                      {pkg.name}
                      {pkg.isPopular && (
                        <span className="text-[10px] uppercase tracking-wide font-black px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                          Popular
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {PACKAGE_DAYS_LABELS[pkg.daysPerWeek] || `${pkg.daysPerWeek}x / week`} · ${pkg.price}/mo
                      {!pkg.isActive && ' · Inactive'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingPackage(pkg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageToDelete(pkg)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingPackage && (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-violet-50/60 border border-violet-100 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-violet-900">Edit: {editingPackage.name}</h5>
                <button type="button" onClick={() => setEditingPackage(null)} className="text-xs text-gray-500">
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Days per week</label>
                  <select {...register('daysPerWeek', { required: true })} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <option key={d} value={d}>{PACKAGE_DAYS_LABELS[d]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Monthly price ($)</label>
                  <input type="number" step="0.01" {...register('price', { required: true })} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Display name</label>
                  <input {...register('name', { required: true })} className="w-full px-3 py-2 border border-violet-200 rounded-lg outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <input type="checkbox" {...register('isActive')} className="rounded" /> Active
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <input type="checkbox" {...register('isPopular')} className="rounded" /> Popular (shown center with badge)
                </label>
              </div>
              <button type="submit" disabled={isUpdating} className="w-full py-2.5 bg-violet-600 text-white font-bold rounded-lg disabled:opacity-50">
                {isUpdating ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold text-sm">
            Done
          </button>
        </div>
      </div>

      {packageToDelete && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="font-bold text-gray-900 mb-1">Delete package?</p>
            <p className="text-sm text-gray-500 mb-4">{packageToDelete.name}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPackageToDelete(null)} className="flex-1 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
