import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetPublicProgramsQuery } from "../../../features/programs/programApi";
import { getImageUrl } from "../../../lib/utils";
import { Activity } from "lucide-react";

const AllCourses = () => {
  const navigate = useNavigate();
  const { data: programsData, isLoading } = useGetPublicProgramsQuery({ limit: 100 });
  const programs = (programsData?.data || []).filter(p => p.isActive);

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4 } },
  };

  const cardVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.2, duration: 0.8 },
    },
  };

  return (
    <motion.section
      className="bg-background min-h-screen py-16 px-6 md:px-12"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      {/* HERO SECTION */}
      <motion.div 
        className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-center gap-12 mt-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Coding Courses <span className="text-primary">For Kids</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-6">
            Ethiohope is an online coding platform that helps your kids learn
            coding in the most engaging way and improves their creativity.
            Explore courses based on age, skill level, and interest.
          </p>
          <button className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-300">
            Book Your Free Trial
          </button>
        </div>

        {/* Right Image */}
        <div>
          <motion.img
            src="/heroimgKids.png"
            alt="Kids Coding Hero"
            className="w-full max-w-md"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>
      </motion.div>

      {/* COURSES GRID */}
      <div className="flex flex-col gap-12">
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground text-xl">Loading programs...</div>
        ) : programs && programs.length > 0 ? (
          programs.map((program, i) => (
            <motion.div
              key={program._id}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className={`flex flex-col md:flex-row items-center bg-card rounded-xl shadow-lg border border-border overflow-hidden
              w-full md:w-2/3 ${i % 2 === 0 ? "md:ml-0" : "md:ml-auto"}`}
            >
              {/* LEFT IMAGE + TITLE + AGE + DURATION */}
              <div className="md:w-1/2 flex flex-col bg-card w-full h-full">
                <div className="h-60 w-full overflow-hidden">
                  {program.image ? (
                    <img
                      src={getImageUrl(program.image)}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                       <span className="text-white text-6xl font-black">{program.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-primary text-xl font-bold line-clamp-1">
                    {program.title}
                  </h3>
                  <span className="text-muted-foreground">
                    Age Group: {program.ageRange || 'All ages'}
                  </span>
                </div>
                <button
                  onClick={() =>
                    navigate(`/academy/kids-programming/course/${program._id}`)
                  }
                  className="mt-auto mb-4 mx-auto w-[80%] bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium shadow transition-all duration-300"
                >
                  View Details
                </button>
              </div>

              {/* RIGHT DESCRIPTION + STATS + BUTTONS */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between h-full">
                <p className="text-muted-foreground mb-4 line-clamp-6">
                  {program.description || 'Gain valuable skills through hands-on lessons tailored to your age and level.'}
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-auto">
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300">
                    Enroll Now
                  </button>
                  <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300">
                    Book Free Class
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-muted-foreground text-xl">No programs found at the moment.</div>
        )}
      </div>

      {/* BACK BUTTON */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <button
          onClick={() => navigate("/academy/kids-programming")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
        >
          ← Back
        </button>
      </div>
    </motion.section>
  );
};

export default AllCourses;
