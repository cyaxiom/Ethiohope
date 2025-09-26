import React from 'react';
import { motion } from 'framer-motion';
React;
// Helper to render each benefit card with animation
function renderBenefit({ icon, title, description, color }, animationProps) {
  return (
    <motion.div
      className="bg-card rounded-full p-4 md:p-6 w-48 h-48 md:w-56 md:h-56 flex items-center justify-center shadow-lg border border-border"
      {...animationProps} // Apply complex animation properties here
    >
      <div className="text-center">
        <div className={`w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 rounded-full ${color} flex items-center justify-center text-2xl md:text-3xl`}>
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">{title}</h3>
        <p className="text-muted-foreground text-xs md:text-sm max-w-[140px] md:max-w-[160px] mx-auto">
          {description}
        </p>
      </div>
    </motion.div>
  );
}


const WhyCodeSection = () => {
  // Icons representing different programming languages/tools
  const programmingIcons = [
    { icon: '🐍', name: 'Python', color: 'text-green-500' },
    { icon: '🧩', name: 'Scratch', color: 'text-orange-500' },
    { icon: '🌐', name: 'HTML/CSS', color: 'text-blue-500' },
    { icon: '⚡', name: 'JavaScript', color: 'text-yellow-500' },
    { icon: '🤖', name: 'Robotics', color: 'text-purple-500' },
    { icon: '🎮', name: 'Game Dev', color: 'text-pink-500' }
  ];

  // Benefits of coding for kids
  const codingBenefits = [
    {
      icon: '🧠',
      title: 'Critical Thinking',
      description: 'Kids improve critical thinking and reasoning through the code generation process.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      icon: '🎨',
      title: 'Creativity',
      description: "Learning to code enhances brain function by increasing creativity and imagination.",
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      icon: '⚙️',
      title: 'Logical Reasoning',
      description: 'Strengthen logical reasoning skills by creating structured algorithms and solving problems.',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'Coding often involves teamwork to build and deploy programs and applications.',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    }
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Original Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Why Coding for Kids?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Give your future champions exactly what they need to succeed in a language they understand.
              Cyber Square offers personalised learning pathways where we recommend coding courses to kids
              depending on their abilities. Game-based programming techniques make learning smoother for anyone,
              regardless of age or coding experience.
            </p>
          </div>

          {/* Right Side - Programming Icons */}
          <div className="flex justify-center lg:justify-end">
            <div className="grid grid-cols-3 gap-8 max-w-md">
              {programmingIcons.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center p-4 bg-card rounded-lg shadow-md border border-border"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`text-4xl mb-2 ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-card-foreground">
                    {item.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Cards Section - Now with orbital movement */}
        <div className="relative flex items-center justify-center min-h-[600px] md:min-h-[700px] mx-auto overflow-hidden">
          {/* Central circle */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative">
              <div className="w-[280px] md:w-[350px] lg:w-[400px] h-[280px] md:h-[350px] lg:h-[400px] rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 p-[3px] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-transparent bg-clip-text">4 Key</div>
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-transparent bg-clip-text">Benefits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Thinking - Top Right */}
          <div className="absolute top-[5%] right-[10%] md:right-[15%] z-20">
            {renderBenefit(codingBenefits[0], {
              animate: {
                x: ["0%", "8%", "-10%", "5%", "0%"],
                y: ["0%", "-12%", "6%", "-10%", "0%"],
              },
              transition: { duration: 15, ease: "easeInOut", repeat: Infinity },
            })}
          </div>

          {/* Creativity - Bottom Right */}
          <div className="absolute bottom-[10%] right-[5%] md:right-[10%] z-20">
            {renderBenefit(codingBenefits[1], {
              animate: {
                x: ["0%", "10%", "-5%", "8%", "0%"],
                y: ["0%", "8%", "-12%", "-5%", "0%"],
              },
              transition: { duration: 18, ease: "easeInOut", repeat: Infinity, delay: 1.5 },
            })}
          </div>

          {/* Logical Reasoning - Bottom Left */}
          <div className="absolute bottom-[10%] left-[5%] md:left-[10%] z-20">
            {renderBenefit(codingBenefits[2], {
               animate: {
                x: ["0%", "-10%", "8%", "-5%", "0%"],
                y: ["0%", "12%", "-6%", "10%", "0%"],
              },
              transition: { duration: 16, ease: "easeInOut", repeat: Infinity, delay: 0.8 },
            })}
          </div>

          {/* Collaboration - Top Left */}
          <div className="absolute top-[5%] left-[10%] md:left-[15%] z-20">
            {renderBenefit(codingBenefits[3], {
              animate: {
                x: ["0%", "-8%", "10%", "-5%", "0%"],
                y: ["0%", "10%", "-8%", "5%", "0%"],
              },
              transition: { duration: 17, ease: "easeInOut", repeat: Infinity, delay: 2 },
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCodeSection;

