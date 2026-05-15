import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight, Activity, Clock, Tag, Lock, X } from "lucide-react";
import { useGetPublicProgramByIdQuery, useGetPublicProgramsQuery } from "../../../features/programs/programApi";
import { useGetPublicPhasesByProgramQuery } from "../../../features/programs/phaseApi";
import { getImageUrl } from "../../../lib/utils";

import { useDispatch, useSelector } from "react-redux";
import { useLazyGetRegisterChildInitQuery, useCompleteProfileMutation } from "../../../features/user/userApi";
import { updateUser, logout } from "../../../features/auth/authSlice";
import { toast } from "sonner";
import EnrollChildModal from "../../../components/Enrollment/EnrollChildModal";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const dispatch = useDispatch();
  
  const [checkProfileInit, { isFetching: isCheckingProfile }] = useLazyGetRegisterChildInitQuery();
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
  const [selectedPhaseForEnrollment, setSelectedPhaseForEnrollment] = useState(null);

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
    try {
      const response = await checkProfileInit().unwrap();
      if (!response.profileCompleted) {
        setSelectedPhaseForEnrollment(phase);
        setIsProfileModalOpen(true);
      } else {
        setSelectedPhaseForEnrollment(phase);
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

  const { data: programData, isLoading: isLoadingProgram, error } = useGetPublicProgramByIdQuery(id);
  const { data: phasesData, isLoading: isLoadingPhases } = useGetPublicPhasesByProgramQuery(id);
  const { data: allProgramsData } = useGetPublicProgramsQuery({ limit: 10 });
  
  const program = programData?.data;
  const phases = phasesData?.data || [];
  
  // Exclude current program from related
  const relatedPrograms = (allProgramsData?.data || []).filter(p => p._id !== id && p.isActive);

  if (isLoadingProgram || isLoadingPhases) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Activity className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-medium text-muted-foreground">Loading Program Details...</h2>
      </div>
    );
  }

  if (!program || error) {
    return (
      <div className="text-center py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Program Not Found</h2>
        <p className="text-muted-foreground mb-8 text-lg">The program you are looking for does not exist or was disabled.</p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white rounded-full font-bold hover:scale-105 transition-all shadow-xl"
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

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={id} // re-trigger animation when id changes
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6 }}
        className="bg-background"
      >
        {/* ---------------- HERO SECTION ---------------- */}
        <div className="relative py-28 px-6 lg:px-20 grid lg:grid-cols-2 items-center gap-10">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-500">
              {program.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {program.description || 'Elevate your skills correctly step by step from the foundational principles up to advanced topics.'}
            </p>
            <motion.button
              onClick={handleRegisterClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg shadow-lg font-semibold hover:bg-accent self-start flex items-center gap-2"
            >
              Enroll Your Child
            </motion.button>
          </div>

          {/* Right Image */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex justify-center"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-primary shadow-xl bg-muted flex items-center justify-center">
              {program.image ? (
                <img
                  src={getImageUrl(program.image)}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary/50 text-8xl font-black">{program.title.charAt(0)}</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* ---------------- STATS SECTION ---------------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 py-12 text-center border-y border-border/50 bg-card rounded-2xl shadow-sm my-10">
          <div className="flex flex-col items-center p-4">
            <Star className="text-orange-500 w-8 h-8 mb-3" />
            <p className="font-bold text-lg text-foreground">Age Group</p>
            <p className="text-muted-foreground font-medium">
              {program.ageRange || 'All Ages'}
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Clock className="text-blue-500 w-8 h-8 mb-3" />
            <p className="font-bold text-lg text-foreground">Duration</p>
            <p className="text-muted-foreground font-medium">
              {phases.length > 0 ? `${phases.reduce((acc, p) => acc + (p.durationWeeks || 0), 0)} Weeks Total` : 'Self-paced'}
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Tag className="text-green-500 w-8 h-8 mb-3" />
            <p className="font-bold text-lg text-foreground">Phases</p>
            <p className="text-muted-foreground font-medium">{phases.length} Phases Available</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Star className="text-purple-500 w-8 h-8 mb-3" />
            <p className="font-bold text-lg text-foreground">Level</p>
            <p className="text-muted-foreground font-medium">Beginner Friendly</p>
          </div>
        </div>

        {/* ---------------- ABOUT SECTION ---------------- */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-6">About This Course</h2>
          <p className="text-muted-foreground leading-relaxed">
            This course is designed to introduce kids to the exciting world of
            programming through fun, engaging, and interactive activities. From
            creating games and animations to solving real-world problems with
            code, your child will develop logical thinking, creativity, and
            confidence. At EthioHope, we make sure the learning journey is smooth
            and rewarding, ensuring kids enjoy every step while mastering
            essential 21st-century skills.
          </p>
        </div>

        {/* ---------------- PHASES SECTION ---------------- */}
        {phases.length > 0 && (
          <div id="program-phases" ref={phasesRef} className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20">
            <h2 className="text-3xl font-bold mb-10 text-center text-foreground">Program Phases Layout</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {phases.map((phase) => {
                const isActive = phase.isActive !== false;

                return (
                  <div 
                    key={phase._id} 
                    className={`bg-card rounded-2xl shadow-lg border border-border p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 ${!isActive ? 'opacity-60 blur-[1px]' : 'hover:-translate-y-2 hover:shadow-xl'}`}
                    title={!isActive ? 'Currently this phase is closed. We will let you know when we open it.' : ''}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
                        {phase.orderIndex}
                      </div>
                      {!isActive && <Lock className="text-muted-foreground w-6 h-6" />}
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">{phase.title}</h3>
                    <p className="text-muted-foreground text-sm flex-1 mb-6">
                      {phase.description || 'No description available for this phase.'}
                    </p>
                    
                    <div className="pt-4 border-t border-border flex justify-between items-center text-sm font-semibold text-gray-700 mb-6">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500"/> {phase.durationWeeks} Weeks</span>
                      <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-green-500"/> ${phase.price}</span>
                    </div>

                    {isActive ? (
                      <button 
                        onClick={() => handleEnrollClick(phase)}
                        className="mt-auto w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md font-bold transition-colors"
                      >
                        Enroll Your Child
                      </button>
                    ) : (
                      <div className="mt-auto w-full py-3 bg-muted text-muted-foreground text-center rounded-lg shadow-inner font-medium">
                        Currently Closed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- RELATED COURSES ---------------- */}
        {relatedPrograms.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 py-16 bg-muted/30 rounded-3xl mb-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-primary">
                Other Programs You Might Like
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 disabled:opacity-40"
                >
                  <ArrowLeft className="text-primary" />
                </button>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={page === totalPages - 1}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 disabled:opacity-40"
                >
                  <ArrowRight className="text-primary" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {paginatedCourses.map((related) => (
                <motion.div
                  key={related._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col"
                >
                  {related.image ? (
                    <img
                      src={getImageUrl(related.image)}
                      alt={related.title}
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <div className="h-56 w-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-6xl font-black">{related.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-primary mb-2 line-clamp-1">
                      {related.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                      {related.description || 'Gain valuable skills through hands-on lessons.'}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/academy/kids-programming/course/${related._id}`)
                      }
                      className="px-5 py-2 mt-auto w-full bg-green-600 text-white rounded-lg shadow hover:bg-green-700 font-bold"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
             {/* View All Courses button removed as requested */}
          </div>
        )}

        {/* ---------------- BACK BUTTON ---------------- */}
        <div className="text-center py-12">
          <button
            onClick={() => {
              navigate("/");
              // Small delay to ensure the home page is mounted before scrolling
              setTimeout(() => {
                document.getElementById('popular-programs')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white rounded-full font-bold hover:scale-105 transition-all shadow-xl"
          >
            ← Back to Courses
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

        {/* Bottom Spacing */}
        <div className="h-20"></div>

        {/* Enrollment Modal */}
        {selectedPhaseForEnrollment && (
          <EnrollChildModal 
            isOpen={isEnrollModalOpen}
            onClose={() => {
              setIsEnrollModalOpen(false);
              setSelectedPhaseForEnrollment(null);
            }}
            program={program}
            phase={selectedPhaseForEnrollment}
          />
        )}
      </motion.section>
    </AnimatePresence>
  );
};

export default CourseDetail;
