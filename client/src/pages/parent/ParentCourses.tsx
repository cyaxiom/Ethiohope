import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPublicProgramsQuery, useGetPublicProgramByIdQuery } from "../../features/programs/programApi";
import { useGetPublicPhasesByProgramQuery } from "../../features/programs/phaseApi";
import { useGetPublicPackagesByProgramQuery } from "../../features/programs/packageApi";
import { getImageUrl } from "../../lib/utils";
import { stripHtml } from "../../lib/html";
import RichTextContent from "../../components/ui/RichTextContent";
import {
  Activity,
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Star,
  Tag,
  Lock,
  ArrowLeft,
  Package,
  GraduationCap,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import ParentEnrollModal from "../../components/Enrollment/ParentEnrollModal";
import ParentAcademicTutorialModal from "../../components/Enrollment/ParentAcademicTutorialModal";
import EnrollSelfModal from "../../components/Enrollment/EnrollSelfModal";
import { useGetMyEnrollmentsForProgramQuery } from "../../features/enrollments/enrollmentApi";
import { useCreateCheckoutSessionMutation } from "../../features/payments/paymentApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  PACKAGE_DAYS_LABELS,
  sortPackagesWithPopularCentered,
} from "../../common/academicSubjects";

export type ParentCourseAudience = "children" | "self";

const isChildProgram = (p: any) =>
  Boolean(p.isForChildren) || p.programType === "ACADEMIC_TUTORIAL";

const isSelfProgram = (p: any) =>
  !p.isForChildren && p.programType !== "ACADEMIC_TUTORIAL";

interface ParentCoursesProps {
  audience?: ParentCourseAudience;
}

