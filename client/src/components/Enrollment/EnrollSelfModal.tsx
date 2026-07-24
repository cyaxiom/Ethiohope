import React, { useState, useEffect } from 'react';
import { X, Users, Clock, CheckCircle2, AlertTriangle, Activity, Phone, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useGetPublicBatchesByProgramQuery } from '../../features/programs/batchApi';
import { usePrepareEnrollmentMutation } from '../../features/enrollments/enrollmentApi';
import { updateUser } from '../../features/auth/authSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ETHIOPIA_TZ, timeZoneLabel } from '../../lib/timezone';

interface EnrollSelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: any;
  phase: any;
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

/** Adult self-enrollment: contact phone + batch + schedules, then checkout. */
const EnrollSelfModal: React.FC<EnrollSelfModalProps> = ({ isOpen, onClose, program, phase }) => {
  const [step, setStep] = useState(1);
  const [selectedSchedules, setSelectedSchedules] = useState<Record<string, string>>({});
  const [createdEnrollmentIds, setCreatedEnrollmentIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state: any) => state.auth.user);
  const hasStoredPhone = Boolean(authUser?.phone?.trim());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { batchId: '', phone: '' },
  });

  const selectedBatchId = watch('batchId');
  const { data: batchesData, isLoading: isLoadingBatches } = useGetPublicBatchesByProgramQuery(program?._id, {
    skip: !program?._id,
  });
  const [prepareEnrollment, { isLoading: isSubmitting }] = usePrepareEnrollmentMutation();

  const batches = batchesData?.data || [];
  const selectedBatch = batches.find((b: any) => b._id === selectedBatchId);

  const groupedSchedules = React.useMemo(() => {
    if (!selectedBatch?.schedules) return {};
    return (selectedBatch.schedules as any[]).reduce((acc: any, s: any) => {
      if (!acc[s.sessionLabel]) acc[s.sessionLabel] = [];
      acc[s.sessionLabel].push(s);
      return acc;
    }, {});
  }, [selectedBatch]);

  const scheduleTimeZone =
    selectedBatch?.schedules?.find((s: any) => s.timeZone)?.timeZone ||
    selectedBatch?.schedules?.[0]?.timeZone ||
    ETHIOPIA_TZ;
  const requiredSessionLabels = Object.keys(groupedSchedules);
  const isAllSchedulesSelected = requiredSessionLabels.every((label) => selectedSchedules[label]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedSchedules({});
      setValue('batchId', '');
      setValue('phone', authUser?.phone || '');
      setCreatedEnrollmentIds([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, setValue, authUser?.phone]);

  const handleSlotSelect = (label: string, slotId: string) => {
    setSelectedSchedules((prev) => ({ ...prev, [label]: slotId }));
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

  const onSubmit = async (data: any) => {
    try {
      const payload: any = {
        enrolleeType: 'SELF',
        programId: program._id,
        phaseId: phase._id,
        batchId: data.batchId,
        selectedSchedules: Object.values(selectedSchedules),
      };
      if (!hasStoredPhone) {
        payload.phone = data.phone.trim();
      }

      const result = await prepareEnrollment(payload).unwrap();
      if (!hasStoredPhone && payload.phone) {
        dispatch(updateUser({ user: { phone: payload.phone } }));
      }
      setCreatedEnrollmentIds(result.data.enrollmentIds || []);
      setStep(2);
      toast.success(result.message);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to prepare enrollment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="bg-[#0b1224] text-slate-100 w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-self-title"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-start justify-between gap-3 flex-shrink-0">
          <div className="min-w-0">
            <h3 id="enroll-self-title" className="text-lg sm:text-xl font-semibold text-white leading-tight">
              Enroll yourself
            </h3>
            <p className="text-blue-300 text-xs sm:text-sm mt-1 break-words">
              {program.title}
              <span className="text-slate-500"> · </span>
              {phase.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="px-4 sm:px-6 py-5 overflow-y-auto flex-1 sidebar-scroll">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">
                    {hasStoredPhone ? 'Choose batch & times' : 'Contact & schedule'}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {hasStoredPhone
                      ? 'Select a batch and preferred session times to continue.'
                      : 'Add a phone number so we can reach you, then pick your batch and times.'}
                  </p>
                </div>

                {!hasStoredPhone && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+251 9XX XXX XXX"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^\+?[\d\s\-()]{10,20}$/,
                            message: 'Enter a valid phone number',
                          },
                        })}
                        className={`w-full pl-10 pr-4 py-3 bg-[#070b16] border rounded-xl text-slate-100 placeholder:text-slate-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                          errors.phone
                            ? 'border-red-500/50 focus:border-red-400'
                            : 'border-white/10 focus:border-blue-500/50'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-400">{String(errors.phone.message)}</p>
                    )}
                    <p className="mt-1.5 text-xs text-slate-500">Used only to contact you about enrollment.</p>
                  </div>
                )}

                <input type="hidden" {...register('batchId', { required: true })} />

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
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  selected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                                }`}
                              >
                                <Users className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="font-semibold text-white text-[15px] truncate">{batch.batchName}</h5>
                                <p
                                  className={`text-xs font-medium mt-0.5 ${
                                    spaces <= 5 ? 'text-amber-300' : 'text-slate-400'
                                  }`}
                                >
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
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em]">
                                      Choose session times
                                    </p>
                                    <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/30 px-3 py-2.5">
                                      <Globe2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                      <p className="text-[11px] text-emerald-200/90 leading-snug">
                                        Times are in{' '}
                                        <span className="font-semibold text-emerald-100">
                                          {timeZoneLabel(scheduleTimeZone)}
                                        </span>
                                        . This is the timezone set when the schedule was created.
                                      </p>
                                    </div>
                                  </div>
                                  {Object.keys(groupedSchedules).map((label) => (
                                    <div key={label} className="space-y-2.5">
                                      <h6 className="text-sm font-medium text-slate-300">{label}</h6>
                                      <div className="grid grid-cols-1 gap-2">
                                        {groupedSchedules[label].map((slot: any) => {
                                          const isSelected = selectedSchedules[label] === slot._id;
                                          const hasConflict = !isSelected && checkConflicts(label, slot);
                                          const slotTz = slot.timeZone || scheduleTimeZone;
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
                                                <p className="text-[10px] text-emerald-400/80 mt-1">
                                                  {timeZoneLabel(slotTz)}
                                                </p>
                                              </div>
                                              {isSelected && (
                                                <CheckCircle2 className="w-4.5 h-4.5 w-4 h-4 text-blue-400 flex-shrink-0" />
                                              )}
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

            {step === 2 && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
                <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mb-5 border border-emerald-400/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Enrollment ready</h3>
                <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                  Your spot for <span className="text-blue-300 font-medium">{program.title}</span> is prepared.
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
                    navigate('/checkout', {
                      state: { enrollmentIds: createdEnrollmentIds },
                    });
                  }}
                  className="w-full max-w-sm py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
                >
                  Proceed to payment
                </button>
              </div>
            )}
          </div>

          {step === 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-[#0b1224] flex-shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="submit"
                disabled={isSubmitting || !selectedBatchId || !isAllSchedulesSelected}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing…' : 'Continue'}
              </button>
              {selectedBatchId && !isAllSchedulesSelected && (
                <p className="text-center text-xs text-slate-500 mt-2">Select a time for each session to continue.</p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EnrollSelfModal;
