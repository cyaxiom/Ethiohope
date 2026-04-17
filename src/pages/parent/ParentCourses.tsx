import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPublicProgramsQuery, useGetPublicProgramByIdQuery } from "../../features/programs/programApi";
import { useGetPublicPhasesByProgramQuery } from "../../features/programs/phaseApi";
import { getImageUrl } from "../../lib/utils";
import { Activity, BookOpen, Clock, Users, ArrowRight, Search, Star, Tag, Lock, ArrowLeft } from "lucide-react";
import ParentEnrollModal from "../../components/Enrollment/ParentEnrollModal";

const ParentCourses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedPhaseForEnroll, setSelectedPhaseForEnroll] = useState<any>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Fetch all programs
  const { data: programsData, isLoading: isLoadingPrograms } = useGetPublicProgramsQuery({ limit: 100 });
  const programs = (programsData?.data || []).filter(p => p.isActive);

  // Filter programs by search
  const filteredPrograms = programs.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnrollClick = (program: any, phase: any) => {
    setSelectedPhaseForEnroll({ program, phase });
    setIsEnrollModalOpen(true);
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
          /* PROGRAMS LIST VIEW */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <header className="mb-10">
              <h1 className="text-4xl font-black text-blue-900 tracking-tight mb-3">Explore Programs 🚀</h1>
              <p className="text-gray-500 font-medium text-lg max-w-2xl leading-relaxed">
                Our Popular Programs: Discover amazing coding adventures designed for your children.
              </p>
            </header>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-blue-50/50 mb-10 flex items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search for a program (e.g. Scratch, Python, Web...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Grid Matching Homepage Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPrograms.map((program) => (
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
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {program.description || 'Join our expert-led program to master new skills through hands-on projects.'}
                    </p>
                    
                    <div className="mt-auto mb-5">
                      <span className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md">
                        Age: {program.ageRange || 'All ages'}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-blue-600 font-bold text-sm">See Details</span>
                      <span className="text-blue-600 font-bold transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPrograms.length === 0 && (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">No programs found</h3>
                <p className="text-gray-500 font-medium">Try searching with a different keyword.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* PROGRAM DETAIL VIEW VIEW */
          <ProgramDetailView 
            programId={selectedProgramId} 
            onBack={() => setSelectedProgramId(null)}
            onEnroll={handleEnrollClick}
          />
        )}
      </AnimatePresence>

      {/* Enrollment Modal */}
      {selectedPhaseForEnroll && (
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
    </div>
  );
};

/* --- Detailed view sub-component --- */

const ProgramDetailView: React.FC<{ programId: string; onBack: () => void; onEnroll: (program: any, phase: any) => void }> = ({ programId, onBack, onEnroll }) => {
  const { data: programRes, isLoading: isLoadingProg } = useGetPublicProgramByIdQuery(programId);
  const { data: phasesRes, isLoading: isLoadingPhases } = useGetPublicPhasesByProgramQuery(programId);

  const program = programRes?.data;
  const phases = (phasesRes?.data || []).filter((p: any) => p.isActive !== false);

  if (isLoadingProg || isLoadingPhases) {
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

      {/* Hero-like Section */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-blue-50/50 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-black text-blue-900 mb-6 leading-tight tracking-tighter">
            {program.title}
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed mb-8">
            {program.description || 'Elevate your child\'s skills correctly step by step from the foundational principles up to advanced topics.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-2xl border border-blue-100">
              <Star className="text-orange-500 w-5 h-5 fill-orange-500" />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age Group</p>
                <p className="text-sm font-black text-blue-900">{program.ageRange || 'All Ages'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-purple-50 rounded-2xl border border-purple-100">
              <Clock className="text-purple-500 w-5 h-5" />
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phases</p>
                <p className="text-sm font-black text-purple-900">{phases.length} Levels</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="w-full aspect-square rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-gray-50">
            {program.image ? (
              <img src={getImageUrl(program.image)} alt={program.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                 <BookOpen className="w-32 h-32 text-white/10" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-[2rem] flex flex-col items-center justify-center text-white shadow-2xl animate-bounce-slow">
             <span className="text-3xl font-black">{phases.length}</span>
             <span className="text-[10px] font-black uppercase tracking-widest">Levels</span>
          </div>
        </div>
      </div>

      {/* Phases Section */}
      <div>
        <h2 className="text-3xl font-black text-blue-900 mb-8 flex items-center gap-4">
           Educational Path
           <div className="h-1 flex-1 bg-gradient-to-r from-blue-100 to-transparent rounded-full" />
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {phases.map((phase: any) => (
            <div 
              key={phase._id} 
              className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-100">
                  {phase.orderIndex}
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-800 mb-3">{phase.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed flex-1 mb-8">
                {phase.description || 'No description available for this phase.'}
              </p>
              
              <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-sm font-bold text-gray-700 mb-8">
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> {phase.durationWeeks} Weeks</span>
                <span className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full"><Tag className="w-4 h-4"/> ${phase.price}</span>
              </div>

              <button 
                onClick={() => onEnroll(program, phase)}
                className="mt-auto w-full py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl shadow-lg font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Enroll Child
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ParentCourses;
