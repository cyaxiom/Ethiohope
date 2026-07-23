import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight, Activity, Clock, Tag, Lock, X, CheckCircle2, CreditCard, Layers } from "lucide-react";
import { useGetPublicProgramByIdQuery, useGetPublicProgramsQuery } from "../../../features/programs/programApi";
import { useGetPublicPhasesByProgramQuery } from "../../../features/programs/phaseApi";
import { getImageUrl } from "../../../lib/utils";

import { useDispatch, useSelector } from "react-redux";
import { useLazyGetRegisterChildInitQuery, useCompleteProfileMutation } from "../../../features/user/userApi";
import { updateUser, logout } from "../../../features/auth/authSlice";
import { toast } from "sonner";
import EnrollChildModal from "../../../components/Enrollment/EnrollChildModal";
import EnrollSelfModal from "../../../components/Enrollment/EnrollSelfModal";
import { useGetMyEnrollmentsForProgramQuery } from "../../../features/enrollments/enrollmentApi";
import { useCreateCheckoutSessionMutation } from "../../../features/payments/paymentApi";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const dispatch = useDispatch();
  
  const [checkProfileInit] = useLazyGetRegisterChildInitQuery();
  const [completeProfile, { isLoading: isCompleting }] = useCompleteProfileMutation();
  const phasesRef = React.useRef(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    parentType: "mother",
    phone: "",
    country: "",
    state: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isSelfEnrollModalOpen, setIsSelfEnrollModalOpen] = useState(false);
  const [selectedPhaseForEnrollment, setSelectedPhaseForEnrollment] = useState(null);
  const [payingPhaseId, setPayingPhaseId] = useState(null);

  const { data: programData, isLoading: isLoadingProgram, error } = useGetPublicProgramByIdQuery(id);
  const { data: phasesData, isLoading: isLoadingPhases } = useGetPublicPhasesByProgramQuery(id);
  const { data: allProgramsData } = useGetPublicProgramsQuery({ limit: 10 });
  const { data: myEnrollmentsData } = useGetMyEnrollmentsForProgramQuery(id, {
    skip: !isAuthenticated || !id,
  });
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const myEnrollments = myEnrollmentsData?.data || [];

  /** Prefer self-enrollment for phase CTA; otherwise any enrollment for that phase. */
  const getEnrollmentForPhase = (phaseId) => {
    const forPhase = myEnrollments.filter((e) => {
      const ePhaseId = e.phase?._id || e.phase;
      return String(ePhaseId) === String(phaseId);
    });
    if (!forPhase.length) return null;
    return (
      forPhase.find((e) => e.enrolleeType === 'SELF' || e.user) ||
      forPhase[0]
    );
  };

  const isPhasePaid = (enrollment) =>
    enrollment &&
    (enrollment.paymentStatus === 'PAID' ||
      enrollment.status === 'ACTIVE' ||
      enrollment.status === 'COMPLETED');

  const isPhasePaymentPending = (enrollment) =>
    enrollment &&
    enrollment.status === 'PENDING' &&
    enrollment.paymentStatus !== 'PAID';

  const handlePayPending = async (enrollment) => {
    if (!enrollment?._id) return;
    const phaseId = enrollment.phase?._id || enrollment.phase;
    setPayingPhaseId(phaseId);
    try {
      const res = await createCheckoutSession({ enrollmentIds: [enrollment._id] }).unwrap();
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      navigate('/checkout', { state: { enrollmentIds: [enrollment._id] } });
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to start payment. Opening checkout…');
      navigate('/checkout', { state: { enrollmentIds: [enrollment._id] } });
    } finally {
      setPayingPhaseId(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const textRegex = /[a-zA-Z]/; // Must contain at least one letter

    if (!profileData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,20}$/.test(profileData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number (e.g., +1...)";
    }

    if (!profileData.country.trim()) {
      newErrors.country = "Country is required";
    } else if (!textRegex.test(profileData.country)) {
      newErrors.country = "Country name must contain letters";
    } else if (profileData.country.length < 2) {
      newErrors.country = "Country name is too short";
    }

    if (!profileData.state.trim()) {
      newErrors.state = "State is required";
    } else if (!textRegex.test(profileData.state)) {
      newErrors.state = "State name must contain letters";
    } else if (profileData.state.length < 2) {
      newErrors.state = "State name is too short";
    }

    if (!profileData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!textRegex.test(profileData.city)) {
      newErrors.city = "City name must contain letters";
    } else if (profileData.city.length < 2) {
      newErrors.city = "City name is too short";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterClick = () => {
    phasesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnrollClick = async (phase) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname + '#program-phases' } });
      return;
    }
    setSelectedPhaseForEnrollment(phase);

    // Kids programs → child enroll only; otherwise adult self-enroll (no chooser)
    if (program?.isForChildren) {
      try {
        const response = await checkProfileInit().unwrap();
        if (!response.profileCompleted) {
          setIsProfileModalOpen(true);
        } else {
          setIsEnrollModalOpen(true);
        }
      } catch (err) {
        if (err.status === 401) {
          navigate('/login', { state: { from: window.location.pathname + '#program-phases' } });
        } else {
          toast.error("Please complete your profile first.");
          setIsProfileModalOpen(true);
        }
      }
    } else {
      setIsSelfEnrollModalOpen(true);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await completeProfile(profileData).unwrap();
      if (res && res.user) {
        dispatch(updateUser({ user: res.user, roles: res.roleCodes || [] }));
        setIsProfileModalOpen(false);
        
        if (selectedPhaseForEnrollment) {
          setIsEnrollModalOpen(true);
        } else {
          setTimeout(() => phasesRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
        }
      }
    } catch (err) {
      console.error("Failed to complete profile", err);
      // If the backend returns 404 User Not Found (e.g. database reset but token persisted)
      if (err?.status === 404 || err?.status === 401) {
        dispatch(logout()); // Clean up stale state
        navigate("/login", { state: { from: window.location.pathname } });
      }
    }
  };

  // Scroll to top when course changes
  useEffect(() => {
    // If there is a hash in the URL, scroll to that element
    if (window.location.hash) {
      const hashId = window.location.hash.substring(1);
      const element = document.getElementById(hashId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500); // Wait for content to load
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const program = programData?.data;
  const phases = phasesData?.data || [];
  
  // Exclude current program from related
  const relatedPrograms = (allProgramsData?.data || []).filter(p => p._id !== id && p.isActive);

  if (isLoadingProgram || isLoadingPhases) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#070b16]">
        <Activity className="w-10 h-10 text-blue-400 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Loading program…</p>
      </div>
    );
  }

  if (!program || error) {
    return (
      <div className="text-center py-24 min-h-[70vh] flex flex-col items-center justify-center px-6 bg-[#070b16]">
        <h2 className="text-3xl font-black mb-3 text-white">Program not found</h2>
        <p className="text-slate-400 mb-8 max-w-md">
          This program does not exist or is no longer available.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const coursesPerPage = 2;
  const totalPages = Math.ceil(relatedPrograms.length / coursesPerPage);
  const startIndex = page * coursesPerPage;
  const paginatedCourses = relatedPrograms.slice(startIndex, startIndex + coursesPerPage);
  const totalWeeks = phases.reduce((acc, p) => acc + (p.durationWeeks || 0), 0);
  const prices = phases.map((p) => Number(p.price) || 0);
  const startingPrice = prices.length ? Math.min(...prices) : null;
  const heroImage = program.image ? getImageUrl(program.image) : null;

  const stats = [
    {
      label: 'Audience',
      value: program.isForChildren
        ? program.ageRange?.trim() || 'Kids program'
        : program.ageRange?.trim() || 'Open to everyone',
      icon: Star,
      accent: 'from-amber-400 to-orange-500',
    },
    {
      label: 'Duration',
      value: totalWeeks > 0 ? `${totalWeeks} weeks` : 'Flexible',
      icon: Clock,
      accent: 'from-sky-400 to-blue-600',
    },
    {
      label: 'Phases',
      value: phases.length ? `${phases.length} learning stages` : 'Coming soon',
      icon: Layers,
      accent: 'from-emerald-400 to-teal-600',
    },
    {
      label: 'From',
      value: startingPrice != null ? `$${startingPrice}` : 'See phases',
      icon: Tag,
      accent: 'from-violet-400 to-indigo-600',
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
        className="bg-[#070b16] text-slate-100"
      >
        {/* ---------------- HERO ---------------- */}
        <div className="relative min-h-[78vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {heroImage ? (
              <img
                src={heroImage}
                alt=""
                className="w-full h-full object-cover scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0b1224] via-[#13204a] to-[#1a3a5c]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b16]/95 via-[#070b16]/75 to-[#070b16]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-transparent to-[#070b16]/40" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-16">
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('popular-programs')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All programs
            </motion.button>

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-end">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    Ethiohope Academy
                  </span>
                  {program.isForChildren && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-[11px] font-bold uppercase tracking-wider text-sky-200">
                      Kids program
                    </span>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight max-w-3xl mb-5 drop-shadow-lg">
                  {program.title}
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
                  {program.description ||
                    'Step-by-step learning from foundations to advanced skills, with live sessions and guided practice.'}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <motion.button
                    onClick={handleRegisterClick}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-base rounded-2xl shadow-[0_12px_40px_rgba(37,99,235,0.35)] overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {program.isForChildren ? 'Enroll your child' : 'View phases & enroll'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </motion.button>
                  {phases.length > 0 && (
                    <p className="text-sm text-slate-400">
                      {phases.filter((p) => p.isActive !== false).length} open phase
                      {phases.filter((p) => p.isActive !== false).length === 1 ? '' : 's'} ready to join
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.75, delay: 0.15 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -inset-6 bg-blue-500/20 blur-3xl rounded-full" />
                  <div className="relative aspect-square max-w-md ml-auto rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                    {heroImage ? (
                      <img src={heroImage} alt={program.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                        <span className="text-white text-8xl font-black opacity-80">
                          {program.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ---------------- STATS STRIP ---------------- */}
        <div className="relative z-20 -mt-10 px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#0b1224] rounded-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-4 sm:p-5 flex items-start gap-3 sm:gap-4 min-w-0"
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${stat.accent} flex items-center justify-center text-white shadow-md flex-shrink-0`}
                >
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white leading-snug break-words">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ---------------- ABOUT ---------------- */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 mb-3">
                About this program
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Built for real progress, not just watching videos
              </h2>
              <p className="text-slate-400 leading-relaxed">
                {program.isForChildren
                  ? 'Kids learn through guided sessions, creative projects, and clear milestones — so parents can see growth at every phase.'
                  : 'Adults move through structured phases with live support, hands-on practice, and clear outcomes you can apply immediately.'}
              </p>
            </div>
            <div className="bg-[#0b1224] rounded-3xl border border-white/10 p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-bl-[6rem]" />
              <p className="relative text-slate-300 leading-relaxed text-lg">
                {program.description ||
                  'This program takes learners from foundational concepts to practical skills through phased learning. Each phase builds on the last, with schedules you pick and instructors who guide the journey.'}
              </p>
              <div className="relative mt-8 flex flex-wrap gap-3">
                {['Live sessions', 'Phased learning', 'Guided enrollment'].map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- PHASES ---------------- */}
        {phases.length > 0 && (
          <div
            id="program-phases"
            ref={phasesRef}
            className="scroll-mt-24 bg-[#0b1224] py-20 px-6 lg:px-10"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300 mb-3">
                  Learning path
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Choose your phase
                </h2>
                <p className="text-slate-400">
                  Start where you belong. Each phase has its own schedule, duration, and price.
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {phases.map((phase, index) => {
                  const isActive = phase.isActive !== false;

                  return (
                    <motion.div
                      key={phase._id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                      className={`relative rounded-3xl border p-7 flex flex-col h-full overflow-hidden transition-all duration-300 ${
                        isActive
                          ? 'bg-white/[0.04] border-white/10 hover:border-blue-400/40 hover:bg-white/[0.07] hover:-translate-y-1'
                          : 'bg-white/[0.02] border-white/5 opacity-55'
                      }`}
                      title={!isActive ? 'This phase is currently closed.' : undefined}
                    >
                      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-900/30">
                            {phase.orderIndex}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                              Phase {phase.orderIndex}
                            </p>
                            <p className="text-xs text-slate-400">
                              {isActive ? 'Open for enrollment' : 'Currently closed'}
                            </p>
                          </div>
                        </div>
                        {!isActive && <Lock className="text-slate-500 w-5 h-5" />}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 leading-snug">{phase.title}</h3>
                      <p className="text-slate-400 text-sm flex-1 mb-6 leading-relaxed">
                        {phase.description || 'Details for this phase will be shared soon.'}
                      </p>

                      <div className="flex items-center justify-between gap-3 mb-6 py-4 border-y border-white/10">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
                          <Clock className="w-4 h-4 text-sky-400" />
                          {phase.durationWeeks || 0} weeks
                        </span>
                        <span className="inline-flex items-center gap-2 text-lg font-black text-white">
                          ${phase.price ?? 0}
                        </span>
                      </div>

                      {isActive ? (
                        (() => {
                          const enrollment = isAuthenticated ? getEnrollmentForPhase(phase._id) : null;
                          if (isPhasePaid(enrollment)) {
                            return (
                              <div className="mt-auto w-full py-3.5 bg-emerald-500/15 text-emerald-300 text-center rounded-2xl border border-emerald-400/20 font-bold flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Enrolled
                              </div>
                            );
                          }
                          if (isPhasePaymentPending(enrollment)) {
                            return (
                              <div className="mt-auto space-y-2">
                                <div className="w-full py-2.5 bg-amber-500/10 text-amber-300 text-center rounded-2xl border border-amber-400/20 text-sm font-bold">
                                  Payment pending
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handlePayPending(enrollment)}
                                  disabled={payingPhaseId === phase._id}
                                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                  {payingPhaseId === phase._id ? (
                                    <Activity className="w-5 h-5 animate-spin" />
                                  ) : (
                                    <CreditCard className="w-5 h-5" />
                                  )}
                                  {payingPhaseId === phase._id ? 'Redirecting…' : 'Pay Now'}
                                </button>
                              </div>
                            );
                          }
                          return (
                            <button
                              type="button"
                              onClick={() => handleEnrollClick(phase)}
                              className="mt-auto w-full py-3.5 bg-gradient-to-r from-blue-600 to-emerald-500 hover:opacity-95 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"
                            >
                              Enroll Now
                            </button>
                          );
                        })()
                      ) : (
                        <div className="mt-auto w-full py-3.5 bg-white/5 text-slate-500 text-center rounded-2xl font-medium">
                          Currently closed
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- RELATED ---------------- */}
        {relatedPrograms.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
            <div className="flex items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 mb-2">
                  Keep exploring
                </p>
                <h2 className="text-3xl font-black text-white">Other programs you might like</h2>
              </div>
              {totalPages > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="p-2.5 rounded-xl bg-[#0b1224] border border-white/10 hover:border-blue-400/40 disabled:opacity-40 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-200" />
                  </button>
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page === totalPages - 1}
                    className="p-2.5 rounded-xl bg-[#0b1224] border border-white/10 hover:border-blue-400/40 disabled:opacity-40 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-slate-200" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {paginatedCourses.map((related) => (
                <motion.button
                  key={related._id}
                  type="button"
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(`/academy/kids-programming/course/${related._id}`)}
                  className="group text-left bg-[#0b1224] border border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400/30 transition-all"
                >
                  <div className="relative h-52 overflow-hidden">
                    {related.image ? (
                      <img
                        src={getImageUrl(related.image)}
                        alt={related.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                        <span className="text-white text-5xl font-black">{related.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-5 line-clamp-2">
                      {related.description || 'Hands-on learning with clear phases and live support.'}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-400">
                      View details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center pb-16">
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                document.getElementById('popular-programs')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl border border-white/10 bg-[#0b1224] text-slate-200 font-semibold hover:border-blue-400/40 hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to courses
          </button>
        </div>

        {/* ---------------- PROFILE MODAL ---------------- */}
        <AnimatePresence>
          {isProfileModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-muted/40">
                  <h3 className="text-xl font-bold text-foreground">Complete Parent Profile</h3>
                  <button onClick={() => setIsProfileModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Before registering your child, please complete a few details to create your parent profile.
                  </p>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Relationship</label>
                    <select
                      required
                      value={profileData.parentType}
                      onChange={e => {
                        setProfileData({...profileData, parentType: e.target.value});
                        if (errors.parentType) setErrors(prev => ({...prev, parentType: null}));
                      }}
                      className="w-full p-2.5 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
                    >
                      <option value="mother">Mother</option>
                      <option value="father">Father</option>
                      <option value="guardian">Guardian</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={profileData.phone}
                      onChange={e => {
                        setProfileData({...profileData, phone: e.target.value});
                        if (errors.phone) setErrors(prev => ({...prev, phone: null}));
                      }}
                      className={`w-full p-2.5 bg-background border ${errors.phone ? 'border-red-500' : 'border-input'} rounded-lg focus:ring-2 focus:ring-primary/50 outline-none`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Country</label>
                      <input
                        required
                        type="text"
                        placeholder="United States"
                        value={profileData.country}
                        onChange={e => {
                          setProfileData({...profileData, country: e.target.value});
                          if (errors.country) setErrors(prev => ({...prev, country: null}));
                        }}
                        className={`w-full p-2.5 bg-background border ${errors.country ? 'border-red-500' : 'border-input'} rounded-lg focus:ring-2 focus:ring-primary/50 outline-none`}
                      />
                      {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">State / Region</label>
                      <input
                        required
                        type="text"
                        placeholder="Texas"
                        value={profileData.state}
                        onChange={e => {
                          setProfileData({...profileData, state: e.target.value});
                          if (errors.state) setErrors(prev => ({...prev, state: null}));
                        }}
                        className={`w-full p-2.5 bg-background border ${errors.state ? 'border-red-500' : 'border-input'} rounded-lg focus:ring-2 focus:ring-primary/50 outline-none`}
                      />
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">City</label>
                    <input
                      required
                      type="text"
                      placeholder="Dallas"
                      value={profileData.city}
                      onChange={e => {
                        setProfileData({...profileData, city: e.target.value});
                        if (errors.city) setErrors(prev => ({...prev, city: null}));
                      }}
                      className={`w-full p-2.5 bg-background border ${errors.city ? 'border-red-500' : 'border-input'} rounded-lg focus:ring-2 focus:ring-primary/50 outline-none`}
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  
                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(false)}
                      className="px-5 py-2.5 text-muted-foreground hover:bg-muted font-medium rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCompleting}
                      className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow disabled:opacity-70 flex items-center gap-2"
                    >
                      {isCompleting ? <Activity className="w-5 h-5 animate-spin" /> : null}
                      Complete Profile
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedPhaseForEnrollment && (
          <>
            <EnrollSelfModal
              isOpen={isSelfEnrollModalOpen}
              onClose={() => {
                setIsSelfEnrollModalOpen(false);
                setSelectedPhaseForEnrollment(null);
              }}
              program={program}
              phase={selectedPhaseForEnrollment}
            />
            <EnrollChildModal 
              isOpen={isEnrollModalOpen}
              onClose={() => {
                setIsEnrollModalOpen(false);
                setSelectedPhaseForEnrollment(null);
              }}
              program={program}
              phase={selectedPhaseForEnrollment}
            />
          </>
        )}
      </motion.section>
    </AnimatePresence>
  );
};

export default CourseDetail;
