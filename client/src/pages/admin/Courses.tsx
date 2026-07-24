import React, { useState } from 'react';
import {
  BookOpen, Search, Plus, Edit2, Trash2,
  ShieldAlert, Activity, ChevronLeft, ChevronRight,
  Filter, PlayCircle, Layers, CheckCircle,
  X, AlertCircle, Image as ImageIcon, Video,
  FileText, PlusCircle, Trash, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { useForm, useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';
import RichTextEditor from '../../components/ui/RichTextEditor';
import { hasRichTextContent, stripHtml } from '../../lib/html';
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation
} from '../../features/courses/courseApi';
import { useGetProgramsQuery } from '../../features/programs/programApi';
import { useGetPhasesByProgramQuery } from '../../features/programs/phaseApi';
import { motion, AnimatePresence } from 'framer-motion';

type CourseVideoInput = {
  url: string;
  subtitle?: string;
  description?: string;
};

const normalizeVideoInput = (video: unknown): CourseVideoInput => {
  if (typeof video === 'string') {
    return { url: video, subtitle: '', description: '' };
  }

  if (video && typeof video === 'object' && 'url' in (video as Record<string, unknown>)) {
    const item = video as Record<string, unknown>;
    return {
      url: typeof item.url === 'string' ? item.url : '',
      subtitle: typeof item.subtitle === 'string' ? item.subtitle : '',
      description: typeof item.description === 'string' ? item.description : '',
    };
  }

  return { url: '', subtitle: '', description: '' };
};

const normalizeCourseWeeks = (weeks: any[] | undefined) => {
  if (!Array.isArray(weeks) || weeks.length === 0) {
    return [{ title: 'Week#1', lessons: [], exercises: [] }];
  }

  return weeks.map((week) => ({
    ...week,
    lessons: Array.isArray(week.lessons)
      ? week.lessons.map((lesson: any) => ({
        ...lesson,
        videoUrls: Array.isArray(lesson.videoUrls)
          ? lesson.videoUrls.map((video: unknown) => normalizeVideoInput(video))
          : [],
      }))
      : [],
  }));
};

const Courses: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'course.read');
  const canCreate = hasPermission(permissions, 'course.create');
  const canUpdate = hasPermission(permissions, 'course.update');
  const canDelete = hasPermission(permissions, 'course.delete');

  // Queries
  const { data: coursesData, isLoading, isFetching } = useGetCoursesQuery(
    { page, limit, search, programId: selectedProgramId, phaseId: selectedPhaseId },
    { skip: !canRead }
  );
  const { data: programsData } = useGetProgramsQuery({ limit: 100 });
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view courses.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete._id).unwrap();
      sonnerToast.success('Course deleted successfully');
      setCourseToDelete(null);
    } catch (err) {
      sonnerToast.error('Failed to delete course');
    }
  };

  const courses = coursesData?.data || [];
  const meta = coursesData?.meta;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Course Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage curriculum, lessons, and exercises.</p>
        </div>
        {canCreate && (
          <button
            onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm transition-colors w-full sm:w-auto flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
        <select
          value={selectedProgramId}
          onChange={(e) => { setSelectedProgramId(e.target.value); setSelectedPhaseId(''); }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Programs</option>
          {programsData?.data.map((p: any) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => { setSearch(''); setSelectedProgramId(''); setSelectedPhaseId(''); }}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading || isFetching ? (
          <div className="col-span-full py-20 text-center">
            <Activity className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No courses found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or create a new course.</p>
          </div>
        ) : (
          courses.map((course: any) => (
            <div key={course._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                    {course.program?.title}
                  </span>
                  <span className="px-2 py-1 bg-blue-600/90 backdrop-blur-sm rounded text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                    {course.phase?.title}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{stripHtml(course.description)}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Layers className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">{course.weeks?.length || 0} Weeks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${course.isActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${course.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {canUpdate && (
                      <button
                        onClick={() => { setSelectedCourse(course); setIsModalOpen(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => setCourseToDelete(course)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta && meta.total > limit && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-gray-600">Page {page} of {Math.ceil(meta.total / limit)}</span>
          <button
            disabled={page * limit >= meta.total}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <CourseModal
          course={selectedCourse}
          onClose={() => { setIsModalOpen(false); setSelectedCourse(null); }}
        />
      )}

      {courseToDelete && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in duration-200 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Delete Course?</h4>
            <p className="text-gray-500 mb-6 text-sm">
              Are you sure you want to delete <span className="font-bold text-gray-800">{courseToDelete.title}</span>? This will remove all weeks, lessons, and exercises.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setCourseToDelete(null)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
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
    </div>
  );
};

// --- Course Modal Component ---

const CourseModal: React.FC<{ onClose: () => void, course?: any }> = ({ onClose, course }) => {
  const isEdit = !!course;
  const [step, setStep] = useState(1);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      thumbnail: course?.thumbnail || '',
      program: course?.program?._id || '',
      phase: course?.phase?._id || '',
      weeks: normalizeCourseWeeks(course?.weeks),
      isActive: course?.isActive ?? true
    }
  });

  const watchProgram = watch('program');
  const { data: programsData } = useGetProgramsQuery({ limit: 100 });
  const { data: phasesData } = useGetPhasesByProgramQuery(watchProgram, { skip: !watchProgram });

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const selectedPhase = phasesData?.data.find((p: any) => p._id === watch('phase'));

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await updateCourse({ id: course._id, data }).unwrap();
        sonnerToast.success('Course updated successfully');
      } else {
        await createCourse(data).unwrap();
        sonnerToast.success('Course created successfully');
      }
      onClose();
    } catch (err) {
      sonnerToast.error('Failed to save course');
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const stepLabels = ['Course info', 'Curriculum', 'Review'] as const;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 md:p-8">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in duration-300 flex flex-col max-h-[94vh] sm:max-h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-gray-100 flex justify-between items-start gap-3 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {isEdit ? 'Edit Course' : 'Create New Course'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {stepLabels[step - 1]} · Step {step} of 3
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Standard progress steps */}
        <div className="px-4 sm:px-6 pt-4 pb-3 flex-shrink-0 border-b border-gray-50">
          <div className="flex items-center gap-2 mb-2.5">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : active
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {done ? '✓' : n}
                    </span>
                    <span
                      className={`text-xs font-medium truncate hidden sm:inline ${
                        active ? 'text-gray-900' : done ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {n < 3 && (
                    <div
                      className={`flex-1 h-0.5 rounded-full min-w-[12px] ${
                        step > n ? 'bg-emerald-400' : 'bg-gray-100'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 sm:px-6 py-5 overflow-y-auto flex-1 min-h-0 modal-scroll">
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Course Title
                  </label>
                  <input
                    {...register('title', { required: true })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                    placeholder="Enter course title"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Program
                    </label>
                    <select
                      {...register('program', { required: true })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-medium text-gray-900"
                    >
                      <option value="">Select Program</option>
                      {programsData?.data.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Phase
                    </label>
                    <select
                      {...register('phase', { required: true })}
                      disabled={!watchProgram}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 font-medium text-gray-900"
                    >
                      <option value="">Select Phase</option>
                      {phasesData?.data.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{
                      validate: (v) => hasRichTextContent(v) || 'Description is required',
                    }}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="What will students learn? Add structure with headings, bold, and lists…"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Thumbnail URL
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('thumbnail', { required: true })}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-900"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Price (from phase)
                    </label>
                    <div className="px-3.5 py-2.5 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between h-[42px]">
                      <span className="font-bold text-blue-600 text-lg">${selectedPhase?.price || 0}</span>
                      <AlertCircle className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className="relative">
                    <input type="checkbox" {...register('isActive')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-all duration-300" />
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Course {watch('isActive') ? 'active' : 'inactive'}
                  </span>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in duration-200">
                <WeeksManager control={control} register={register} watch={watch} setValue={setValue} />
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in duration-200 flex flex-col items-center justify-center py-8">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Ready to publish</h4>
                <p className="text-gray-500 text-sm text-center mb-6 max-w-sm">
                  Review your course structure, then save to publish.
                </p>
                <div className="w-full max-w-md bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-2.5">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Title</span>
                    <span className="font-semibold text-gray-800 text-right truncate">{watch('title')}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-semibold text-gray-800">{watch('weeks').length} weeks</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-500">Price</span>
                    <span className="font-semibold text-blue-600">${selectedPhase?.price || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 sm:px-6 py-3.5 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 bg-white pb-[max(0.875rem,env(safe-area-inset-bottom))] flex-shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  !watch('title') ||
                  !hasRichTextContent(watch('description')) ||
                  !watch('program') ||
                  !watch('phase') ||
                  !watch('thumbnail')
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {isCreating || isUpdating ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {isEdit ? 'Update Course' : 'Publish Course'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Weeks Manager (Curriculum) ---

const WeeksManager: React.FC<{ control: any, register: any, watch: any, setValue: any }> = ({ control, register, watch, setValue }) => {
  const { fields, append, remove } = useFieldArray({ control, name: "weeks" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-black text-gray-800">Course Curriculum</h4>
        <button
          type="button"
          onClick={() => append({
            title: `Week#${fields.length + 1}`,
            lessons: [{ title: '', videoUrls: [{ url: '', subtitle: '', description: '' }], pdfUrl: '' }],
            exercises: []
          })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors"
        >
          <PlusCircle className="w-5 h-5" /> Add Week
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((week, index) => (
          <WeekItem
            key={week.id}
            weekIndex={index}
            control={control}
            register={register}
            removeWeek={() => remove(index)}
            watch={watch}
          />
        ))}
      </div>
    </div>
  );
};

const WeekItem: React.FC<{ weekIndex: number, control: any, register: any, removeWeek: () => void, watch: any }> = ({ weekIndex, control, register, removeWeek, watch }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-50">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-100 rounded transition-colors">
            {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-black text-sm">Week #{weekIndex + 1}:</span>
            <input
              {...register(`weeks.${weekIndex}.title`)}
              className="font-black text-gray-800 bg-transparent border-none focus:ring-0 p-0 w-32"
            />
          </div>
        </div>
        <button type="button" onClick={removeWeek} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
          <Trash className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="p-6 space-y-8 animate-in slide-in-from-top-2 duration-300">
          <LessonsManager weekIndex={weekIndex} control={control} register={register} />
          <div className="h-px bg-gray-100" />
          <ExercisesManager weekIndex={weekIndex} control={control} register={register} />
        </div>
      )}
    </div>
  );
};

const LessonsManager: React.FC<{ weekIndex: number, control: any, register: any }> = ({ weekIndex, control, register }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `weeks.${weekIndex}.lessons` });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-500" /> Lessons
        </h5>
        <button
          type="button"
          onClick={() => append({ title: '', videoUrls: [{ url: '', subtitle: '', description: '' }], pdfUrl: '' })}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-blue-100"
        >
          + Add Lesson
        </button>
      </div>

      {fields.map((lesson, lessonIndex) => (
        <div key={lesson.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 relative group">
          <button type="button" onClick={() => remove(lessonIndex)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lesson #{lessonIndex + 1} Title</label>
              <input {...register(`weeks.${weekIndex}.lessons.${lessonIndex}.title`)} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" placeholder="e.g. Introduction to Variables" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PDF Note (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input {...register(`weeks.${weekIndex}.lessons.${lessonIndex}.pdfUrl`)} className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs" placeholder="PDF link" />
              </div>
            </div>
          </div>
          <VideoUrlsManager weekIndex={weekIndex} lessonIndex={lessonIndex} control={control} register={register} />
        </div>
      ))}
    </div>
  );
};

const VideoUrlsManager: React.FC<{ weekIndex: number, lessonIndex: number, control: any, register: any }> = ({ weekIndex, lessonIndex, control, register }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `weeks.${weekIndex}.lessons.${lessonIndex}.videoUrls` });

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Video URLs (YouTube)</label>
      <div className="grid grid-cols-1 gap-2">
        {fields.map((field, videoIndex) => (
          <div key={field.id} className="rounded-xl border border-gray-100 bg-white p-3 space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <PlayCircle className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  {...register(`weeks.${weekIndex}.lessons.${lessonIndex}.videoUrls.${videoIndex}.url`)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  placeholder="https://youtube.com/..."
                />
              </div>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(videoIndex)} className="p-1.5 text-gray-400 hover:text-red-500 self-start">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              {...register(`weeks.${weekIndex}.lessons.${lessonIndex}.videoUrls.${videoIndex}.subtitle`)}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              placeholder={`Lecture ${videoIndex + 1} subtitle (optional)`}
            />
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">Video description (optional)</label>
              <Controller
                name={`weeks.${weekIndex}.lessons.${lessonIndex}.videoUrls.${videoIndex}.description`}
                control={control}
                render={({ field: descField }) => (
                  <RichTextEditor
                    compact
                    value={descField.value || ''}
                    onChange={descField.onChange}
                    placeholder="Video description (optional)"
                    minHeightClass="min-h-[80px]"
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ url: '', subtitle: '', description: '' })}
        className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest mt-1"
      >
        + Add Another Video
      </button>
    </div>
  );
};

const ExercisesManager: React.FC<{ weekIndex: number, control: any, register: any }> = ({ weekIndex, control, register }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `weeks.${weekIndex}.exercises` });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" /> Exercises
        </h5>
        <button
          type="button"
          onClick={() => append({ title: '', questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }] })}
          className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-amber-100"
        >
          + Add Exercise
        </button>
      </div>

      {fields.map((exercise, exerciseIndex) => (
        <div key={exercise.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 relative">
          <button type="button" onClick={() => remove(exerciseIndex)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Exercise Title</label>
            <input {...register(`weeks.${weekIndex}.exercises.${exerciseIndex}.title`)} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" placeholder="e.g. Weekly Quiz #1" />
          </div>
          <QuestionsManager weekIndex={weekIndex} exerciseIndex={exerciseIndex} control={control} register={register} />
        </div>
      ))}
    </div>
  );
};

const QuestionsManager: React.FC<{ weekIndex: number, exerciseIndex: number, control: any, register: any }> = ({ weekIndex, exerciseIndex, control, register }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `weeks.${weekIndex}.exercises.${exerciseIndex}.questions` });

  return (
    <div className="space-y-4 pt-2 border-t border-gray-50">
      {fields.map((question, qIndex) => (
        <div key={question.id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-3 relative">
          <button type="button" onClick={() => remove(qIndex)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500">
            <X className="w-3 h-3" />
          </button>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">Q{qIndex + 1}</span>
            <input {...register(`weeks.${weekIndex}.exercises.${exerciseIndex}.questions.${qIndex}.question`)} className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-gray-700" placeholder="Type question here..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9">
            {[0, 1, 2, 3].map((optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={optIndex}
                  {...register(`weeks.${weekIndex}.exercises.${exerciseIndex}.questions.${qIndex}.correctAnswer`)}
                  className="w-3 h-3 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <input
                  {...register(`weeks.${weekIndex}.exercises.${exerciseIndex}.questions.${qIndex}.options.${optIndex}`)}
                  className="flex-1 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder={`Option ${optIndex + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ question: '', options: ['', '', '', ''], correctAnswer: 0 })}
        className="text-[10px] font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest"
      >
        + Add Question
      </button>
    </div>
  );
};

export default Courses;
