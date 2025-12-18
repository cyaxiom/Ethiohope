import React from 'react';
import { motion } from 'framer-motion';
React;

// Helper to render each benefit card with animation
function renderBenefit({ icon, title, description, color }, animationProps) {
  return (
    <motion.div
      className={`rounded-full p-4 md:p-6 flex items-center justify-center shadow-lg border border-border ${color} dark:bg-card/70`}
      {...animationProps}
    >
      <div className="text-center">
        <div className="text-3xl md:text-4xl lg:text-5xl mb-2">{icon}</div>
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm md:text-base max-w-[160px] mx-auto text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

const WhyCodeSection = () => {
  // Programming icons for carousel
  const programmingIcons = [
    { icon: '🐍', name: 'Python', color: 'text-green-500' },
    { icon: '🧩', name: 'Scratch', color: 'text-orange-400' },
    { icon: '🌐', name: 'HTML/CSS', color: 'text-blue-500' },
    { icon: '⚡', name: 'JavaScript', color: 'text-yellow-500' },
    { icon: '🤖', name: 'Robotics', color: 'text-purple-500' },
    { icon: '🎮', name: 'Game Dev', color: 'text-pink-500' }
  ];

  const codingBenefits = [
    { icon: '🧠', title: 'Critical Thinking', description: 'Kids improve critical thinking and reasoning through coding.', color: 'bg-green-100 dark:bg-green-900/40' },
    { icon: '🎨', title: 'Creativity', description: 'Learning to code enhances imagination.', color: 'bg-purple-100 dark:bg-purple-900/40' },
    { icon: '⚙️', title: 'Logical Reasoning', description: 'Strengthen logical reasoning skills.', color: 'bg-blue-100 dark:bg-blue-900/40' },
    { icon: '🤝', title: 'Collaboration', description: 'Coding often involves teamwork.', color: 'bg-pink-100 dark:bg-pink-900/40' }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Two-Column Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Why Coding for Kids?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Give your future champions exactly what they need to succeed. Personalized learning pathways recommend coding courses depending on their abilities. Game-based programming techniques make learning smooth for anyone.
            </p>
          </div>

          {/* Programming Icons Carousel */}
          <div className="overflow-hidden space-y-4">
            {/* Top row */}
            <motion.div
              className="flex gap-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {programmingIcons.concat(programmingIcons).map((item, index) => (
                <motion.div
                  key={`top-${index}`}
                  className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md border border-border min-w-[100px]"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`text-4xl mb-2 ${item.color}`}>{item.icon}</div>
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom row */}
            <motion.div
              className="flex gap-8"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {programmingIcons.concat(programmingIcons).map((item, index) => (
                <motion.div
                  key={`bottom-${index}`}
                  className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md border border-border min-w-[100px]"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`text-4xl mb-2 ${item.color}`}>{item.icon}</div>
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Benefits Cards Section - Improved Responsive Grid */}
        <div className="relative py-8">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="inline-block">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">4 Key Benefits</div>
            </div>
          </div>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {codingBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={`rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center shadow-lg border border-border ${benefit.color} aspect-square min-h-[200px] hover:scale-105 transition-transform duration-300`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <div className="text-center space-y-3">
                  <div className="text-4xl md:text-5xl mb-2">{benefit.icon}</div>
                  <h3 className="text-base md:text-lg font-bold text-foreground">{benefit.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-snug">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCodeSection;
