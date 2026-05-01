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

  const programs = (programsData?.data || []).filter(p => p.isActive);
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
    <section id="popular-programs" className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Our Popular Programs
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover amazing coding adventures designed just for you
          </p>
        </div>

        {/* Navigation and Cards */}
        <div className="relative">
          {/* Left Arrow */}
          {totalPages > 1 && (
            <button
              onClick={prevPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous courses"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {totalPages > 1 && (
            <button
              onClick={nextPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next courses"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-8">
            {getCurrentPageCourses().map((program) => (
              <div
                key={program._id}
                className="bg-card rounded-lg shadow-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 group h-full flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-muted/20 overflow-hidden">
                  {program.image ? (
                    <img
                      src={getImageUrl(program.image)}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                       <span className="text-white text-4xl font-black">{program.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {program.description || 'Join our expert-led program to master new skills through hands-on projects and interactive learning.'}
                  </p>
                  
                  <div className="mt-auto mb-5">
                    <span className="inline-block bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-md transform hover:-translate-y-0.5 transition-all">
                      Age: {program.ageRange || 'All ages'}
                    </span>
                  </div>

                  {/* Card Footer Removed */}
                </div>
              </div>
            ))}
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
