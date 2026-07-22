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
      // Reset country when switching USA/International
      if (isUSA) setValue('country', 'US');
      else setValue('country', '');
    }
  }, [isOpen, isUSA]);

  const onSubmit = async (data: any) => {
    try {
      const countryObj = Country.getCountryByCode(data.country);
      const stateObj = State.getStateByCodeAndCountry(data.region || data.state, data.country);

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        grade: data.grade,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Enroll Your Child</h3>
            <p className="text-blue-600 font-bold text-sm uppercase tracking-wider">{program.title} • {phase.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="flex px-8 pt-6 pb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step === s ? 'bg-blue-600 text-white scale-110 shadow-lg' : 
                step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-green-500' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input {...register('firstName', { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input {...register('lastName', { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="date" 
                        min={MIN_DATE}
                        max={MAX_DATE}
                        {...register('dob', { required: true })} 
                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${ageError ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`} 
                      />
                    </div>
                    {!ageError && age !== null && (
                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                        So your child is {age} years old
                      </p>
                    )}
                    {ageError && (
                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-red-500">
                        {ageError}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Grade Level</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select {...register('grade', { required: true })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Select Grade</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-800 flex items-center gap-2">
                       <MapPin className="w-5 h-5 text-blue-600" />
                       School Location
                    </label>
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                      <button 
                        type="button" 
                        onClick={() => { setValue('isUSA', true); setValue('country', 'US'); }}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${isUSA ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}
                      >USA</button>
                      <button 
                        type="button" 
                        onClick={() => { setValue('isUSA', false); setValue('country', ''); }}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!isUSA ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}
                      >International</button>
                    </div>
                  </div>

                  {isUSA ? (
                    <div>
                      <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Specify State</label>
                      <select {...register('state', { required: isUSA })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                        <option value="">Select US State</option>
                        {State.getStatesOfCountry('US').map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="relative group">
                        <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Country</label>
                        <CustomCountryDropdown 
                          countries={allCountries.filter(c => c.isoCode !== 'US')}
                          selectedCode={selectedCountryCode}
                          onSelect={(code) => { setValue('country', code); setValue('region', ''); }}
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Region/State</label>
                        <select 
                          {...register('region', { required: !isUSA && statesOfSelectedCountry.length > 0 })} 
                          disabled={!selectedCountryCode || statesOfSelectedCountry.length === 0}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none disabled:bg-gray-50 font-bold text-gray-700"
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
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h4 className="text-xl font-black text-gray-900 mb-2">Select Study Batch</h4>
                  <p className="text-gray-500 text-sm">Choose the batch that best fits your child's learning pace.</p>
                </div>

                <div className="space-y-4">
                  {isLoadingBatches ? (
                    <div className="py-12 text-center">
                      <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching available batches...</p>
                    </div>
                  ) : batches.length === 0 ? (
                    <div className="p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                       <p className="text-gray-500 font-bold italic">No active batches available for this program.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {batches.map((batch: any) => (
                        <div key={batch._id} className="space-y-4">
                          <div 
                            onClick={() => {
                              setValue('batchId', batch._id);
                              setSelectedSchedules({}); // Reset selections when batch changes
                            }}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                              selectedBatchId === batch._id 
                                ? 'bg-blue-50 border-blue-600 shadow-xl shadow-blue-100' 
                                : 'bg-white border-gray-100 hover:border-blue-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                  selectedBatchId === batch._id ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  <Users className="w-6 h-6" />
                                </div>
                                <div>
                                  <h5 className="font-black text-gray-900 text-lg tracking-tight">{batch.batchName}</h5>
                                  <div className="flex items-center gap-3 mt-0.5">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enrollment Open</p>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                                      ((batch.capacity || 0) - (batch.activeEnrollments || 0)) <= 5 ? 'text-orange-600' : 'text-blue-600'
                                    }`}>
                                      {Math.max(0, (batch.capacity || 0) - (batch.activeEnrollments || 0))} Spaces Left
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {selectedBatchId === batch._id && (
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Session Group Slots (Only for selected batch) */}
                          <AnimatePresence>
                            {selectedBatchId === batch._id && Object.keys(groupedSchedules).length > 0 && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-6 bg-gray-50/50 rounded-3xl border-2 border-gray-100 space-y-6 mt-2 ml-4 relative">
                                  <div className="absolute left-[-18px] top-0 bottom-10 w-0.5 bg-blue-100"></div>
                                  
                                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Choose your preferred session times:</p>
                                  
                                  {Object.keys(groupedSchedules).map((label) => (
                                    <div key={label} className="space-y-3">
                                      <h6 className="text-sm font-black text-gray-700 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        {label}
                                      </h6>
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
                                                isSelected 
                                                  ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10' 
                                                  : hasConflict
                                                    ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
                                                    : 'bg-white border-gray-100 hover:border-blue-400'
                                              }`}
                                            >
                                              <div className="flex items-center justify-between w-full">
                                                <span className="text-xs font-black uppercase tracking-widest text-gray-800">
                                                  {slot.dayOfWeek}
                                                </span>
                                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                                              </div>
                                              <div className="flex items-center gap-1.5 text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold tracking-tight">{formatTime12h(slot.startTime)} - {formatTime12h(slot.endTime)}</span>
                                              </div>
                                              
                                              {hasConflict && (
                                                <div className="absolute inset-0 bg-red-50/80 flex items-center justify-center backdrop-blur-[1px]">
                                                   <span className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1">
                                                     <AlertTriangle className="w-3 h-3" />
                                                     Time Conflict
                                                   </span>
                                                </div>
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-50">
                   <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">Enrollment Prepared!</h3>
                <p className="text-gray-500 max-w-sm mb-8">
                   We have successfully registered your child and prepared the enrollment for <span className="text-blue-600 font-bold">{program.title}</span>.
                </p>
                <div className="w-full max-w-sm p-6 bg-gray-50 rounded-2xl border border-gray-200 mb-8">
                   <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="text-sm font-bold text-amber-600 uppercase">PENDING</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Amount:</span>
                      <span className="text-lg font-black text-gray-900">${phase.price}</span>
                   </div>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    if (createdEnrollmentIds.length > 0) {
                      navigate('/checkout', { state: { enrollmentIds: createdEnrollmentIds } });
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full max-w-sm py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          {step < 3 && (
            <div className="px-8 py-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                  Back
                </button>
              ) : (
                <div />
              )}
              
              {step === 1 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  disabled={
                    !watch('firstName') || 
                    !watch('lastName') || 
                    !watch('dob') || 
                    ageError !== null ||
                    !watch('grade') ||
                    (isUSA ? !watch('state') : (!watch('country') || (statesOfSelectedCountry.length > 0 && !watch('region'))))
                  }
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Continue to Groups
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedBatchId || !isAllSchedulesSelected}
                  className="px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50"
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
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <img 
                src={`https://flagcdn.com/w40/${selectedCountry.isoCode.toLowerCase()}.png`} 
                alt={selectedCountry.name}
                className="w-6 h-4 object-cover rounded-sm shadow-sm"
              />
              <span className="font-bold text-gray-800">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-gray-400 font-medium">Select Country</span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[110] left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-w-[200px]"
          >
            <div className="p-3 border-b border-gray-50 bg-gray-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              {filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm italic">No results found</div>
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 rounded-xl transition-colors text-left ${
                      selectedCode === c.isoCode ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
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
