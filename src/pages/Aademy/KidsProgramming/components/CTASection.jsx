import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
React;
const Counter = ({ target, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration * 60); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <div className="text-4xl md:text-5xl font-extrabold text-foreground">
      {count}
      {suffix}
    </div>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Ready to Start Your Child's Coding Journey?
        </h2>
        <p className="text-lg mb-8 text-muted-foreground">
          Join thousands of kids already learning to code with us
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-lg font-semibold text-lg transition shadow-lg"
          >
            Start Free Trial
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-border text-foreground hover:bg-accent px-10 py-4 rounded-lg font-semibold text-lg transition"
          >
            Watch Demo
          </motion.button>
        </div>

        {/* Stats inside boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { target: 5000, suffix: "+", label: "Happy Kids" },
            { target: 98, suffix: "%", label: "Success Rate" },
            { target: 4.9, suffix: "/5", label: "Parent Rating" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-card shadow-md border border-border flex flex-col items-center"
            >
              <Counter target={stat.target} suffix={stat.suffix} />
              <div className="text-base md:text-lg text-muted-foreground mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
