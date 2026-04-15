import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Search, Plus, Edit2, 
  ShieldAlert, Activity, ChevronLeft, ChevronRight, 
  X, Trash2, AlertTriangle, BookOpen, MessageSquare, Users
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { hasPermission } from '../../lib/rbac';
import { toast as sonnerToast } from 'sonner';

import { 
  useGetSchedulesQuery, 
  useCreateScheduleMutation, 
  useUpdateScheduleMutation, 
  useDeleteScheduleMutation 
} from '../../features/batches/scheduleApi';
import { useGetBatchesQuery } from '../../features/batches/batchApi';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const Schedules: React.FC = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<any>(null);
  
  // Permissions
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const canRead = hasPermission(permissions, 'schedule.read');
  const canCreate = hasPermission(permissions, 'schedule.create');
  const canUpdate = hasPermission(permissions, 'schedule.update');
  const canDelete = hasPermission(permissions, 'schedule.delete');

  // Queries
  const { data: batchesData } = useGetBatchesQuery({ page: 1, limit: 100 });
  const { data: schedulesData, isLoading, isFetching } = useGetSchedulesQuery(
    { batchId: selectedBatchId },
    { skip: !canRead }
  );

  const [deleteSchedule, { isLoading: isDeleting }] = useDeleteScheduleMutation();

  const handleDelete = async () => {
    if (!scheduleToDelete) return;
    try {
      await deleteSchedule(scheduleToDelete._id).unwrap();
      sonnerToast.success('Schedule deleted successfully');
      setScheduleToDelete(null);
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || 'Failed to delete schedule');
    }
  };

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500 mt-2">You don't have permission to view schedules.</p>
      </div>
    );
  }

  const schedules = schedulesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
          <p className="text-gray-500 text-sm mt-1">Plan lectures and discussion sessions for each batch.</p>
        </div>
        {canCreate && (
          <button 
            onClick={() => { setSelectedSchedule(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Schedule
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-sm">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Filter by Batch</label>
            <div className="relative">
               <BookOpen className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <select 
                 value={selectedBatchId}
                 onChange={(e) => setSelectedBatchId(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
               >
                 <option value="">All Batches</option>
                 {batchesData?.data.map((b: any) => (
                   <option key={b._id} value={b._id}>
                     {b.batchName} - {b.program?.title} ({b.phase?.title})
                   </option>
                 ))}
               </select>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading || isFetching ? (
          <div className="bg-white p-12 rounded-xl text-center border border-gray-100">
            <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
            <p className="text-gray-500 font-medium">Loading schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center border border-gray-100">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No schedules found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule: any) => (
              <div key={schedule._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <div className={`h-1.5 w-full ${schedule.type === 'LECTURE' ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                <div className="p-5">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          schedule.type === 'LECTURE' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {schedule.type}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800 mt-1">{schedule.dayOfWeek}</h3>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => { setSelectedSchedule(schedule); setIsModalOpen(true); }}
                           className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => setScheduleToDelete(schedule)}
                           className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-bold">{schedule.startTime} - {schedule.endTime}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cap: {schedule.capacity || 20}</span>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                         <Activity className="w-3.5 h-3.5 text-blue-500" />
                         <span className="text-xs font-black text-blue-900 uppercase tracking-widest">{schedule.sessionLabel}</span>
                      </div>

                      <div className="pt-3 border-t border-gray-50 flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 px-1 text-center">
                            {schedule.batch?.batchName}
                         </div>
                         <div className="min-w-0">
                            <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{schedule.batch?.program?.title}</p>
                            <p className="text-xs text-gray-700 font-bold truncate leading-none">{schedule.batch?.phase?.title}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {scheduleToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h4>
            <p className="text-gray-500 mb-6 text-sm">
              Delete <span className="font-bold text-gray-800">{scheduleToDelete.type}</span> on <span className="font-bold text-gray-800">{scheduleToDelete.dayOfWeek}</span> for batch <span className="font-bold text-gray-800">{scheduleToDelete.batch?.batchName}</span>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setScheduleToDelete(null)}
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
        <ScheduleModal 
          schedule={selectedSchedule} 
          onClose={() => { setIsModalOpen(false); setSelectedSchedule(null); }} 
        />
      )}
    </div>
  );
};

// --- Schedule Modal (Create/Edit) ---

const ScheduleModal: React.FC<{ onClose: () => void, schedule?: any }> = ({ onClose, schedule }) => {
  const isEdit = !!schedule;
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      batch: schedule?.batch?._id || '',
      sessionLabel: schedule?.sessionLabel || 'Lecture 1',
      type: schedule?.type || 'LECTURE',
      capacity: schedule?.capacity || 20,
      slots: isEdit 
        ? [{ dayOfWeek: schedule.dayOfWeek, startTime: schedule.startTime, endTime: schedule.endTime }]
        : [{ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '11:00' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots"
  });

  const { data: batchesData } = useGetBatchesQuery({ page: 1, limit: 100 });
  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] = useUpdateScheduleMutation();

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        const payload = {
          batch: data.batch,
          sessionLabel: data.sessionLabel,
          type: data.type,
          capacity: data.capacity,
          ...data.slots[0]
        };
        await updateSchedule({ id: schedule._id, data: payload }).unwrap();
        sonnerToast.success('Schedule updated successfully');
      } else {
        const promises = data.slots.map((slot: any) => {
          const payload = {
            batch: data.batch,
            sessionLabel: data.sessionLabel,
            type: data.type,
            capacity: data.capacity,
            ...slot
          };
          return createSchedule(payload).unwrap();
        });
        await Promise.all(promises);
        sonnerToast.success(`${data.slots.length} schedule(s) created successfully`);
      }
      onClose();
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} schedule`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Schedule' : 'Create New Schedule'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Target Batch</label>
            <select 
              {...register('batch', { required: 'Batch is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">Select batch...</option>
              {batchesData?.data.map((b: any) => (
                <option key={b._id} value={b._id}>
                  {b.batchName} - {b.program?.title} ({b.phase?.title})
                </option>
              ))}
            </select>
            {errors.batch && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase italic">Required</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Session Group</label>
                <input 
                  type="text"
                  {...register('sessionLabel', { required: 'Group label is required' })}
                  placeholder="e.g. Lecture 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                {errors.sessionLabel && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase italic">Required</p>}
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Capacity</label>
                <input 
                  type="number"
                  {...register('capacity', { required: true, min: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Session Type</label>
             <select 
               {...register('type', { required: true })}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
             >
               <option value="LECTURE">Lecture</option>
               <option value="DISCUSSION">Discussion</option>
             </select>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Days & Times</label>
              {!isEdit && (
                <button 
                  type="button" 
                  onClick={() => append({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '11:00' })}
                  className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded"
                >
                  <Plus className="w-3 h-3" /> Add Day
                </button>
              )}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3 relative group">
                {!isEdit && fields.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                
                <div className="grid grid-cols-1 gap-3">
                   <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Day of Week</label>
                      <select 
                        {...register(`slots.${index}.dayOfWeek` as const, { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      >
                        {DAYS.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Start Time</label>
                        <input 
                          type="time"
                          {...register(`slots.${index}.startTime` as const, { required: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">End Time</label>
                        <input 
                          type="time"
                          {...register(`slots.${index}.endTime` as const, { required: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-100 transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : (isEdit ? 'Update Schedule' : 'Create Schedule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Schedules;
