import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  User,
  CheckCircle2,
  Activity,
  Clock,
  BookOpen,
  Package,
  AlertTriangle,
  CreditCard,
  Plus,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Country, State } from 'country-state-city';
import { toast } from 'sonner';
import {
  ACADEMIC_SUBJECTS,
  DAYS_OF_WEEK,
  PACKAGE_DAYS_LABELS,
  sortPackagesWithPopularCentered,
  type AcademicSubject,
  type SubjectPriority,
} from '../../common/academicSubjects';
import { useGetPublicPackagesByProgramQuery, type TutoringPackage } from '../../features/programs/packageApi';
import { usePrepareEnrollmentMutation } from '../../features/enrollments/enrollmentApi';
import { useGetParentChildrenQuery } from '../../features/user/userApi';
import TimeZonePicker from '../ui/TimeZonePicker';
import { detectBrowserTimeZone, ETHIOPIA_TZ } from '../../lib/timezone';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  program: any;
  initialPackageId?: string;
}

type ChildMode = 'existing' | 'new';

interface NewChildForm {
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

const formatDayLabel = (day: string) => day.charAt(0) + day.slice(1).toLowerCase();

const toHHmm = (time: string): string => {
  if (!time) return '';
  const parts = time.split(':');
  if (parts.length < 2) return time;
  return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
};

const timesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => {
  if (!aStart || !aEnd || !bStart || !bEnd) return false;
  if (aStart >= aEnd || bStart >= bEnd) return false;
  return aStart < bEnd && bStart < aEnd;
};

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

const ParentAcademicTutorialModal: React.FC<Props> = ({
  isOpen,
  onClose,
  program,
  initialPackageId,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [childMode, setChildMode] = useState<ChildMode>('existing');
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [createdEnrollmentIds, setCreatedEnrollmentIds] = useState<string[]>([]);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [scheduleTimeZone, setScheduleTimeZone] = useState(detectBrowserTimeZone);

  const { register, handleSubmit, watch, setValue, reset } = useForm<NewChildForm>({
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
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const stateValue = watch('state');
  const countryValue = watch('country');
  const regionValue = watch('region');

  const { data: childrenResponse, isLoading: isLoadingChildren } = useGetParentChildrenQuery(undefined, {
    skip: !isOpen,
  });
  const { data: packagesData, isLoading: isLoadingPackages } = useGetPublicPackagesByProgramQuery(
    program?._id,
    { skip: !program?._id || !isOpen }
  );
  const [prepareEnrollment, { isLoading: isSubmitting }] = usePrepareEnrollmentMutation();

  const allChildren = childrenResponse?.data || [];
  const packages = sortPackagesWithPopularCentered(packagesData?.data || []);
  const selectedPackage = packages.find((p) => p._id === selectedPackageId) as TutoringPackage | undefined;

  const availableChildren = useMemo(() => {
    if (!selectedPackageId) return allChildren;
    return allChildren.filter((child: any) => {
      const existing = child.enrollments?.find(
        (e: any) =>
          (e.package?._id === selectedPackageId || e.package === selectedPackageId) &&
          (e.paymentStatus === 'PAID' || e.status === 'ACTIVE' || e.status === 'PENDING')
      );
      return !existing;
    });
  }, [allChildren, selectedPackageId]);

  useEffect(() => {
    if (!selectedPackageId) return;
    setSelectedChildIds((prev) =>
      prev.filter((id) => availableChildren.some((c: any) => c._id === id))
    );
  }, [selectedPackageId, availableChildren]);

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setChildMode(allChildren.length > 0 ? 'existing' : 'new');
    setSelectedChildIds([]);
    setSelectedPackageId(initialPackageId || '');
    setSelectedSubjects([]);
    setTimeBlocks([]);
    setCreatedEnrollmentIds([]);
    setMonthlyAmount(0);
    setScheduleTimeZone(detectBrowserTimeZone());
    reset();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialPackageId, reset]);

  useEffect(() => {
    if (isOpen && allChildren.length === 0) setChildMode('new');
  }, [isOpen, allChildren.length]);

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
    setSelectedSubjects((prev) => prev.map((s) => (s.name === name ? { ...s, priority } : s)));
  };

  const updateTimeBlock = (index: number, field: keyof TimeBlock, value: string) => {
    setTimeBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, [field]: value } : block)));
  };

  const timeBlocksValid =
    timeBlocks.length > 0 &&
    timeBlocks.every(
      (b) => b.dayOfWeek && b.startTime && b.endTime && b.subject && toHHmm(b.startTime) < toHHmm(b.endTime)
    ) &&
    !hasSameDayOverlap(timeBlocks);

  const newChildValid =
    Boolean(firstName?.trim()) &&
    Boolean(lastName?.trim()) &&
    (isUSA
      ? Boolean(stateValue)
      : Boolean(countryValue) &&
        (State.getStatesOfCountry(countryValue).length === 0 || Boolean(regionValue)));

  const step1Valid = childMode === 'existing' ? selectedChildIds.length > 0 : newChildValid;

  const submitEnrollment = async (data?: NewChildForm) => {
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
      const base = {
        enrolleeType: 'CHILD' as const,
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

      let payload: any;
      if (childMode === 'existing') {
        payload = { ...base, childIds: selectedChildIds };
      } else {
        const form = data!;
        const countryObj = Country.getCountryByCode(form.country);
        const stateObj = State.getStateByCodeAndCountry(form.region || form.state, form.country);
        payload = {
          ...base,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          dob: form.dob || undefined,
          grade: form.grade || undefined,
          isUSA: form.isUSA,
          country: countryObj?.name || (form.isUSA ? 'United States' : ''),
          region: stateObj?.name || form.region || form.state,
          notes: form.notes?.trim() || undefined,
        };
      }

      const result = await prepareEnrollment(payload).unwrap();
      const count =
        childMode === 'existing' ? selectedChildIds.length : 1;
      setCreatedEnrollmentIds(result.data.enrollmentIds || []);
      setMonthlyAmount(selectedPackage.price * count);
      setStep(5);
      toast.success(result.message || 'Enrollment prepared');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to prepare enrollment');
    }
  };

  const handleContinue = () => {
    if (step === 1 && !step1Valid) {
      toast.error(
        childMode === 'existing'
          ? 'Select at least one child'
          : 'Please complete required child details'
      );
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
        toast.error(
          hasSameDayOverlap(timeBlocks)
            ? 'Time blocks on the same day cannot overlap'
            : 'Please complete all time blocks'
        );
        return;
      }
      if (childMode === 'new') {
        handleSubmit(submitEnrollment)();
      } else {
        submitEnrollment();
      }
      return;
    }
    setStep((s) => s + 1);
  };

  if (!isOpen) return null;

  const totalSteps = 5;
  const formStep = step <= 4 ? step : 0;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-t-2xl sm:rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] border border-gray-100">
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex justify-between items-start gap-3 bg-gray-50/50 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              Enroll for Tutoring
            </h3>
            <p className="text-blue-600 font-bold text-xs sm:text-sm uppercase tracking-wider truncate mt-1">
              {program?.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex px-4 sm:px-10 pt-5 pb-3 flex-shrink-0">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                  step === s
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : step > s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-1.5 rounded-full ${
                    step > s ? 'bg-emerald-500' : 'bg-gray-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="px-4 sm:px-10 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {['Student', 'Package', 'Subjects', 'Schedule', 'Checkout'][step - 1]} · Step {step} of{' '}
          {totalSteps}
        </p>

        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="px-4 sm:px-8 py-5 overflow-y-auto flex-1 custom-scrollbar">
            {formStep === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                <div className="flex bg-gray-100 p-1 rounded-xl self-start w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setChildMode('existing')}
                    disabled={allChildren.length === 0}
                    className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all inline-flex items-center justify-center gap-2 ${
                      childMode === 'existing'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-500'
                    } disabled:opacity-40`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Existing child
                  </button>
                  <button
                    type="button"
                    onClick={() => setChildMode('new')}
                    className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all inline-flex items-center justify-center gap-2 ${
                      childMode === 'new' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Register new
                  </button>
                </div>

                {childMode === 'existing' ? (
                  <div>
                    <h4 className="text-lg font-black text-gray-900 mb-1">Select student(s)</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Choose who should join this monthly tutoring package.
                    </p>
                    {isLoadingChildren ? (
                      <div className="py-10 text-center">
                        <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      </div>
                    ) : availableChildren.length === 0 ? (
                      <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-3">
                          {allChildren.length === 0
                            ? 'No children registered yet.'
                            : 'All your children already have this package pending or active.'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setChildMode('new')}
                          className="text-sm font-bold text-blue-600 hover:underline"
                        >
                          Register a new child instead
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableChildren.map((child: any) => {
                          const isSelected = selectedChildIds.includes(child._id);
                          return (
                            <button
                              key={child._id}
                              type="button"
                              onClick={() => {
                                setSelectedChildIds((prev) =>
                                  isSelected
                                    ? prev.filter((id) => id !== child._id)
                                    : [...prev, child._id]
                                );
                              }}
                              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-600 shadow-md'
                                  : 'bg-white border-gray-100 hover:border-blue-200'
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                <User className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-800 text-sm truncate">
                                  {child.firstname} {child.lastname}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                  @{child.username}
                                </p>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-black text-gray-900 mb-1">Register new child</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Creates their account with a 6-digit PIN and emails you the credentials.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">First name</label>
                        <input
                          {...register('firstName', { required: true })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last name</label>
                        <input
                          {...register('lastName', { required: true })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Date of birth <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="date"
                          {...register('dob')}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Grade <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <select
                          {...register('grade')}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select grade</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                            <option key={g} value={g}>
                              Grade {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-gray-700">Location</span>
                        <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              setValue('isUSA', true);
                              setValue('country', 'US');
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                              isUSA ? 'bg-blue-600 text-white' : 'text-gray-500'
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
                            className={`px-3 py-1.5 text-xs font-bold rounded-md ${
                              !isUSA ? 'bg-blue-600 text-white' : 'text-gray-500'
                            }`}
                          >
                            International
                          </button>
                        </div>
                      </div>
                      {isUSA ? (
                        <select
                          {...register('state', { required: isUSA })}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
                        >
                          <option value="">Select US state</option>
                          {State.getStatesOfCountry('US').map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <select
                            {...register('country', { required: !isUSA })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none"
                            onChange={(e) => {
                              setValue('country', e.target.value);
                              setValue('region', '');
                            }}
                          >
                            <option value="">Select country</option>
                            {Country.getAllCountries()
                              .filter((c) => c.isoCode !== 'US')
                              .map((c) => (
                                <option key={c.isoCode} value={c.isoCode}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                          <select
                            {...register('region')}
                            disabled={!countryValue || State.getStatesOfCountry(countryValue).length === 0}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none disabled:opacity-50"
                          >
                            <option value="">Region / state</option>
                            {State.getStatesOfCountry(countryValue).map((s) => (
                              <option key={s.isoCode} value={s.isoCode}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <textarea
                      {...register('notes')}
                      rows={2}
                      placeholder="Optional notes for tutors…"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-1">Choose a package</h4>
                  <p className="text-sm text-gray-500">Monthly tutoring sessions per week.</p>
                </div>
                {isLoadingPackages ? (
                  <div className="py-12 text-center">
                    <Activity className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  </div>
                ) : packages.length === 0 ? (
                  <p className="p-8 text-center text-gray-500 border-2 border-dashed rounded-2xl">
                    No packages available yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {packages.map((pkg) => {
                      const selected = selectedPackageId === pkg._id;
                      return (
                        <button
                          key={pkg._id}
                          type="button"
                          onClick={() => setSelectedPackageId(pkg._id)}
                          className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all ${
                            selected
                              ? 'bg-blue-50 border-blue-600 shadow-md'
                              : pkg.isPopular
                                ? 'border-blue-200 bg-blue-50/40'
                                : 'border-gray-100 hover:border-blue-200'
                          }`}
                        >
                          {pkg.isPopular && (
                            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase">
                              Popular
                            </span>
                          )}
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              <Package className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-gray-900">{pkg.name}</h5>
                              <p className="text-xs text-gray-500">
                                {PACKAGE_DAYS_LABELS[pkg.daysPerWeek] ||
                                  `${pkg.daysPerWeek}x per week`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 text-lg">${pkg.price}</p>
                              <p className="text-[10px] text-gray-400 uppercase">/ month</p>
                            </div>
                            {selected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {formStep === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-1">Select subjects</h4>
                  <p className="text-sm text-gray-500">Choose at least one and set priority.</p>
                </div>
                <div className="space-y-2">
                  {ACADEMIC_SUBJECTS.map((subject) => {
                    const selected = selectedSubjects.find((s) => s.name === subject);
                    return (
                      <div
                        key={subject}
                        className={`rounded-xl border-2 transition-all ${
                          selected ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className="w-full flex items-center gap-3 p-3.5 text-left"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="flex-1 text-sm font-bold text-gray-800">{subject}</span>
                          {selected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </button>
                        {selected && (
                          <div className="px-3.5 pb-3 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                              Priority
                            </span>
                            {(['HIGH', 'MEDIUM', 'LOW'] as SubjectPriority[]).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => updateSubjectPriority(subject, p)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                                  selected.priority === p
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-500 border border-gray-200'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {formStep === 4 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h4 className="text-lg font-black text-gray-900 mb-1">Schedule sessions</h4>
                  <p className="text-sm text-gray-500">
                    Set {selectedPackage?.daysPerWeek ?? 0} session
                    {(selectedPackage?.daysPerWeek || 0) === 1 ? '' : 's'} per week in your local time.
                    Sessions on the same day must not overlap.
                  </p>
                </div>

                <TimeZonePicker
                  value={scheduleTimeZone}
                  onChange={setScheduleTimeZone}
                  variant="light"
                />

                {hasSameDayOverlap(timeBlocks) ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    These sessions overlap on the same day. Change the day or times to continue.
                  </div>
                ) : getSharedDayIndices(timeBlocks).size > 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
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
                          ? 'border-red-300 bg-red-50'
                          : blockSharesDay
                            ? 'border-amber-200 bg-amber-50/60'
                            : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                          blockHasOverlap
                            ? 'text-red-600'
                            : blockSharesDay
                              ? 'text-amber-700'
                              : 'text-blue-600'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Session {index + 1}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Day</label>
                          <select
                            value={block.dayOfWeek}
                            onChange={(e) => updateTimeBlock(index, 'dayOfWeek', e.target.value)}
                            className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm ${
                              blockHasOverlap ? 'border-red-300' : 'border-gray-200'
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
                          <label className="block text-xs font-bold text-gray-500 mb-1">Subject</label>
                          <select
                            value={block.subject}
                            onChange={(e) => updateTimeBlock(index, 'subject', e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
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
                          <label className="block text-xs font-bold text-gray-500 mb-1">Start (your time)</label>
                          <input
                            type="time"
                            value={block.startTime}
                            onChange={(e) => updateTimeBlock(index, 'startTime', e.target.value)}
                            className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm ${
                              blockHasOverlap ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">End (your time)</label>
                          <input
                            type="time"
                            value={block.endTime}
                            onChange={(e) => updateTimeBlock(index, 'endTime', e.target.value)}
                            className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm ${
                              blockHasOverlap ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                        </div>
                      </div>
                      {block.startTime &&
                        block.endTime &&
                        toHHmm(block.startTime) >= toHHmm(block.endTime) && (
                          <p className="text-xs text-red-600">End time must be after start time.</p>
                        )}
                      {blockHasOverlap && (
                        <p className="flex items-start gap-2 text-xs text-red-700 bg-red-100/80 border border-red-200 rounded-lg px-3 py-2">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          Overlaps another session on {dayLabel}. Pick a different day or change the time.
                        </p>
                      )}
                      {blockSharesDay && (
                        <p className="flex items-start gap-2 text-xs text-amber-800 bg-amber-100/70 border border-amber-200 rounded-lg px-3 py-2">
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

            {step === 5 && (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl shadow-emerald-50">
                  <CreditCard className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Your child is successfully registered
                </h3>
                <p className="text-gray-500 max-w-sm mb-6 font-medium leading-relaxed">
                  To activate tutoring, please proceed to payment. Until then, the student can log in with
                  courses locked.
                </p>
                <div className="w-full max-w-sm p-4 rounded-2xl border border-gray-100 bg-gray-50 mb-6 space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold">Status</span>
                    <span className="font-bold text-amber-600">Pending</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold">Monthly total</span>
                    <span className="font-black text-gray-900">${monthlyAmount}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/checkout', { state: { enrollmentIds: createdEnrollmentIds } });
                  }}
                  className="w-full max-w-sm py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg"
                >
                  Proceed to payment
                </button>
              </div>
            )}
          </div>

          {step < 5 && (
            <div className="px-4 sm:px-8 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-between gap-2 bg-gray-50/80 pb-[max(1rem,env(safe-area-inset-bottom))] flex-shrink-0">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-full sm:w-auto px-4 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
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
                className="w-full sm:w-auto sm:min-w-[160px] px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl disabled:opacity-50"
              >
                {step === 4 ? (isSubmitting ? 'Processing…' : 'Complete enrollment') : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentAcademicTutorialModal;
