import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Calendar,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Search,
  AlertTriangle,
  Activity,
  Clock,
  BookOpen,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Country, State } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetPublicPackagesByProgramQuery } from '../../features/programs/packageApi';
import { usePrepareEnrollmentMutation } from '../../features/enrollments/enrollmentApi';
import {
  ACADEMIC_SUBJECTS,
  DAYS_OF_WEEK,
  PACKAGE_DAYS_LABELS,
  sortPackagesWithPopularCentered,
  type AcademicSubject,
  type SubjectPriority,
} from '../../common/academicSubjects';
import type { TutoringPackage } from '../../features/programs/packageApi';
import TimeZonePicker from '../ui/TimeZonePicker';
import { detectBrowserTimeZone, ETHIOPIA_TZ } from '../../lib/timezone';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  program: any;
}

interface ChildInfoForm {
  firstName: string;
  lastName: string;
  dob: string;
  grade: string;
  isUSA: boolean;
  state: string;
  country: string;
  region: string;
  notes: string;
}

interface SelectedSubject {
  name: AcademicSubject;
  priority: SubjectPriority;
}

interface TimeBlock {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject: string;
}

const PRIORITY_COUNTRIES = ['ET', 'US', 'CA'];

const formatDayLabel = (day: string) =>
  day.charAt(0) + day.slice(1).toLowerCase();

const toHHmm = (time: string): string => {
  if (!time) return '';
  const parts = time.split(':');
  if (parts.length < 2) return time;
  const h = parts[0].padStart(2, '0');
  const m = parts[1].padStart(2, '0');
  return `${h}:${m}`;
};

const timesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => {
  if (!aStart || !aEnd || !bStart || !bEnd) return false;
  if (aStart >= aEnd || bStart >= bEnd) return false;
  return aStart < bEnd && bStart < aEnd;
};

/** Indices of blocks whose times overlap another block on the same day */
const getOverlapIndices = (blocks: TimeBlock[]): Set<number> => {
  const set = new Set<number>();
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i];
      const b = blocks[j];
      if (!a.dayOfWeek || a.dayOfWeek !== b.dayOfWeek) continue;
      if (
        timesOverlap(
          toHHmm(a.startTime),
          toHHmm(a.endTime),
          toHHmm(b.startTime),
          toHHmm(b.endTime)
        )
      ) {
        set.add(i);
        set.add(j);
      }
    }
  }
  return set;
};

/** Same day as another session (warn early, before times are filled) */
const getSharedDayIndices = (blocks: TimeBlock[]): Set<number> => {
  const set = new Set<number>();
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (!blocks[i].dayOfWeek || blocks[i].dayOfWeek !== blocks[j].dayOfWeek) continue;
      set.add(i);
      set.add(j);
    }
  }
  return set;
};

const hasSameDayOverlap = (blocks: TimeBlock[]): boolean => getOverlapIndices(blocks).size > 0;

