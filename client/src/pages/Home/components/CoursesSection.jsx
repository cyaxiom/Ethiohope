import { ChevronLeft, ChevronRight, Activity } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetPublicProgramsQuery } from "../../../features/programs/programApi";
import { getImageUrl } from "../../../lib/utils";

const CoursesSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 4;
  const navigate = useNavigate();

  // Fetch active programs publicly
  const { data: programsData, isLoading } = useGetPublicProgramsQuery({ 
    page: 1, 
    limit: 20 // Fetch enough to paginate on home
  });

  const programs = programsData?.data || [];
  const totalPages = Math.ceil(programs.length / coursesPerPage);

  const getCurrentPageCourses = () => {
    const startIndex = currentPage * coursesPerPage;
    return programs.slice(startIndex, startIndex + coursesPerPage);
  };

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Activity className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading our programs...</p>
      </div>
    );
  }

  if (programs.length === 0) {
    return null; // Or show a placeholder
  }

  return (
    <section id="popular-programs" className="py-16 px-4 bg-[#070b16]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Our Popular Programs
          </h2>
          <p className="text-lg text-slate-400">
            Discover amazing coding adventures designed just for you
          </p>
        </div>

        {/* Navigation and Cards */}
        <div className="relative">
          {/* Left Arrow */}
          {totalPages > 1 && (
            <button
              onClick={prevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous courses"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {totalPages > 1 && (
            <button
              onClick={nextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next courses"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-8">
            {getCurrentPageCourses().map((program) => {
              const isActive = program.isActive !== false;
              
              return (
                <div
                  key={program._id}
                  onClick={() => {
                    if (isActive) {
                      navigate(`/academy/kids-programming/course/${program._id}#program-phases`);
                    }
                  }}
                  className={`bg-[#0b1224] rounded-2xl shadow-lg border border-white/10 overflow-hidden transition-all duration-300 group h-full flex flex-col relative ${isActive ? 'hover:shadow-xl hover:border-blue-400/30 hover:scale-[1.02] cursor-pointer' : 'cursor-default'}`}
                >
                  {/* Coming Soon Overlay */}
                  {!isActive && (
                    <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-[#0b1224]/95 px-6 py-2 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-blue-400/30">
                        <span className="text-blue-200 font-black tracking-[0.2em] text-[10px] uppercase">Coming Soon</span>
                      </div>
                    </div>
                  )}

                  {/* Image Section */}
                  <div className={`relative h-48 bg-white/5 overflow-hidden ${!isActive ? 'grayscale-[0.5]' : ''}`}>
                    {program.image ? (
                      <img
                        src={getImageUrl(program.image)}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                         <span className="text-white text-4xl font-black">{program.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className={`p-6 flex-1 flex flex-col ${!isActive ? 'opacity-70' : ''}`}>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {program.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                      {program.description || 'Join our expert-led program to master new skills through hands-on projects and interactive learning.'}
                    </p>
                    
                    <div className="mt-auto mb-5">
                      {program.ageRange?.trim() ? (
                        <span className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md transform hover:-translate-y-0.5 transition-all">
                          Age: {program.ageRange}
                        </span>
                      ) : null}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between group-hover:text-blue-400 transition-colors">
                      <span className="text-blue-400 font-bold text-sm">
                        {isActive ? 'See Details' : 'Coming Soon'}
                      </span>
                      {isActive && <span className="text-primary font-bold transition-transform group-hover:translate-x-1">→</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Page Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentPage === index
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Bottom button removed as it's redundant when scrolling to this section */}
      </div>
    </section>
  );
};

export default CoursesSection;