const ParentCourses: React.FC<ParentCoursesProps> = ({ audience = "children" }) => {
  const isSelf = audience === "self";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedPhaseForEnroll, setSelectedPhaseForEnroll] = useState<any>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selfEnroll, setSelfEnroll] = useState<{ program: any; phase: any } | null>(null);
  const [tutorialEnroll, setTutorialEnroll] = useState<{
    program: any;
    packageId?: string;
  } | null>(null);

  const { data: programsData, isLoading: isLoadingPrograms } = useGetPublicProgramsQuery({ limit: 100 });
  const programs = (programsData?.data || [])
    .filter((p: any) => p.isActive)
    .filter((p: any) => (isSelf ? isSelfProgram(p) : isChildProgram(p)));

  const filteredPrograms = programs.filter((p: any) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollClick = (program: any, phase: any) => {
    if (isSelf) {
      setSelfEnroll({ program, phase });
      return;
    }
    setSelectedPhaseForEnroll({ program, phase });
    setIsEnrollModalOpen(true);
  };

  const handleTutorialEnroll = (program: any, packageId?: string) => {
    setTutorialEnroll({ program, packageId });
  };

  if (isLoadingPrograms) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Activity className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-600 uppercase tracking-widest">Loading Programs...</h2>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-12 max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
      <AnimatePresence mode="wait">
        {!selectedProgramId ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <header className="mb-10">
              <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight mb-3">
                {isSelf ? "Programs for You" : "Programs for Your Children"}
              </h1>
              <p className="text-gray-500 font-medium text-base sm:text-lg max-w-2xl leading-relaxed">
                {isSelf
                  ? "Browse adult programs and enroll yourself — pick a phase, batch, and schedule, then complete payment."
                  : "Browse kids programs and academic tutoring, then enroll your children from your dashboard."}
              </p>
            </header>

            <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-blue-50/50 mb-10 flex items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <input
                  type="text"
                  placeholder={
                    isSelf
                      ? "Search programs for you (e.g. Database, AI...)"
                      : "Search for a program (e.g. Scratch, Python, Tutoring...)"
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPrograms.map((program: any) => {
                const isTutorial = program.programType === "ACADEMIC_TUTORIAL";
                const preview = stripHtml(program.description) || "Join our expert-led program.";
                return (
                  <div
                    key={program._id}
                    onClick={() => setSelectedProgramId(program._id)}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group h-full flex flex-col"
                  >
                    <div className="relative h-48 bg-muted/20 overflow-hidden">
                      {program.image ? (
                        <img
                          src={getImageUrl(program.image)}
                          alt={program.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                          <span className="text-white text-4xl font-black">{program.title.charAt(0)}</span>
                        </div>
                      )}
                      {isTutorial && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                          Monthly tutoring
                        </span>
                      )}
                      {isSelf && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                          For adults
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">{preview}</p>

                      <div className="mt-auto mb-5">
                        <span
                          className={`inline-block text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md ${
                            isTutorial
                              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                              : isSelf
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                : "bg-gradient-to-r from-orange-400 to-pink-500"
                          }`}
                        >
                          {program.ageRange?.trim()
                            ? `Age: ${program.ageRange}`
                            : isTutorial
                              ? "Academic tutoring"
                              : isSelf
                                ? "Adult program"
                                : "For children"}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-blue-600 font-bold text-sm">See Details</span>
                        <span className="text-blue-600 font-bold transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPrograms.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">No programs found</h3>
                <p className="text-gray-500 font-medium">
                  {isSelf
                    ? "No adult programs are available yet, or try a different search."
                    : "No kids programs match your search."}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <ProgramDetailView
            programId={selectedProgramId}
            audience={audience}
            onBack={() => setSelectedProgramId(null)}
            onEnroll={handleEnrollClick}
            onTutorialEnroll={handleTutorialEnroll}
          />
        )}
      </AnimatePresence>

      {!isSelf && selectedPhaseForEnroll && (
        <ParentEnrollModal
          isOpen={isEnrollModalOpen}
          onClose={() => {
            setIsEnrollModalOpen(false);
            setSelectedPhaseForEnroll(null);
          }}
          program={selectedPhaseForEnroll.program}
          initialPhaseId={selectedPhaseForEnroll.phase._id}
        />
      )}

      {isSelf && selfEnroll && (
        <EnrollSelfModal
          isOpen={!!selfEnroll}
          onClose={() => setSelfEnroll(null)}
          program={selfEnroll.program}
          phase={selfEnroll.phase}
        />
      )}

      {!isSelf && tutorialEnroll && (
        <ParentAcademicTutorialModal
          isOpen={!!tutorialEnroll}
          onClose={() => setTutorialEnroll(null)}
          program={tutorialEnroll.program}
          initialPackageId={tutorialEnroll.packageId}
        />
      )}
    </div>
  );
};

const ProgramDetailView: React.FC<{
  programId: string;
  audience: ParentCourseAudience;
  onBack: () => void;
  onEnroll: (program: any, phase: any) => void;
  onTutorialEnroll: (program: any, packageId?: string) => void;
}> = ({ programId, audience, onBack, onEnroll, onTutorialEnroll }) => {
  const isSelf = audience === "self";
  const navigate = useNavigate();
  const [payingId, setPayingId] = useState<string | null>(null);
  const { data: programRes, isLoading: isLoadingProg } = useGetPublicProgramByIdQuery(programId);
  const program = programRes?.data;
  const isTutorial = !isSelf && program?.programType === "ACADEMIC_TUTORIAL";

  const { data: phasesRes, isLoading: isLoadingPhases } = useGetPublicPhasesByProgramQuery(programId, {
    skip: !programId || isTutorial,
  });
  const { data: packagesRes, isLoading: isLoadingPackages } = useGetPublicPackagesByProgramQuery(
    programId,
    { skip: !programId || !isTutorial }
  );
  const { data: myEnrollmentsData } = useGetMyEnrollmentsForProgramQuery(programId, {
    skip: !programId || !isSelf,
  });
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const phases = phasesRes?.data || [];
  const packages = sortPackagesWithPopularCentered(packagesRes?.data || []);
  const myEnrollments = myEnrollmentsData?.data || [];
  const isLoadingExtras = isTutorial ? isLoadingPackages : isLoadingPhases;

  const getEnrollmentForPhase = (phaseId: string) => {
    const forPhase = myEnrollments.filter((e: any) => {
      const ePhaseId = e.phase?._id || e.phase;
      return String(ePhaseId) === String(phaseId);
    });
    if (!forPhase.length) return null;
    return (
      forPhase.find((e: any) => e.enrolleeType === "SELF" || e.user) || forPhase[0]
    );
  };

  const isEnrollmentPaid = (enrollment: any) =>
    enrollment &&
    (enrollment.paymentStatus === "PAID" ||
      enrollment.status === "ACTIVE" ||
      enrollment.status === "COMPLETED");

  const isEnrollmentPaymentPending = (enrollment: any) =>
    enrollment && enrollment.status === "PENDING" && enrollment.paymentStatus !== "PAID";

  const handlePayPending = async (enrollment: any, trackId: string) => {
    if (!enrollment?._id) return;
    setPayingId(trackId);
    try {
      const res = await createCheckoutSession({ enrollmentIds: [enrollment._id] }).unwrap();
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      navigate("/checkout", { state: { enrollmentIds: [enrollment._id] } });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start payment. Opening checkout…");
      navigate("/checkout", { state: { enrollmentIds: [enrollment._id] } });
    } finally {
      setPayingId(null);
    }
  };

  if (isLoadingProg || isLoadingExtras) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Activity className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
      </div>
    );
  }

  if (!program) return <div className="text-center py-20 text-red-500 font-bold">Program not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 rounded-2xl font-bold transition-all shadow-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Programs
      </button>

      <div className="bg-white rounded-[3rem] p-4 sm:p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-blue-50/50 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div>
          {isTutorial && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-violet-50 text-violet-700 text-[10px] font-black uppercase tracking-widest border border-violet-100">
              <GraduationCap className="w-3.5 h-3.5" />
              Academic tutoring · Monthly
            </span>
          )}
          {isSelf && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              Adult self-enrollment
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-black text-blue-900 mb-6 leading-tight tracking-tighter">
            {program.title}
          </h1>
          <div className="text-gray-500 text-lg font-medium leading-relaxed mb-8">
            <RichTextContent
              html={program.description}
              fallback="Elevate your skills step by step from foundational principles to advanced topics."
            />
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-2xl border border-blue-100">
              <Star className="text-orange-500 w-5 h-5 fill-orange-500" />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age Group</p>
                <p className="text-sm font-black text-blue-900">
                  {program.ageRange?.trim() || (isSelf ? "Adults" : "Open to everyone")}
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${
                isTutorial
                  ? "bg-violet-50 border-violet-100"
                  : "bg-purple-50 border-purple-100"
              }`}
            >
              {isTutorial ? (
                <Package className="text-violet-500 w-5 h-5" />
              ) : (
                <Clock className="text-purple-500 w-5 h-5" />
              )}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {isTutorial ? "Packages" : "Phases"}
                </p>
                <p
                  className={`text-sm font-black ${
                    isTutorial ? "text-violet-900" : "text-purple-900"
                  }`}
                >
                  {isTutorial
                    ? `${packages.length} Monthly plan${packages.length === 1 ? "" : "s"}`
                    : `${phases.length} Levels`}
                </p>
              </div>
            </div>
          </div>

          {isTutorial && (
            <button
              type="button"
              onClick={() => onTutorialEnroll(program)}
              disabled={packages.length === 0}
              className="w-full sm:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-2xl font-black shadow-xl shadow-violet-200 transition-all inline-flex items-center justify-center gap-2"
            >
              Enroll for tutoring
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative group">
          <div className="w-full aspect-square rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-gray-50">
            {program.image ? (
              <img
                src={getImageUrl(program.image)}
                alt={program.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <BookOpen className="w-32 h-32 text-white/10" />
              </div>
            )}
          </div>
          <div
            className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-[2rem] flex flex-col items-center justify-center text-white shadow-2xl ${
              isTutorial ? "bg-violet-600" : "bg-blue-600"
            }`}
          >
            <span className="text-3xl font-black">{isTutorial ? packages.length : phases.length}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isTutorial ? "Packages" : "Levels"}
            </span>
          </div>
        </div>
      </div>

      {isTutorial ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/5 p-6 sm:p-10 md:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600 mb-3">
              Monthly packages
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-3">
              Choose how often your child learns
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              1:1 tutoring billed monthly. Pick a weekly frequency, subjects, and availability when you
              enroll. You can enroll another child anytime — duplicates for the same child are blocked in
              the enrollment form.
            </p>
          </div>

          {packages.length === 0 ? (
            <div className="py-16 text-center rounded-[2rem] border border-dashed border-gray-200 bg-gray-50">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">Packages coming soon</h3>
              <p className="text-gray-500 font-medium">
                Tutoring packages for this program are not published yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 items-stretch grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
              {packages.map((pkg: any) => {
                const popular = Boolean(pkg.isPopular);
                return (
                  <div
                    key={pkg._id}
                    className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col transition-all duration-300 bg-white ${
                      popular
                        ? "border-2 border-blue-400 shadow-[0_16px_40px_rgba(37,99,235,0.18)] xl:scale-[1.03] z-10"
                        : "border border-gray-200 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-lg"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.14em] shadow-lg shadow-blue-200">
                        Popular
                      </span>
                    )}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                        popular ? "bg-blue-600 text-white" : "bg-violet-50 text-violet-600"
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">{pkg.name}</h3>
                    <p className="text-xs text-gray-500 mb-5">
                      {PACKAGE_DAYS_LABELS[pkg.daysPerWeek] || `${pkg.daysPerWeek}x / week`}
                    </p>
                    <div className="mb-6">
                      <p className="text-3xl font-black text-gray-900 tracking-tight">${pkg.price}</p>
                      <p className="text-xs text-gray-400 mt-1">per month · billed monthly</p>
                    </div>
                    <ul className="space-y-2 mb-6 text-xs text-gray-500 flex-1">
                      <li className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            popular ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                        {pkg.daysPerWeek} live 1:1 session{pkg.daysPerWeek === 1 ? "" : "s"}/week
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            popular ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                        Flexible time based on availability
                      </li>
                      <li className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            popular ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                        Subject priorities included
                      </li>
                    </ul>
                    <button
                      type="button"
                      onClick={() => onTutorialEnroll(program, pkg._id)}
                      className={`mt-auto w-full py-3 rounded-xl font-bold transition-colors ${
                        popular
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-200"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                    >
                      {popular ? "Choose popular plan" : "Start enrollment"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-black text-blue-900 mb-8 flex items-center gap-4">
            Educational Path
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-100 to-transparent rounded-full" />
          </h2>
          {phases.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-black text-gray-800 mb-2">No phases yet</h3>
              <p className="text-gray-500 font-medium">Phases for this program are not published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {phases.map((phase: any) => {
                const isActive = phase.isActive !== false;
                const enrollment = isSelf ? getEnrollmentForPhase(phase._id) : null;
                return (
                  <div
                    key={phase._id}
                    className={`bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 ${
                      !isActive
                        ? "opacity-60 blur-[1px]"
                        : "hover:shadow-2xl hover:-translate-y-2"
                    }`}
                    title={
                      !isActive
                        ? "Currently this phase is closed. We will let you know when we open it."
                        : ""
                    }
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none" />

                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-100">
                        {phase.orderIndex}
                      </div>
                      {!isActive && <Lock className="text-gray-400 w-6 h-6" />}
                    </div>

                    <h3 className="text-2xl font-black text-gray-800 mb-3">{phase.title}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed flex-1 mb-8">
                      {stripHtml(phase.description) || "No description available for this phase."}
                    </p>

                    <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-sm font-bold text-gray-700 mb-8">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" /> {phase.durationWeeks} Weeks
                      </span>
                      <span className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <Tag className="w-4 h-4" /> ${phase.price}
                      </span>
                    </div>

                    {!isActive ? (
                      <div className="mt-auto w-full py-4 bg-gray-100 text-gray-400 text-center rounded-2xl shadow-inner font-black uppercase text-xs tracking-widest">
                        Currently Closed
                      </div>
                    ) : isSelf && isEnrollmentPaid(enrollment) ? (
                      <div className="mt-auto w-full py-4 bg-emerald-50 text-emerald-700 text-center rounded-2xl border border-emerald-100 font-black flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Enrolled
                      </div>
                    ) : isSelf && isEnrollmentPaymentPending(enrollment) ? (
                      <div className="mt-auto space-y-2">
                        <div className="w-full py-2.5 bg-amber-50 text-amber-700 text-center rounded-2xl border border-amber-100 text-sm font-bold">
                          Payment pending · Applied
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePayPending(enrollment, phase._id)}
                          disabled={payingId === phase._id}
                          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {payingId === phase._id ? (
                            <Activity className="w-5 h-5 animate-spin" />
                          ) : (
                            <CreditCard className="w-5 h-5" />
                          )}
                          {payingId === phase._id ? "Redirecting…" : "Pay Now"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEnroll(program, phase)}
                        className="mt-auto w-full py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl shadow-lg font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {isSelf ? "Enroll Yourself" : "Enroll Child"}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ParentCourses;
