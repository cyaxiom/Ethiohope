import React, { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, CheckCircle2, Activity, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useUpdateEnrollmentScheduleMutation } from '../../features/enrollments/enrollmentApi';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: any;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ isOpen, onClose, enrollment }) => {
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});
  const [updateSchedule, { isLoading }] = useUpdateEnrollmentScheduleMutation();

  // Extract batch and schedules
  const batch = enrollment?.batch;
  const allSchedules = batch?.schedules || [];

  // Group schedules by sessionLabel
  const groupedSchedules = React.useMemo(() => {
    return allSchedules.reduce((acc: any, s: any) => {
      if (!acc[s.sessionLabel]) acc[s.sessionLabel] = [];
      acc[s.sessionLabel].push(s);
      return acc;
    }, {});
  }, [allSchedules]);

  const requiredSessionLabels = Object.keys(groupedSchedules);

  useEffect(() => {
    if (isOpen && enrollment?.selectedSchedules) {
      const initial: Record<string, string> = {};
      enrollment.selectedSchedules.forEach((s: any) => {
        // If s is populated, it has sessionLabel. If not, find it from allSchedules
        let label = s.sessionLabel;
        const id = s._id || s;
        
        if (!label && typeof s === 'string') {
          const found = allSchedules.find((item: any) => (item._id || item) === s);
          label = found?.sessionLabel;
        }
        
        if (label) {
          initial[label] = id;
        }
      });
      setSelectedSchedules(initial);
    }
  }, [isOpen, enrollment, allSchedules]);

  const handleSlotSelect = (label: string, slotId: string) => {
    setSelectedSchedules(prev => ({
      ...prev,
      [label]: slotId
    }));
  };

  const checkConflicts = (label: string, slot: any) => {
    for (const otherLabel of Object.keys(selectedSchedules)) {
      if (otherLabel === label) continue;
      const otherSlotId = selectedSchedules[otherLabel];
      const otherSlot = allSchedules.find((s: any) => (s._id || s) === otherSlotId);
      
      if (otherSlot && otherSlot.dayOfWeek === slot.dayOfWeek) {
        if (
          (slot.startTime >= otherSlot.startTime && slot.startTime < otherSlot.endTime) ||
          (otherSlot.startTime >= slot.startTime && otherSlot.startTime < slot.endTime)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const isAllSchedulesSelected = requiredSessionLabels.every(label => selectedSchedules[label]);

  const handleSave = async () => {
    try {
      await updateSchedule({
        enrollmentId: enrollment._id,
        selectedSchedules: Object.values(selectedSchedules)
      }).unwrap();
      toast.success('Schedule updated successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update schedule');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Edit Schedule</h3>
            <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{enrollment?.program?.title} 🚀</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8">
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4">
             <div className="p-3 bg-blue-600 text-white rounded-2xl">
               <Clock className="w-6 h-6" />
             </div>
             <div>
               <h4 className="font-black text-gray-800 text-sm">Active Batch: {batch?.batchName}</h4>
               <p className="text-xs text-blue-600 font-bold">You can change preferred session times from the available slots.</p>
             </div>
          </div>

          <div className="space-y-6">
            {requiredSessionLabels.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold italic">No session slots available for this batch.</p>
              </div>
            ) : (
              requiredSessionLabels.map((label) => (
                <div key={label} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-blue-600 rounded-full" />
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{label}</h6>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {groupedSchedules[label].map((slot: any) => {
                      const isSelected = selectedSchedules[label] === (slot._id || slot);
                      const hasConflict = !isSelected && checkConflicts(label, slot);
                      return (
                        <button
                          key={slot._id || slot}
                          type="button"
                          disabled={hasConflict || isLoading}
                          onClick={() => handleSlotSelect(label, slot._id || slot)}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 text-left relative overflow-hidden group ${
                            isSelected ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-600/10' : 
                            hasConflict ? 'opacity-50 cursor-not-allowed grayscale' : 
                            'bg-white border-gray-100 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                              {slot.dayOfWeek}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div className={`flex items-center gap-1.5 font-bold text-[10px] ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}>
                            <Clock className="w-3 h-3" /> {slot.startTime} - {slot.endTime}
                          </div>
                          
                          {/* Capacity info if available */}
                          {slot.capacity && (
                             <div className="mt-2 text-[8px] font-black uppercase tracking-tighter opacity-50">
                               Max Capacity: {slot.capacity}
                             </div>
                          )}

                          {hasConflict && (
                             <div className="absolute inset-0 bg-red-50/70 flex items-center justify-center p-2">
                               <AlertTriangle className="w-4 h-4 text-red-600" />
                               <span className="text-[10px] font-black text-red-600 ml-2">CONFLICT</span>
                             </div>
                           )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isLoading}
            className="px-8 py-3.5 text-gray-500 font-bold hover:bg-gray-200 rounded-2xl transition-all"
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            onClick={handleSave}
            disabled={isLoading || !isAllSchedulesSelected}
            className={`px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-3`}
          >
            {isLoading ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isLoading ? 'Saving...' : 'Update Schedule'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditScheduleModal;
