import React, { useState } from 'react';
import { 
  BookOpen, Search, Plus, Edit2, Trash2, 
  ShieldAlert, Activity, ChevronLeft, ChevronRight,
  Filter, PlayCircle, Layers, CheckCircle, 
  X, AlertCircle, Image as ImageIcon, Video,
  FileText, PlusCircle, Trash, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft
} from 'lucide-react';
import { useForm, useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';
import { 
  useGetCoursesQuery, 
  useCreateCourseMutation, 
  useUpdateCourseMutation,
  useDeleteCourseMutation 
} from '../../features/courses/courseApi';
import { useGetProgramsQuery } from '../../features/programs/programApi';
import { useGetPhasesByProgramQuery } from '../../features/programs/phaseApi';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage curriculum, lessons, and exercises.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
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
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Layers className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">{course.weeks?.length || 0} Weeks</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${course.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in duration-200">
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
      weeks: course?.weeks || [{ title: 'Week#1', lessons: [], exercises: [] }],
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{isEdit ? 'Edit Course' : 'Create New Course'}</h3>
            <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">Step {step} of 3 • {step === 1 ? 'Course Info' : step === 2 ? 'Curriculum' : 'Content Details'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex px-12 pt-8 pb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500 ${
                step === s ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-100' : 
                step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-700 ${step > s ? 'bg-green-500' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Course Title</label>
                      <input 
                        {...register('title', { required: true })} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" 
                        placeholder="Enter course title" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                      <textarea 
                        {...register('description', { required: true })} 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px]" 
                        placeholder="What will students learn?" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Program</label>
                        <select 
                          {...register('program', { required: true })} 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer font-bold"
                        >
                          <option value="">Select Program</option>
                          {programsData?.data.map((p: any) => <option key={p._id} value={p._id}>{p.title}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phase</label>
                        <select 
                          {...register('phase', { required: true })} 
                          disabled={!watchProgram}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 font-bold"
                        >
                          <option value="">Select Phase</option>
                          {phasesData?.data.map((p: any) => <option key={p._id} value={p._id}>{p.title}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (Inherited from Phase)</label>
                      <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                        <span className="font-black text-blue-600 text-xl">${selectedPhase?.price || 0}</span>
                        <AlertCircle className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Thumbnail URL</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          {...register('thumbnail', { required: true })} 
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                          placeholder="https://..." 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <WeeksManager control={control} register={register} watch={watch} setValue={setValue} />
              </div>
            )}

            {step === 3 && (
              <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col items-center justify-center py-10">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-50">
                   <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-2">Ready to Publish!</h4>
                <p className="text-gray-500 max-w-md text-center mb-8">
                  Review your course structure. You can go back to make changes or click save to publish the course.
                </p>
                <div className="w-full max-w-lg bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-3">
                   <div className="flex justify-between">
                     <span className="text-sm font-bold text-gray-400">Title:</span>
                     <span className="text-sm font-black text-gray-800">{watch('title')}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-sm font-bold text-gray-400">Total Duration:</span>
                     <span className="text-sm font-black text-gray-800">{watch('weeks').length} Weeks</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-sm font-bold text-gray-400">Price:</span>
                     <span className="text-sm font-black text-blue-600">${selectedPhase?.price || 0}</span>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all">
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                disabled={!watch('title') || !watch('program') || !watch('phase')}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.95] disabled:opacity-50"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isCreating || isUpdating}
                className="flex items-center gap-2 px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.95] disabled:opacity-50"
              >
                {isCreating || isUpdating ? <Activity className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
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
          onClick={() => append({ title: `Week#${fields.length + 1}`, lessons: [], exercises: [] })}
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
          <input 
            {...register(`weeks.${weekIndex}.title`)} 
            className="font-black text-gray-800 bg-transparent border-none focus:ring-0 p-0 w-32"
          />
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
          onClick={() => append({ title: '', videoUrls: [''], pdfUrl: '' })}
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
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lesson Title</label>
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
          <div key={field.id} className="flex gap-2">
            <div className="relative flex-1">
              <PlayCircle className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input 
                {...register(`weeks.${weekIndex}.lessons.${lessonIndex}.videoUrls.${videoIndex}`)} 
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs" 
                placeholder="https://youtube.com/..." 
              />
            </div>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(videoIndex)} className="p-1.5 text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button 
        type="button" 
        onClick={() => append('')}
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
