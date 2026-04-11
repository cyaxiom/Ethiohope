import React, { useState, useEffect } from 'react';
import { X, Calendar, GraduationCap, MapPin, Globe, Users, Clock, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useGetPublicBatchesByPhaseQuery } from '../../features/programs/batchApi';
import { usePrepareEnrollmentMutation } from '../../features/enrollments/enrollmentApi';
import { toast } from 'sonner';

interface EnrollChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: any;
  phase: any;
}

const USA_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const EnrollChildModal: React.FC<EnrollChildModalProps> = ({ isOpen, onClose, program, phase }) => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      grade: '',
      isUSA: true,
      state: '',
      country: '',
      region: '',
      batchId: ''
    }
  });

  const isUSA = watch('isUSA');
  const selectedBatchId = watch('batchId');

  const { data: batchesData, isLoading: isLoadingBatches } = useGetPublicBatchesByPhaseQuery(phase?._id, { skip: !phase?._id });
  const [prepareEnrollment, { isLoading: isSubmitting }] = usePrepareEnrollmentMutation();

  const batches = batchesData?.data || [];
  const selectedBatch = batches.find(b => b._id === selectedBatchId);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        grade: data.grade,
        isUSA: data.isUSA,
        country: data.isUSA ? 'United States' : data.country,
        region: data.isUSA ? data.state : data.region,
        programId: program._id,
        phaseId: phase._id,
        batchId: data.batchId
      };

      const result = await prepareEnrollment(payload).unwrap();
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
                      <input type="date" {...register('dob', { required: true })} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
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
                        onClick={() => setValue('isUSA', true)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${isUSA ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}
                      >USA</button>
                      <button 
                        type="button" 
                        onClick={() => setValue('isUSA', false)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!isUSA ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}
                      >International</button>
                    </div>
                  </div>

                  {isUSA ? (
                    <div>
                      <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Specify State</label>
                      <select {...register('state', { required: isUSA })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        <option value="">Select US State</option>
                        {USA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Country</label>
                        <input {...register('country', { required: !isUSA })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., Ethiopia" />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Region/State</label>
                        <input {...register('region', { required: !isUSA })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., Amhara" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 text-amber-800">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Select a study group (batch) and schedule that works for your child.</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800">Available Batches</h4>
                  {isLoadingBatches ? (
                    <div className="py-12 flex justify-center"><Clock className="w-8 h-8 animate-spin text-blue-600" /></div>
                  ) : batches.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                      <p className="text-gray-500 font-medium">No study groups available for this phase yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Please contact support for more information.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {batches.map((batch) => (
                        <div 
                          key={batch._id}
                          onClick={() => setValue('batchId', batch._id)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedBatchId === batch._id ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                                selectedBatchId === batch._id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {batch.groupType || 'A'}
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-900">Study Group {batch.groupType || 'A'}</h5>
                                <p className="text-xs text-gray-500">Max Capacity: {batch.capacity || 'Unlimited'}</p>
                              </div>
                            </div>
                            {selectedBatchId === batch._id && <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">✓</div>}
                          </div>

                          {/* Schedules */}
                          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {batch.schedules && batch.schedules.length > 0 ? (
                              batch.schedules.map((sched: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                                  <span>{sched.dayOfWeek} • {sched.startTime} - {sched.endTime}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-400 italic">No schedule timings set yet.</p>
                            )}
                          </div>
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
                  onClick={onClose}
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
                  disabled={!watch('firstName') || !watch('lastName') || !watch('dob') || !watch('grade')}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Continue to Groups
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedBatchId}
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

export default EnrollChildModal;