const EnrollAcademicTutorialModal: React.FC<Props> = ({ isOpen, onClose, program }) => {
  const [step, setStep] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [createdEnrollmentIds, setCreatedEnrollmentIds] = useState<string[]>([]);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0);
  const [scheduleTimeZone, setScheduleTimeZone] = useState(detectBrowserTimeZone);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<ChildInfoForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      grade: '',
      isUSA: true,
      state: '',
      country: 'US',
      region: '',
      notes: '',
    },
  });

  const isUSA = watch('isUSA');
  const selectedCountryCode = watch('country');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const stateValue = watch('state');
  const regionValue = watch('region');

  const allCountries = useMemo(
    () =>
      Country.getAllCountries().sort((a, b) => {
        const aPriority = PRIORITY_COUNTRIES.indexOf(a.isoCode);
        const bPriority = PRIORITY_COUNTRIES.indexOf(b.isoCode);
        if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;
        return a.name.localeCompare(b.name);
      }),
    []
  );

  const statesOfSelectedCountry = State.getStatesOfCountry(selectedCountryCode);

  const { data: packagesData, isLoading: isLoadingPackages } = useGetPublicPackagesByProgramQuery(
    program?._id,
    { skip: !program?._id }
  );
  const [prepareEnrollment, { isLoading: isSubmitting }] = usePrepareEnrollmentMutation();

  const packages = sortPackagesWithPopularCentered(packagesData?.data || []);
  const selectedPackage = packages.find((p) => p._id === selectedPackageId) as TutoringPackage | undefined;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedPackageId('');
      setSelectedSubjects([]);
      setTimeBlocks([]);
      setCreatedEnrollmentIds([]);
      setMonthlyAmount(0);
      setScheduleTimeZone(detectBrowserTimeZone());
      reset();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    if (isUSA) setValue('country', 'US');
    else setValue('country', '');
  }, [isUSA, isOpen, setValue]);

  useEffect(() => {
    if (!selectedPackage) {
      setTimeBlocks([]);
      return;
    }
    setTimeBlocks(
      Array.from({ length: selectedPackage.daysPerWeek }, () => ({
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        subject: selectedSubjects[0]?.name || '',
      }))
    );
  }, [selectedPackage?._id, selectedPackage?.daysPerWeek]);

  const toggleSubject = (name: AcademicSubject) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.name === name);
      if (exists) return prev.filter((s) => s.name !== name);
      return [...prev, { name, priority: 'MEDIUM' }];
    });
  };

  const updateSubjectPriority = (name: AcademicSubject, priority: SubjectPriority) => {
    setSelectedSubjects((prev) =>
      prev.map((s) => (s.name === name ? { ...s, priority } : s))
    );
  };

  const updateTimeBlock = (index: number, field: keyof TimeBlock, value: string) => {
    setTimeBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, [field]: value } : block))
    );
  };

  const timeBlocksValid =
    timeBlocks.length > 0 &&
    timeBlocks.every(
      (b) => b.dayOfWeek && b.startTime && b.endTime && b.subject && toHHmm(b.startTime) < toHHmm(b.endTime)
    ) &&
    !hasSameDayOverlap(timeBlocks);

  const step1Valid =
    Boolean(firstName?.trim()) &&
    Boolean(lastName?.trim()) &&
    (isUSA
      ? Boolean(stateValue)
      : Boolean(selectedCountryCode) &&
        (statesOfSelectedCountry.length === 0 || Boolean(regionValue)));

  const onSubmit = async (data: ChildInfoForm) => {
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }
    if (!timeBlocksValid) {
      toast.error('Please complete all time blocks without overlapping sessions');
      return;
    }

    try {
      const countryObj = Country.getCountryByCode(data.country);
      const stateObj = State.getStateByCodeAndCountry(data.region || data.state, data.country);

      const payload = {
        enrolleeType: 'CHILD' as const,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        dob: data.dob || undefined,
        grade: data.grade || undefined,
        isUSA: data.isUSA,
        country: countryObj?.name || (data.isUSA ? 'United States' : ''),
        region: stateObj?.name || data.region || data.state,
        notes: data.notes?.trim() || undefined,
        programId: program._id,
        packageId: selectedPackageId,
        subjects: selectedSubjects.map((s) => ({ name: s.name, priority: s.priority })),
        timeBlocks: timeBlocks.map((b) => ({
          dayOfWeek: b.dayOfWeek,
          startTime: toHHmm(b.startTime),
          endTime: toHHmm(b.endTime),
          subject: b.subject,
        })),
        scheduleTimeZone: scheduleTimeZone || ETHIOPIA_TZ,
      };

      const result = await prepareEnrollment(payload).unwrap();
      setCreatedEnrollmentIds(result.data.enrollmentIds || []);
      setMonthlyAmount(selectedPackage.price);
      setStep(5);
      toast.success(result.message);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to prepare enrollment');
    }
  };

  const handleContinue = () => {
    if (step === 1 && !step1Valid) {
      toast.error('Please complete all required fields');
      return;
    }
    if (step === 2 && !selectedPackageId) {
      toast.error('Please select a package');
      return;
    }
    if (step === 3 && selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }
    if (step === 4) {
      if (!timeBlocksValid) {
        if (hasSameDayOverlap(timeBlocks)) {
          toast.error('Time blocks on the same day cannot overlap');
        } else {
          toast.error('Please complete all time blocks');
        }
        return;
      }
      handleSubmit(onSubmit)();
      return;
    }
    setStep((s) => s + 1);
  };

  if (!isOpen) return null;

  const totalSteps = 5;
  const formStep = step <= 4 ? step : 0;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="bg-[#0b1224] text-slate-100 w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-academic-title"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex justify-between items-start gap-3 flex-shrink-0">
          <div className="min-w-0">
            <h3 id="enroll-academic-title" className="text-lg sm:text-xl font-semibold text-white leading-tight">
              Academic Tutorial Enrollment
            </h3>
            <p className="text-blue-300 text-xs sm:text-sm mt-1 break-words">{program.title}</p>
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

        {/* Steps Indicator */}
        <div className="px-4 sm:px-6 pt-4 pb-2 flex-shrink-0">
          <div className="flex">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300 ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : step > s
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-slate-500'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < totalSteps && (
                  <div
                    className={`flex-1 h-0.5 mx-1 sm:mx-2 rounded-full transition-all duration-500 ${
                      step > s ? 'bg-emerald-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide">
            {[
              'Child info',
              'Package',
              'Subjects',
              'Schedule',
              'Checkout',
            ][step - 1]}
            <span className="text-slate-600"> · </span>
            Step {step} of {totalSteps}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-5 overflow-y-auto flex-1 sidebar-scroll enroll-child-dark">
            {/* Step 1 — Child info */}
            {formStep === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">Child information</h4>
                  <p className="text-slate-400 text-sm">Tell us about the student enrolling in tutoring.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                    <input
                      {...register('firstName', { required: true })}
                      className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                    <input
                      {...register('lastName', { required: true })}
                      className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date of Birth <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        type="date"
                        {...register('dob')}
                        className="w-full pl-12 pr-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Grade Level <span className="text-slate-500 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <select
                        {...register('grade')}
                        className="w-full pl-12 pr-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select Grade</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                          <option key={g} value={g}>
                            Grade {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="font-medium text-slate-200 flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      Location
                    </label>
                    <div className="flex bg-[#070b16] p-1 rounded-lg border border-white/10 self-start">
                      <button
                        type="button"
                        onClick={() => {
                          setValue('isUSA', true);
                          setValue('country', 'US');
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          isUSA ? 'bg-blue-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        USA
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setValue('isUSA', false);
                          setValue('country', '');
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          !isUSA ? 'bg-blue-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        International
                      </button>
                    </div>
                  </div>

                  {isUSA ? (
                    <div>
                      <label className="block text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em] mb-2">
                        State
                      </label>
                      <select
                        {...register('state', { required: isUSA })}
                        className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all appearance-none"
                      >
                        <option value="">Select US State</option>
                        {State.getStatesOfCountry('US').map((s) => (
                          <option key={s.isoCode} value={s.isoCode}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <label className="block text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em] mb-2">
                          Country
                        </label>
                        <CustomCountryDropdown
                          countries={allCountries.filter((c) => c.isoCode !== 'US')}
                          selectedCode={selectedCountryCode}
                          onSelect={(code) => {
                            setValue('country', code);
                            setValue('region', '');
                          }}
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em] mb-2">
                          Region / state
                        </label>
                        <select
                          {...register('region', {
                            required: !isUSA && statesOfSelectedCountry.length > 0,
                          })}
                          disabled={!selectedCountryCode || statesOfSelectedCountry.length === 0}
                          className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none disabled:opacity-50"
                        >
                          <option value="">
                            {statesOfSelectedCountry.length > 0 ? 'Select Region' : 'N/A'}
                          </option>
                          {statesOfSelectedCountry.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Anything you want to tell us about the child?
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder="Optional notes for our tutors…"
                    className="w-full px-4 py-3 bg-[#070b16] border border-white/10 rounded-xl text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2 — Package select */}
            {formStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">Choose a package</h4>
                  <p className="text-slate-400 text-sm">Select how many tutoring sessions per week.</p>
                </div>

                <div className="space-y-3">
                  {isLoadingPackages ? (
                    <div className="py-14 text-center">
                      <Activity className="w-7 h-7 animate-spin mx-auto text-blue-400 mb-3" />
                      <p className="text-slate-500 text-sm">Loading packages…</p>
                    </div>
                  ) : packages.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-center">
                      <p className="text-slate-400 text-sm">No packages available for this program.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {packages.map((pkg) => {
                        const selected = selectedPackageId === pkg._id;
                        const popular = Boolean(pkg.isPopular);
                        return (
                          <button
                            key={pkg._id}
                            type="button"
                            onClick={() => setSelectedPackageId(pkg._id)}
                            className={`relative w-full text-left p-4 rounded-2xl border transition-all ${
                              selected
                                ? 'bg-blue-500/15 border-blue-500/60 ring-1 ring-blue-400/30'
                                : popular
                                  ? 'bg-blue-500/5 border-blue-400/40'
                                  : 'bg-[#070b16] border-white/10 hover:border-white/20'
                            }`}
                          >
                            {popular && (
                              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider">
                                Popular
                              </span>
                            )}
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  selected || popular ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                                }`}
                              >
                                <Package className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="font-semibold text-white text-[15px]">{pkg.name}</h5>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {PACKAGE_DAYS_LABELS[pkg.daysPerWeek] || `${pkg.daysPerWeek}x per week`}
                                  {' · '}
                                  {pkg.daysPerWeek} session{pkg.daysPerWeek === 1 ? '' : 's'}/week
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="font-semibold text-white text-lg">${pkg.price}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wide">/ month</p>
                              </div>
                              {selected && <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                            </div>
                            {pkg.description && (
                              <p className="text-xs text-slate-500 mt-3 pl-14">{pkg.description}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 — Subjects */}
            {formStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">Select subjects</h4>
                  <p className="text-slate-400 text-sm">
                    Choose at least one subject and set a priority for each.
                  </p>
                </div>

                <div className="space-y-2">
                  {ACADEMIC_SUBJECTS.map((subject) => {
                    const selected = selectedSubjects.find((s) => s.name === subject);
                    const isSelected = Boolean(selected);
                    return (
                      <div
                        key={subject}
                        className={`rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-blue-500/10 border-blue-500/50'
                            : 'bg-[#070b16] border-white/10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className="w-full flex items-center gap-3 p-3.5 text-left"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'
                            }`}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="flex-1 text-sm font-medium text-white">{subject}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                        </button>
                        {isSelected && selected && (
                          <div className="px-3.5 pb-3.5 pt-0 flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-[0.14em]">
                              Priority
                            </span>
                            <div className="flex gap-1.5 flex-wrap">
                              {(['HIGH', 'MEDIUM', 'LOW'] as SubjectPriority[]).map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => updateSubjectPriority(subject, p)}
                                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                                    selected.priority === p
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4 — Time blocks */}
            {formStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-white mb-1">Schedule time blocks</h4>
                  <p className="text-slate-400 text-sm">
                    Set {selectedPackage?.daysPerWeek ?? 0} session
                    {selectedPackage?.daysPerWeek === 1 ? '' : 's'} per week in your local time. Sessions on
                    the same day must not overlap.
                  </p>
                </div>

                <TimeZonePicker
                  value={scheduleTimeZone}
                  onChange={setScheduleTimeZone}
                  variant="dark"
                />

                {hasSameDayOverlap(timeBlocks) ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-300 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    These sessions overlap on the same day. Change the day or times to continue.
                  </div>
                ) : getSharedDayIndices(timeBlocks).size > 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-200 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    More than one session is on the same day. Make sure their times do not overlap.
                  </div>
                ) : null}

                <div className="space-y-4">
                  {timeBlocks.map((block, index) => {
                    const overlapIndices = getOverlapIndices(timeBlocks);
                    const sharedDayIndices = getSharedDayIndices(timeBlocks);
                    const blockHasOverlap = overlapIndices.has(index);
                    const blockSharesDay = !blockHasOverlap && sharedDayIndices.has(index);
                    const dayLabel = block.dayOfWeek
                      ? formatDayLabel(block.dayOfWeek)
                      : 'this day';

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border space-y-3 ${
                          blockHasOverlap
                            ? 'border-red-500/50 bg-red-950/30'
                            : blockSharesDay
                              ? 'border-amber-500/35 bg-amber-950/20'
                              : 'border-white/10 bg-[#070b16]'
                        }`}
                      >
                        <p
                          className={`text-[10px] font-semibold uppercase tracking-[0.14em] flex items-center gap-1.5 ${
                            blockHasOverlap
                              ? 'text-red-300'
                              : blockSharesDay
                                ? 'text-amber-300'
                                : 'text-blue-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Session {index + 1}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5">Day</label>
                            <select
                              value={block.dayOfWeek}
                              onChange={(e) => updateTimeBlock(index, 'dayOfWeek', e.target.value)}
                              className={`w-full px-3 py-2.5 bg-[#0b1224] border rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none ${
                                blockHasOverlap ? 'border-red-500/50' : 'border-white/10'
                              }`}
                            >
                              <option value="">Select day</option>
                              {DAYS_OF_WEEK.map((d) => (
                                <option key={d} value={d}>
                                  {formatDayLabel(d)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5">Subject</label>
                            <select
                              value={block.subject}
                              onChange={(e) => updateTimeBlock(index, 'subject', e.target.value)}
                              className="w-full px-3 py-2.5 bg-[#0b1224] border border-white/10 rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                            >
                              <option value="">Select subject</option>
                              {selectedSubjects.map((s) => (
                                <option key={s.name} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5">Start (your time)</label>
                            <input
                              type="time"
                              value={block.startTime}
                              onChange={(e) => updateTimeBlock(index, 'startTime', e.target.value)}
                              className={`w-full px-3 py-2.5 bg-[#0b1224] border rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none ${
                                blockHasOverlap ? 'border-red-500/50' : 'border-white/10'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1.5">End (your time)</label>
                            <input
                              type="time"
                              value={block.endTime}
                              onChange={(e) => updateTimeBlock(index, 'endTime', e.target.value)}
                              className={`w-full px-3 py-2.5 bg-[#0b1224] border rounded-xl text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none ${
                                blockHasOverlap ? 'border-red-500/50' : 'border-white/10'
                              }`}
                            />
                          </div>
                        </div>

                        {block.startTime &&
                          block.endTime &&
                          toHHmm(block.startTime) >= toHHmm(block.endTime) && (
                            <p className="text-xs text-red-400">End time must be after start time.</p>
                          )}

                        {blockHasOverlap && (
                          <p className="flex items-start gap-2 text-xs text-red-300 bg-red-950/50 border border-red-500/30 rounded-lg px-3 py-2">
                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            Overlaps another session on {dayLabel}. Pick a different day or change the time.
                          </p>
                        )}
                        {blockSharesDay && (
                          <p className="flex items-start gap-2 text-xs text-amber-200/90 bg-amber-950/40 border border-amber-500/25 rounded-lg px-3 py-2">
                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            Another session is also on {dayLabel} — times must not overlap.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5 — Success */}
            {step === 5 && (
              <div className="flex flex-col items-center justify-center py-8 sm:py-10 text-center">
                <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mb-5 border border-emerald-400/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  Your child is successfully registered
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
                  To activate tutoring for{' '}
                  <span className="text-blue-300 font-medium">{program.title}</span>, please proceed to
                  payment.
                </p>
                <div className="w-full max-w-sm p-4 rounded-2xl border border-white/10 bg-[#070b16] mb-6 space-y-2.5 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Status</span>
                    <span className="font-medium text-amber-300">Pending</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Monthly amount</span>
                    <span className="font-semibold text-white">${monthlyAmount}</span>
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

          {/* Sticky footer */}
          {step < 5 && (
            <div className="px-4 sm:px-6 py-4 border-t border-white/10 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 bg-[#070b16] pb-[max(1rem,env(safe-area-inset-bottom))] flex-shrink-0">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2.5 text-slate-300 font-medium hover:bg-white/5 rounded-xl transition-colors text-center"
                >
                  Back
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  isSubmitting ||
                  (step === 1 && !step1Valid) ||
                  (step === 2 && !selectedPackageId) ||
                  (step === 3 && selectedSubjects.length === 0) ||
                  (step === 4 && !timeBlocksValid)
                }
                className="w-full sm:w-auto sm:min-w-[160px] px-6 py-3.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {step === 4
                  ? isSubmitting
                    ? 'Processing…'
                    : 'Complete Registration'
                  : 'Continue'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const CustomCountryDropdown: React.FC<{
  countries: { isoCode: string; name: string }[];
  selectedCode: string;
  onSelect: (code: string) => void;
}> = ({ countries, selectedCode, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.isoCode === selectedCode);
  const filteredCountries = countries.filter((c) =>
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
        <div className="flex items-center gap-3 min-w-0">
          {selectedCountry ? (
            <>
              <img
                src={`https://flagcdn.com/w40/${selectedCountry.isoCode.toLowerCase()}.png`}
                alt={selectedCountry.name}
                className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
              />
              <span className="font-medium text-slate-100 truncate">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-slate-500">Select Country</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
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
                    }}
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

export default EnrollAcademicTutorialModal;
