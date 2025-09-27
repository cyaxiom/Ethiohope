import React from "react";
import { motion } from "framer-motion";
React;
const FeaturesSection = () => {
  const paragraph =
    "Unlock your child's coding potential! Our small, instructor-led classes ensure fast progress and personalized attention in a fun, project-based curriculum. Book your complimentary class today.";

  // Motion configs
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70, damping: 12, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  const cardMotion = {
    initial: { opacity: 0, scale: 0.9, rotate: -2 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.4 },
    whileHover: { scale: 1.05, rotate: 1 },
    whileTap: { scale: 0.97 },
  };

  return (
    <section className="py-20 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="w-full mx-auto rounded-2xl p-8 md:p-12 
                   bg-background shadow-2xl transition-colors duration-300 
                   border border-border"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
          {/* Left Side */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground">
              Ready to See Them Create?
            </h2>
            <p className="text-lg mb-8 text-muted-foreground">{paragraph}</p>

            <motion.a
              href="#booking-link"
              whileHover={{ scale: 1.07, boxShadow: "0px 8px 24px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 text-lg font-bold 
                         text-primary-foreground bg-primary rounded-full 
                         shadow-lg hover:bg-primary/90 
                         transition duration-300"
            >
              Book Your Free Class
            </motion.a>
          </motion.div>

          {/* Right Side */}
          <motion.div
            {...cardMotion}
            className="lg:w-1/2 flex justify-center"
          >
            <div
              className=""
            >
              <img
                src="/Apen.png"
                alt="Apen Project Example"
                className="w-full h-full object-cover rounded-lg shadow-inner"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/400x400/3B82F6/ffffff?text=Apen+Project";
                }}
              />

              {/* Animated overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute inset-0 bg-primary mix-blend-multiply rounded-xl pointer-events-none"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
