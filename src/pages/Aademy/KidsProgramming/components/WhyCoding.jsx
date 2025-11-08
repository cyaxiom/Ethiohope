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
        <h3 className="text-lg md:text-xl font-bold text-black dark:text-black mb-1">{title}</h3>
        <p className="text-sm md:text-base max-w-[160px] mx-auto text-muted-foreground dark:text-gray-700">{description}</p>
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

        {/* Benefits Cards Section */}
        <div className="relative flex items-center justify-center min-h-[500px] md:min-h-[600px] mx-auto overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative">
              <div className="w-[220px] md:w-[300px] lg:w-[350px] h-[220px] md:h-[300px] lg:h-[350px] rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 p-[3px] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">4 Key</div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 text-transparent bg-clip-text">Benefits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[5%] right-[10%] md:right-[15%] z-20">
            {renderBenefit(codingBenefits[0], { animate: { x: ["0%", "8%", "-10%", "5%", "0%"], y: ["0%", "-12%", "6%", "-10%", "0%"] }, transition: { duration: 15, ease: "easeInOut", repeat: Infinity } })}
          </div>
          <div className="absolute bottom-[10%] right-[5%] md:right-[10%] z-20">
            {renderBenefit(codingBenefits[1], { animate: { x: ["0%", "10%", "-5%", "8%", "0%"], y: ["0%", "8%", "-12%", "-5%", "0%"] }, transition: { duration: 18, ease: "easeInOut", repeat: Infinity, delay: 1.5 } })}
          </div>
          <div className="absolute bottom-[10%] left-[5%] md:left-[10%] z-20">
            {renderBenefit(codingBenefits[2], { animate: { x: ["0%", "-10%", "8%", "-5%", "0%"], y: ["0%", "12%", "-6%", "10%", "0%"] }, transition: { duration: 16, ease: "easeInOut", repeat: Infinity, delay: 0.8 } })}
          </div>
          <div className="absolute top-[5%] left-[10%] md:left-[15%] z-20">
            {renderBenefit(codingBenefits[3], { animate: { x: ["0%", "-8%", "10%", "-5%", "0%"], y: ["0%", "10%", "-8%", "5%", "0%"] }, transition: { duration: 17, ease: "easeInOut", repeat: Infinity, delay: 2 } })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCodeSection;
