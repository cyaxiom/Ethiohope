import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { kidsCoursesData } from "../../../../data/kidsCoursesData";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  // Scroll to top when course changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const course = kidsCoursesData.find((c) => String(c.id) === id);

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Pagination logic for related courses
  const coursesPerPage = 2;
  const startIndex = page * coursesPerPage;
  const paginatedCourses = kidsCoursesData.slice(
    startIndex,
    startIndex + coursesPerPage
  );
  const totalPages = Math.ceil(kidsCoursesData.length / coursesPerPage);

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
              {course.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {course.modules[0]?.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg font-semibold hover:bg-green-700"
            >
              Book a Free Class
            </motion.button>
          </div>

          {/* Right Image */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="flex justify-center"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-green-400 shadow-xl">
              <img
                src={course.modules[0]?.image}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* ---------------- STATS SECTION ---------------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 py-12 text-center">
          <div>
            <Star className="mx-auto text-green-500 mb-2" />
            <p className="font-semibold">Age</p>
            <p className="text-muted-foreground">
              {course.modules[0]?.ageGroup}
            </p>
          </div>
          <div>
            <Star className="mx-auto text-green-500 mb-2" />
            <p className="font-semibold">Duration</p>
            <p className="text-muted-foreground">
              {course.modules[0]?.duration || "Varies"}
            </p>
          </div>
          <div>
            <Star className="mx-auto text-green-500 mb-2" />
            <p className="font-semibold">Language</p>
            <p className="text-muted-foreground">English & Amharic</p>
          </div>
          <div>
            <Star className="mx-auto text-green-500 mb-2" />
            <p className="font-semibold">Level</p>
            <p className="text-muted-foreground">Beginner Friendly</p>
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

        {/* ---------------- RELATED COURSES ---------------- */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-green-600">
              Related Courses
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="p-2 rounded-full bg-green-100 hover:bg-green-200 disabled:opacity-40"
              >
                <ArrowLeft className="text-green-600" />
              </button>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={page === totalPages - 1}
                className="p-2 rounded-full bg-green-100 hover:bg-green-200 disabled:opacity-40"
              >
                <ArrowRight className="text-green-600" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {paginatedCourses.map((related) => (
              <motion.div
                key={related.id}
                whileHover={{ scale: 1.03 }}
                className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
              >
                <img
                  src={related.modules[0]?.image}
                  alt={related.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    {related.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {related.modules[0]?.description?.slice(0, 100)}...
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/academy/kids-programming/course/${related.id}`)
                    }
                    className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
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
                      className="px-10 py-3  bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                    >
                      View All Courses
                    </motion.button>
                  </div>
        </div>

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
                  <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-4">
                    <Star className="text-white w-10 h-10" />
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
