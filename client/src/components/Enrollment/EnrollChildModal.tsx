import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, GraduationCap, MapPin, Globe, Users, Clock, CheckCircle2, ChevronDown, Search, AlertTriangle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useGetPublicBatchesByProgramQuery } from '../../features/programs/batchApi';
import { usePrepareEnrollmentMutation } from '../../features/enrollments/enrollmentApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface EnrollChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: any;
  phase: any;
}

import { Country, State } from 'country-state-city';

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

const EnrollChildModal: React.FC<EnrollChildModalProps> = ({ isOpen, onClose, program, phase }) => {
  const [step, setStep] = useState(1);
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});
  const [createdEnrollmentIds, setCreatedEnrollmentIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const DATE_NOW = new Date();
  const MIN_DATE = new Date(DATE_NOW.getFullYear() - 19, DATE_NOW.getMonth(), DATE_NOW.getDate() + 1).toISOString().split('T')[0];
  const MAX_DATE = new Date(DATE_NOW.getFullYear() - 9, DATE_NOW.getMonth(), DATE_NOW.getDate()).toISOString().split('T')[0];

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      grade: '',
      isUSA: true,
      state: '',
      country: 'US', // Default to US code for library
      region: '',
      batchId: ''
    }
  });

  const dobValue = watch('dob');
  const [age, setAge] = useState<number | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);

  useEffect(() => {
    if (dobValue) {
      const birthDate = new Date(dobValue);
      let calculatedAge = DATE_NOW.getFullYear() - birthDate.getFullYear();
      const monthDiff = DATE_NOW.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && DATE_NOW.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);

      if (calculatedAge < 9) {
        setAgeError('Your child must be at least 9 years old.');
      } else if (calculatedAge > 18) {
        setAgeError('Your child must be no more than 18 years old.');
      } else {
        setAgeError(null);
      }
    } else {
      setAge(null);
      setAgeError(null);
    }
  }, [dobValue]);

  const isUSA = watch('isUSA');
  const selectedCountryCode = watch('country');
  const selectedBatchId = watch('batchId');

  // Location Data - Prioritize Ethiopia (ET), USA (US), Canada (CA)
  const PRIORITY_COUNTRIES = ['ET', 'US', 'CA'];
  const allCountries = Country.getAllCountries().sort((a, b) => {
    const aPriority = PRIORITY_COUNTRIES.indexOf(a.isoCode);
    const bPriority = PRIORITY_COUNTRIES.indexOf(b.isoCode);
    
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const statesOfSelectedCountry = State.getStatesOfCountry(selectedCountryCode);

  const { data: batchesData, isLoading: isLoadingBatches } = useGetPublicBatchesByProgramQuery(program?._id, { skip: !program?._id });
  const [prepareEnrollment, { isLoading: isSubmitting }] = usePrepareEnrollmentMutation();

  const batches = batchesData?.data || [];
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
      setCreatedEnrollmentIds([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (isUSA) setValue('country', 'US');
    else setValue('country', '');
  }, [isUSA, isOpen, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const countryObj = Country.getCountryByCode(data.country);
      const stateObj = State.getStateByCodeAndCountry(data.region || data.state, data.country);

      const payload = {
        enrolleeType: 'CHILD' as const,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob || undefined,
        grade: data.grade || undefined,
        isUSA: data.isUSA,
        country: countryObj?.name || (data.isUSA ? 'United States' : ''),
        region: stateObj?.name || data.region || data.state,
        programId: program._id,
        phaseId: phase._id,
        batchId: data.batchId,
        selectedSchedules: Object.values(selectedSchedules)
      };

      const result = await prepareEnrollment(payload).unwrap();
      setCreatedEnrollmentIds(result.data.enrollmentIds || []);
      setStep(3); // Success step
      toast.success(result.message);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to prepare enrollment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-[#0b1224] text-slate-100 w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex justify-between items-start gap-3 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">Enroll your child</h3>
            <p className="text-blue-300 text-xs sm:text-sm mt-1 break-words">
              {program.title}
              <span className="text-slate-500"> · </span>
              {phase.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="px-4 sm:px-6 pt-4 pb-2 flex-shrink-0">
          <div className="flex">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step === s ? 'bg-blue-600 text-white' : 
                  step > s ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide">
            {['Child info', 'Group & schedule', 'Checkout'][step - 1]}
            <span className="text-slate-600"> · </span>
            Step {step} of 3
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="px-4 sm:px-6 py-5 overflow-y-auto flex-1 sidebar-scroll enroll-child-dark">
            
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                    <input {...register('firstName', { required: true })} className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all" placeholder="Enter first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                    <input {...register('lastName', { required: true })} className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date of Birth <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input 
                        type="date" 
                        min={MIN_DATE}
                        max={MAX_DATE}
                        {...register('dob', { required: false })} 
                        className={`w-full pl-12 pr-4 py-3 bg-[#070b16] border ${ageError ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`} 
                      />
                    </div>
                    {!ageError && age !== null && (
                      <p className="mt-1.5 text-xs text-blue-300">
                        So your child is {age} years old
                      </p>
                    )}
                    {ageError && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {ageError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Grade Level <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <select {...register('grade', { required: false })} className="w-full pl-12 pr-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Select Grade</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="font-medium text-slate-200 flex items-center gap-2 text-sm">
                       <MapPin className="w-4 h-4 text-blue-400" />
                       School location
                    </label>
                    <div className="flex bg-[#070b16] p-1 rounded-lg border border-white/10 self-start">
                      <button 
                        type="button" 
                        onClick={() => { setValue('isUSA', true); setValue('country', 'US'); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${isUSA ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                      >USA</button>
                      <button 
                        type="button" 
                        onClick={() => { setValue('isUSA', false); setValue('country', ''); }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!isUSA ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                      >International</button>
                    </div>
                  </div>

                  {isUSA ? (
                    <div>
                      <label className="block text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em] mb-2">State</label>
                      <select {...register('state', { required: isUSA })} className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all appearance-none">
                        <option value="">Select US State</option>
                        {State.getStatesOfCountry('US').map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="block text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em] mb-2">Country</label>
                        <CustomCountryDropdown 
                          countries={allCountries.filter(c => c.isoCode !== 'US')}
                          selectedCode={selectedCountryCode}
                          onSelect={(code) => { setValue('country', code); setValue('region', ''); }}
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em] mb-2">Region / state</label>
                        <select 
                          {...register('region', { required: !isUSA && statesOfSelectedCountry.length > 0 })} 
                          disabled={!selectedCountryCode || statesOfSelectedCountry.length === 0}
                          className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none disabled:opacity-50"
                        >
                          <option value="">{statesOfSelectedCountry.length > 0 ? 'Select Region' : 'N/A'}</option>
                          {statesOfSelectedCountry.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">Select study batch</h4>
                  <p className="text-slate-400 text-sm">Choose the batch that best fits your child&apos;s schedule.</p>
                </div>

                <div className="space-y-3">
                  {isLoadingBatches ? (
                    <div className="py-14 text-center">
                      <Activity className="w-7 h-7 animate-spin mx-auto text-blue-400 mb-3" />
                      <p className="text-slate-500 text-sm">Loading batches…</p>
                    </div>
                  ) : batches.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-center">
                       <p className="text-slate-400 text-sm">No active batches available for this program.</p>
                    </div>
                  ) : (
                      batches.map((batch: any) => {
                        const spaces = Math.max(0, (batch.capacity || 0) - (batch.activeEnrollments || 0));
                        const selected = selectedBatchId === batch._id;
                        return (
                        <div key={batch._id} className="space-y-3">
                          <button
                            type="button"
                            onClick={() => {
                              setValue('batchId', batch._id);
                              setSelectedSchedules({});
                            }}
                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                              selected
                                ? 'bg-blue-500/10 border-blue-500/50'
                                : 'bg-[#070b16] border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  selected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                                }`}>
                                  <Users className="w-5 h-5" />
                                </div>
                              <div className="min-w-0 flex-1">
                                  <h5 className="font-semibold text-white text-[15px] truncate">{batch.batchName}</h5>
                                <p className={`text-xs font-medium mt-0.5 ${spaces <= 5 ? 'text-amber-300' : 'text-slate-400'}`}>
                                  {spaces} space{spaces === 1 ? '' : 's'} left
                                    </p>
                                  </div>
                              {selected && <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                            </div>
                          </button>

                          <AnimatePresence>
                            {selected && Object.keys(groupedSchedules).length > 0 && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-5">
                                  <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em]">
                                    Choose session times
                                  </p>
                                  
                                  {Object.keys(groupedSchedules).map((label) => (
                                    <div key={label} className="space-y-2.5">
                                      <h6 className="text-sm font-medium text-slate-300">{label}</h6>
                                      <div className="grid grid-cols-1 gap-2">
                                        {groupedSchedules[label].map((slot: any) => {
                                          const isSelected = selectedSchedules[label] === slot._id;
                                          const hasConflict = !isSelected && checkConflicts(label, slot);
                                          
                                          return (
                                            <button
                                              key={slot._id}
                                              type="button"
                                              disabled={hasConflict}
                                              onClick={() => handleSlotSelect(label, slot._id)}
                                              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-left relative overflow-hidden min-h-[52px] ${
                                                isSelected
                                                  ? 'bg-blue-600/15 border-blue-500/50'
                                                  : hasConflict
                                                    ? 'bg-[#070b16]/60 border-white/5 opacity-45 cursor-not-allowed'
                                                    : 'bg-[#070b16] border-white/10 hover:border-blue-400/40'
                                              }`}
                                            >
                                              <div className="min-w-0">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-white">
                                                  {slot.dayOfWeek}
                                                </p>
                                                <p className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                                                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                  <span>
                                                    {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                                                  </span>
                                                </p>
                                              </div>
                                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                                              {hasConflict && (
                                                <span className="absolute inset-0 bg-red-950/70 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-300">
                                                     <AlertTriangle className="w-3 h-3" />
                                                     Time conflict
                                                </span>
                                              )}
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
                        );
                      })
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
                <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mb-5 border border-emerald-400/20">
                   <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Enrollment ready</h3>
                <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                   Your child&apos;s spot for <span className="text-blue-300 font-medium">{program.title}</span> is prepared.
                   Complete payment to activate access.
                </p>
                <div className="w-full max-w-sm p-4 rounded-2xl border border-white/10 bg-[#070b16] mb-6 space-y-2.5 text-left">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Status</span>
                      <span className="font-medium text-amber-300">Pending</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Amount</span>
                      <span className="font-semibold text-white">${phase.price}</span>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    onClose();
                    if (createdEnrollmentIds.length > 0) {
                      navigate('/checkout', { state: { enrollmentIds: createdEnrollmentIds } });
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full max-w-sm py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Proceed to payment
                </button>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          {step < 3 && (
            <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 bg-[#070b16] pb-[max(1rem,env(safe-area-inset-bottom))]">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="w-full sm:w-auto px-4 py-3 sm:py-2.5 text-slate-300 font-medium hover:bg-white/5 rounded-xl transition-colors text-center">
                  Back
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}
              
              {step === 1 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  disabled={
                    !watch('firstName') || 
                    !watch('lastName') || 
                    ageError !== null ||
                    (isUSA ? !watch('state') : (!watch('country') || (statesOfSelectedCountry.length > 0 && !watch('region'))))
                  }
                  className="w-full sm:w-auto sm:min-w-[160px] px-6 py-3.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedBatchId || !isAllSchedulesSelected}
                  className="w-full sm:w-auto sm:min-w-[180px] px-6 py-3.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Registration'}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// --- Custom Dropdown Component ---

const CustomCountryDropdown: React.FC<{ 
  countries: any[], 
  selectedCode: string, 
  onSelect: (code: string) => void 
}> = ({ countries, selectedCode, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedCountry = countries.find(c => c.isoCode === selectedCode);
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl hover:border-white/20 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <img 
                src={`https://flagcdn.com/w40/${selectedCountry.isoCode.toLowerCase()}.png`} 
                alt={selectedCountry.name}
                className="w-6 h-4 object-cover rounded-sm"
              />
              <span className="font-medium text-slate-100">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-slate-500">Select Country</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[110] left-0 right-0 mt-2 bg-[#0b1224] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-w-[200px]"
          >
            <div className="p-3 border-b border-white/10 bg-[#070b16]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#0b1224] border border-white/10 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto sidebar-scroll p-1">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
              ) : (
                filteredCountries.map((c) => (
                  <button
                    key={c.isoCode}
                    type="button"
                    onClick={() => {
                      onSelect(c.isoCode);
                      setIsOpen(false);
                      setSearchTerm('');
                    } }
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-500/10 rounded-xl transition-colors text-left ${
                      selectedCode === c.isoCode ? 'bg-blue-500/15 text-blue-300' : 'text-slate-300'
                    }`}
                  >
                    <img 
                      src={`https://flagcdn.com/w40/${c.isoCode.toLowerCase()}.png`} 
                      alt={c.name}
                      className="w-5 h-3.5 object-cover rounded-sm border border-gray-100"
                    />
                    <span className="font-bold text-sm">{c.name}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnrollChildModal;
