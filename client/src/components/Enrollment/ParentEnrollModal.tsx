import React, { useState, useEffect, useRef } from 'react';
import { X, User, CheckCircle2, ChevronDown, Activity, Users, Clock, AlertTriangle, BookOpen, CreditCard, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useGetPublicPhasesByProgramQuery } from '../../features/programs/phaseApi';
import { useGetPublicBatchesByProgramQuery } from '../../features/programs/batchApi';
import { usePrepareEnrollmentMutation } from '../../features/enrollments/enrollmentApi';
import { useGetParentChildrenQuery } from '../../features/user/userApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ParentEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: any;
  initialPhaseId?: string;
}

const formatTime12h = (time: string) => {
  if (!time) return '';
  const parts = time.split(':');
  if (parts.length < 2) return time;
  const [hours, minutes] = parts;
  let h = parseInt(hours, 10);
  if (isNaN(h)) return time;
  const m = minutes;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
};

const ParentEnrollModal: React.FC<ParentEnrollModalProps> = ({ isOpen, onClose, program, initialPhaseId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});
  const [createdEnrollmentIds, setCreatedEnrollmentIds] = useState<string[]>([]);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<{
    childIds: string[];
    phaseId: string;
    batchId: string;
  }>({
    defaultValues: {
      childIds: [],
      phaseId: initialPhaseId || '',
      batchId: ''
    }
  });

  const selectedChildIds = watch('childIds');
  const selectedPhaseId = watch('phaseId');
  const selectedBatchId = watch('batchId');

  // Queries
  const { data: childrenResponse, isLoading: isLoadingChildren } = useGetParentChildrenQuery();
  const { data: phasesResponse, isLoading: isLoadingPhases } = useGetPublicPhasesByProgramQuery(program?._id, { skip: !program?._id });
  const { data: batchesData, isLoading: isLoadingBatches } = useGetPublicBatchesByProgramQuery(program?._id, { skip: !program?._id });
  const [prepareEnrollment, { isLoading: isSubmitting }] = usePrepareEnrollmentMutation();

  const allChildren = childrenResponse?.data || [];
  const phases = (phasesResponse?.data || []);
  const batches = batchesData?.data || [];
  
  // Filter available children: Exclude those already PAID/ACTIVE or PENDING for the current phase
  const children = allChildren.filter((child: any) => {
    if (!selectedPhaseId) return true;
    const existingEnrollment = child.enrollments?.find((e: any) => 
      (e.phase?._id === selectedPhaseId || e.phase === selectedPhaseId) && 
      (e.paymentStatus === 'PAID' || e.status === 'ACTIVE' || e.status === 'PENDING')
    );
    return !existingEnrollment;
  });

  const selectedPhase = phases.find((p: any) => p._id === selectedPhaseId);
  const selectedBatch = batches.find(b => b._id === selectedBatchId);

  // Group schedules for the selected batch
  const groupedSchedules = React.useMemo(() => {
    if (!selectedBatch?.schedules) return {};
    return (selectedBatch.schedules as any[]).reduce((acc: any, s: any) => {
      if (!acc[s.sessionLabel]) acc[s.sessionLabel] = [];
      acc[s.sessionLabel].push(s);
      return acc;
    }, {});
  }, [selectedBatch]);

  const requiredSessionLabels = Object.keys(groupedSchedules);
  const isAllSchedulesSelected = requiredSessionLabels.every(label => selectedSchedules[label]);

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
      const otherSlot = (selectedBatch?.schedules as any[])?.find((s: any) => s._id === otherSlotId);
      
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

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedSchedules({});
      setValue('childIds', []);
      setValue('phaseId', initialPhaseId || '');
      setValue('batchId', '');
    }
  }, [isOpen, setValue, initialPhaseId]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        enrolleeType: 'CHILD' as const,
        childIds: data.childIds,
        programId: program._id,
        phaseId: data.phaseId,
        batchId: data.batchId,
        selectedSchedules: Object.values(selectedSchedules)
      };

      const result = await prepareEnrollment(payload).unwrap();
      setCreatedEnrollmentIds(result.data?.enrollmentIds || []);
      setStep(4); // Success step
      toast.success(result.message);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to prepare enrollment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-t-2xl sm:rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-100">
        
        {/* Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex justify-between items-start gap-3 bg-gray-50/50 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Enroll Your Child</h3>
            <p className="text-blue-600 font-bold text-xs sm:text-sm uppercase tracking-wider truncate mt-1">{program.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0" aria-label="Close">
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="flex px-4 sm:px-12 pt-5 sm:pt-8 pb-3 sm:pb-4 flex-shrink-0">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step === s ? 'bg-blue-600 text-white scale-105 sm:scale-110 shadow-lg shadow-blue-200' : 
                step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 sm:h-1.5 mx-1.5 sm:mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-green-500' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="px-4 sm:px-10 py-5 sm:py-8 overflow-y-auto flex-1 custom-scrollbar">
            
            {/* Step 1: Select Child & Phase */}
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* 1. Child Selection - PRIMARY */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Select Your Child</label>
                  <div className="grid grid-cols-1 gap-3">
                    {isLoadingChildren ? (
                      <div className="py-10 text-center"><Activity className="w-8 h-8 animate-spin mx-auto text-blue-600" /></div>
                    ) : children.length === 0 ? (
                      <div className="p-10 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200 text-center">
                        <p className="text-blue-900 font-bold mb-4">You haven't registered any children yet.</p>
                        <button 
                          type="button"
                          onClick={() => navigate('/parent/children')}
                          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm"
                        >Register a Child First</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {children.map((child: any) => {
                          const isSelected = (selectedChildIds || []).includes(child._id);
                          return (
                            <div 
                              key={child._id}
                              onClick={() => {
                                const current = selectedChildIds || [];
                                const next = isSelected 
                                  ? current.filter(id => id !== child._id)
                                  : [...current, child._id];
                                setValue('childIds', next);
                              }}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                                isSelected ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-600/10' : 'bg-white border-gray-100 hover:border-blue-200'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <User className="w-5 h-5" />
                              </div>
                              <div className="flex-1 overflow-hidden text-ellipsis">
                                <h4 className="font-bold text-gray-800 text-sm whitespace-nowrap">{child.firstname}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">@{child.username}</p>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Phase Selection - SECONDARY (Shows summary if pre-selected) */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Learning Phase</label>
                  {initialPhaseId && selectedPhase ? (
                    <div className="p-5 bg-blue-50/50 rounded-2xl border-2 border-blue-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">
                            {selectedPhase.orderIndex}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{selectedPhase.title}</h4>
                            <p className="text-xs text-gray-500">${selectedPhase.price} • {selectedPhase.durationWeeks} Weeks</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-blue-100">Selected</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {isLoadingPhases ? (
                        <div className="py-10 text-center"><Activity className="w-8 h-8 animate-spin mx-auto text-blue-600" /></div>
                      ) : phases.length === 0 ? (
                        <p className="text-gray-500 italic p-6 bg-gray-50 rounded-2xl border-2 border-dashed">No phases available.</p>
                      ) : (
                        phases.map((phase: any) => {
                          const isPhaseActive = phase.isActive !== false;
                          return (
                            <div 
                              key={phase._id}
                              onClick={() => isPhaseActive && setValue('phaseId', phase._id)}
                              className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                                !isPhaseActive ? 'opacity-50 grayscale cursor-not-allowed border-dashed' :
                                selectedPhaseId === phase._id ? 'bg-blue-50 border-blue-600 shadow-md cursor-pointer' : 'bg-white border-gray-100 hover:border-blue-200 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedPhaseId === phase._id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  {phase.orderIndex}
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">{phase.title} {!isPhaseActive && <span className="text-[8px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter ml-1 italic">Closed</span>}</h4>
                                  <p className="text-xs text-gray-500">${phase.price} • {phase.durationWeeks} Weeks</p>
                                </div>
                              </div>
                              {selectedPhaseId === phase._id && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Select Study Batch */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">Available Groups</h4>
                  <p className="text-gray-500 text-sm">Select a batch and preferred session times.</p>
                </div>

                <div className="space-y-4">
                  {isLoadingBatches ? (
                    <div className="py-12 text-center"><Activity className="w-8 h-8 animate-spin mx-auto text-blue-600" /></div>
                  ) : batches.length === 0 ? (
                    <p className="text-gray-500 italic p-10 bg-gray-50 rounded-3xl text-center">No batches for this program.</p>
                  ) : (
                    <div className="space-y-4">
                      {batches.filter((b: any) => b.isActive).map((batch: any) => (
                        <div key={batch._id} className="space-y-4">
                          <div 
                            onClick={() => {
                              setValue('batchId', batch._id);
                              setSelectedSchedules({});
                            }}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                              selectedBatchId === batch._id ? 'bg-blue-50 border-blue-600 shadow-lg' : 'bg-white border-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedBatchId === batch._id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  <Users className="w-6 h-6" />
                                </div>
                                <div>
                                  <h5 className="font-black text-gray-900">{batch.batchName}</h5>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                                    {(batch.capacity || 0) - (batch.activeEnrollments || 0)} Spaces Left
                                  </span>
                                </div>
                              </div>
                              {selectedBatchId === batch._id && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                            </div>
                          </div>

                          <AnimatePresence>
                            {selectedBatchId === batch._id && Object.keys(groupedSchedules).length > 0 && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="p-6 bg-gray-50 rounded-3xl border-2 border-gray-100 space-y-6 mt-2 ml-4">
                                  {Object.keys(groupedSchedules).map((label) => (
                                    <div key={label} className="space-y-3">
                                      <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</h6>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {groupedSchedules[label].map((slot: any) => {
                                          const isSelected = selectedSchedules[label] === slot._id;
                                          const hasConflict = !isSelected && checkConflicts(label, slot);
                                          return (
                                            <button
                                              key={slot._id}
                                              type="button"
                                              disabled={hasConflict}
                                              onClick={() => handleSlotSelect(label, slot._id)}
                                              className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-1 text-left relative overflow-hidden ${
                                                isSelected ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10' : hasConflict ? 'opacity-50 cursor-not-allowed grayscale' : 'bg-white border-gray-100 hover:border-blue-400'
                                              }`}
                                            >
                                              <span className="text-xs font-black uppercase tracking-widest text-gray-800">{slot.dayOfWeek}</span>
                                              <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px]">
                                                <Clock className="w-3 h-3" /> {formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}
                                              </div>
                                              {hasConflict && <div className="absolute inset-0 bg-red-50/70 flex items-center justify-center p-2"><AlertTriangle className="w-4 h-4 text-red-600" /></div>}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 text-center">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-2">Ready to Enroll?</h4>
                  <p className="text-gray-500 font-medium">Please review the details for your {selectedChildIds.length} student(s).</p>
                </div>

                <div className="space-y-3">
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-400 uppercase">Students</span>
                    <span className="font-black text-gray-800 text-right">
                      {selectedChildIds.map(id => children.find(c => c._id === id)?.firstname).join(', ')}
                    </span>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-400 uppercase">Program/Phase</span>
                    <span className="font-black text-gray-800 text-right">{program.title} - {selectedPhase?.title}</span>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-400 uppercase">Total Price</span>
                    <span className="font-black text-blue-600 text-2xl">${(selectedPhase?.price || 0) * selectedChildIds.length}</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4 items-start">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-widest">
                    Enrollment is tentative until payment is confirmed. Once you complete this step, you'll be redirected to pay for all students.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Final Success */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-green-100 rotate-12">
                   <CreditCard className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Enrollment Prepared!</h3>
                <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">
                   Great job! Enrollment for your {selectedChildIds.length} children has been prepared. Please proceed to payment via **Stripe** or **Zelle** to activate their courses.
                </p>
                
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/checkout', { state: { enrollmentIds: createdEnrollmentIds } });
                  }}
                  className="w-full max-w-sm py-5 bg-green-600 hover:bg-green-700 text-white font-black rounded-[1.5rem] shadow-2xl shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          {step < 4 && (
            <div className="px-4 sm:px-10 py-4 sm:py-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 bg-gray-50/50 pb-[max(1rem,env(safe-area-inset-bottom))] flex-shrink-0">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="w-full sm:w-auto px-6 sm:px-8 py-3.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl sm:rounded-[1.2rem] transition-all text-center">
                  Back
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}
              
              <button 
                type="button" 
                onClick={step === 3 ? handleSubmit(onSubmit) : () => setStep(step + 1)}
                disabled={
                  (step === 1 && (!selectedPhaseId || !selectedChildIds?.length)) ||
                  (step === 2 && (!selectedBatchId || !isAllSchedulesSelected)) ||
                  isSubmitting
                }
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl sm:rounded-[1.2rem] shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Activity className="w-5 h-5 animate-spin" /> : null}
                {step === 3 ? 'Confirm & Pay' : 'Next Step'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ParentEnrollModal;
