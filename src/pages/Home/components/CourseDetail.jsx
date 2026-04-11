import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight, Activity, Clock, Tag } from "lucide-react";
import { useGetPublicProgramByIdQuery, useGetPublicProgramsQuery } from "../../../features/programs/programApi";
import { useGetPublicPhasesByProgramQuery } from "../../../features/programs/phaseApi";
import { getImageUrl } from "../../../lib/utils";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  // Scroll to top when course changes
  useEffect(() => {
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
          onClick={() => navigate("/academy/kids-programming/all_kids_course")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 font-bold"
        >
          Browse All Programs
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg shadow-lg font-semibold hover:bg-accent self-start"
            >
              Book a Free Trial Session
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
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold mb-10 text-center text-foreground">Program Phases Layout</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {phases.map((phase) => (
                <div key={phase._id} className="bg-card rounded-2xl shadow-lg border border-border p-8 flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
                  
                  <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-black text-xl mb-6 shadow-sm">
                    {phase.orderIndex}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{phase.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1 mb-6">
                    {phase.description || 'No description available for this phase.'}
                  </p>
                  
                  <div className="pt-4 border-t border-border flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500"/> {phase.durationWeeks} Weeks</span>
                    <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-green-500"/> ${phase.price}</span>
                  </div>
                </div>
              ))}
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
             <div className="text-center mt-8">
                    <motion.button
                      onClick={() =>
                        navigate("/academy/kids-programming/all_kids_course")
                      }
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-3  bg-primary text-primary-foreground rounded-lg shadow hover:bg-accent"
                    >
                      View All Courses
                    </motion.button>
                  </div>
          </div>
        )}

        {/* ---------------- YOUR KID WILL BE ---------------- */}
        <div className="max-w-4xl mx-auto text-center px-6 py-20">
          <h2 className="text-3xl font-bold mb-6">Your Kid Will Be...</h2>
          <p className="text-muted-foreground text-lg mb-12">
            Able to create games, animations, and solve real-world problems with
            code. No wasting time—EthioHope makes the journey simple, fun, and
            effective.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {["Artist", "Animator", "Game Developer", "Coder"].map(
              (role, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-card border border-border rounded-xl p-6 shadow-lg"
                >
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
                    <Star className="text-primary-foreground w-10 h-10" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{role}</h4>
                  <p className="text-sm text-muted-foreground text-center">
                    Kids will learn the skills to become a {role.toLowerCase()} and
                    express creativity through technology.
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* ---------------- BACK BUTTON ---------------- */}
        <div className="text-center py-12">
          <button
            onClick={() => navigate("/academy/kids-programming")}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg shadow hover:bg-secondary/80"
          >
            ← Back to Courses
          </button>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default CourseDetail;
