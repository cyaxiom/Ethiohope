import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { kidsCoursesData } from "../../../../data/kidsCoursesData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CoursesSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 4;
  const totalPages = Math.ceil(kidsCoursesData.length / coursesPerPage);
  const navigate = useNavigate();

  const getCurrentPageCourses = () => {
    const startIndex = currentPage * coursesPerPage;
    return kidsCoursesData.slice(startIndex, startIndex + coursesPerPage);
  };

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Our Popular Courses
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover amazing coding adventures designed just for kids
          </p>
        </div>

        {/* Navigation and Cards */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous courses"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next courses"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-8">
            {getCurrentPageCourses().map((course) => {
              const moduleData = course.modules[0] || {};
              const { description, ageGroup, image } = moduleData;

              return (
                <div
                  key={course.id}
                  onClick={() =>
                    navigate(`/academy/kids-programming/course/${course.id}`)
                  }
                  className="bg-card rounded-lg shadow-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  {/* Course Image */}
                  <div className="relative h-48 bg-muted/20 overflow-hidden">
                    <img
                      src={image}
                      alt={course.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.style.background =
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                        e.target.parentElement.innerHTML += `<div class="flex items-center justify-center h-full text-6xl text-white">${course.icon}</div>`;
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2">
                      {course.name}
                    </h3>

                    <div className="mb-3">
                      <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {ageGroup}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Page Indicators */}
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

        {/* Page Counter */}
        <div className="text-center mt-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>

        {/* Animated View All Courses Button */}
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
            className="px-10 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-lg transition-all duration-300"
          >
            View All Courses
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
