import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
React;
const articles = [
  {
    id: "article-001",
    content:
      "I find EthioHope one of the best online schooling platforms for code because of their reasonable timings (1 hour per lesson) and caring teachers. They teach kids all kinds of things in code from simple beginner to advanced professional. The classes run smoothly with very few technical problems, and many kids find it engaging.",
    writer: "Maya T.",
    image: "/heroimgKids.png",
  },
  {
    id: "article-002",
    content:
      "EthioHope offers great value with its teaching techniques. The lessons are structured well and the apps and websites they use make the classes more interactive. Kids enjoy learning and look forward to their sessions every week.",
    writer: "Daniel K.",
    image: "/images/articles/ethiohope2.png",
  },
  {
    id: "article-003",
    content:
      "What I appreciate most about EthioHope is how well the teachers communicate with children. They explain complex coding concepts in a simple way that keeps kids motivated and interested in building projects.",
    writer: "Sophia L.",
    image: "/heroimgKids.png",
  },
  {
    id: "article-004",
    content:
      "The platform has very good quality meeting connections, so classes run without interruptions. The supportive teachers and project-based approach make it easy for children to grow from basic coding to advanced topics.",
    writer: "Ethan M.",
    image: "/heroimgKids.png",
  },
  {
    id: "article-005",
    content:
      "EthioHope stands out because kids genuinely find it engaging. The lessons are fun, the pace is reasonable, and the instructors care about every student's progress. It's a reliable platform for young learners.",
    writer: "Aisha R.",
    image: "/images/articles/ethiohope5.png",
  },
];

const FromTheCrowd = () => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center relative">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          From the Crowd....
        </h2>

        {/* Decorative Quotation Mark */}
        <div className="flex justify-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-20 h-20 text-green-500 opacity-20"
          >
            <path d="M7.17 6C4.94 6 3 7.94 3 10.17c0 2.11 1.69 3.83 3.78 3.83.06 0 .11 0 .17-.01C6.39 15.65 4.52 18.33 2 20l1.41 1.41C6.34 18.48 9 14.54 9 10.17 9 7.94 8.06 6 7.17 6zm9.66 0c-2.23 0-4.17 1.94-4.17 4.17 0 2.11 1.69 3.83 3.78 3.83.06 0 .11 0 .17-.01C16.05 15.65 14.18 18.33 11.66 20l1.41 1.41C17.83 18.48 20.5 14.54 20.5 10.17c0-2.23-.94-4.17-3.67-4.17z" />
          </svg>
        </div>

        {/* Content + Arrows */}
        <div className="flex items-center justify-center gap-6">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-card shadow hover:bg-accent transition"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Review Content */}
          <div className="relative w-full max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={articles[index].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Review Text */}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  “{articles[index].content}”
                </p>

                {/* Image */}
                <img
                  src={articles[index].image}
                  alt={articles[index].writer}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />

                {/* Writer */}
                <span className="font-semibold text-foreground">
                  — {articles[index].writer}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-card shadow hover:bg-accent transition"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FromTheCrowd;
