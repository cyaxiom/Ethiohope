import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
React;

const projects = [
  {
    name: 'Abel T.',
    age: 12,
    standard: 'Grade 6',
    videoUrl: '', // Placeholder
    description: 'Created a fun math quiz game using React.'
  },
  {
    name: 'Mimi K.',
    age: 11,
    standard: 'Grade 5',
    videoUrl: '',
    description: 'Built a weather app that shows live forecasts.'
  },
  {
    name: 'Yonas D.',
    age: 13,
    standard: 'Grade 7',
    videoUrl: '',
    description: 'Developed a memory card game with animations.'
  },
  {
    name: 'Sara M.',
    age: 10,
    standard: 'Grade 4',
    videoUrl: '',
    description: 'Designed a drawing app for kids.'
  },
  {
    name: 'Liya F.',
    age: 12,
    standard: 'Grade 6',
    videoUrl: '',
    description: 'Created a chatbot for homework help.'
  },
  {
    name: 'Robel S.',
    age: 13,
    standard: 'Grade 7',
    videoUrl: '',
    description: 'Built a simple e-commerce site for toys.'
  },
  {
    name: 'Hanna G.',
    age: 11,
    standard: 'Grade 5',
    videoUrl: '',
    description: 'Made a music player web app.'
  },
  {
    name: 'Samuel B.',
    age: 12,
    standard: 'Grade 6',
    videoUrl: '',
    description: 'Developed a quiz app for science facts.'
  }
];


function ProjectsShowcaseSection() {
  const [page, setPage] = useState(0);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const handlePrev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  const handleNext = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

  // Theme classes
  const sectionBg = "bg-background dark:bg-muted/40";
  const cardBg = "bg-card dark:bg-card/80";
  const cardText = "text-card-foreground dark:text-card-foreground";
  const border = "border border-border dark:border-border";

  const paginate = (newPage) => {
    setPage(newPage);
  };

  const startIdx = page * projectsPerPage;
  const currentProjects = projects.slice(startIdx, startIdx + projectsPerPage);

  return (
    <section className={`w-full py-12 ${sectionBg}`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 text-primary dark:text-primary">Projects By EthioHope Super Stars</h2>
        <p className="text-center text-lg mb-8 text-muted-foreground dark:text-muted-foreground">
          Take a look at the projects that our brilliant minds have created by applying new technologies
        </p>
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => paginate(page === 0 ? totalPages - 1 : page - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Previous projects"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => paginate(page === totalPages - 1 ? 0 : page + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Next projects"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-8">
            {currentProjects.map((project) => (
              <motion.div
                key={project.name}
                whileHover={{ scale: 1.05 }}
                className={`${cardBg} ${cardText} ${border} rounded-lg shadow p-4 flex flex-col items-center`}
              >
                <div className="w-full h-40 bg-muted dark:bg-muted/40 rounded mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src="/str_vid.png"
                    alt="Project video placeholder"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-primary dark:text-primary mb-1">{project.name}</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-1">Age: {project.age} | {project.standard}</p>
                <p className="text-center text-card-foreground dark:text-card-foreground">{project.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => paginate(idx)}
              className={`w-3 h-3 rounded-full transition ${idx === page ? 'bg-primary' : 'bg-muted dark:bg-muted/40'}`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsShowcaseSection;
