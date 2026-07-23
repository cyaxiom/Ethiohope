import React from 'react';
import { motion } from 'framer-motion';

const WhyCodeSection = () => {
  const programmingIcons = [
    { icon: '🐍', name: 'Python', accent: 'text-emerald-400' },
    { icon: '🧩', name: 'Scratch', accent: 'text-orange-400' },
    { icon: '🌐', name: 'HTML/CSS', accent: 'text-sky-400' },
    { icon: '⚡', name: 'JavaScript', accent: 'text-amber-300' },
    { icon: '🤖', name: 'Robotics', accent: 'text-violet-400' },
    { icon: '🎮', name: 'Game Dev', accent: 'text-pink-400' },
  ];

  const codingBenefits = [
    {
      icon: '🧠',
      title: 'Critical Thinking',
      description: 'Kids improve critical thinking and reasoning through coding.',
      glow: 'from-emerald-500/20 to-transparent',
      ring: 'hover:border-emerald-400/40',
    },
    {
      icon: '🎨',
      title: 'Creativity',
      description: 'Learning to code enhances imagination.',
      glow: 'from-violet-500/20 to-transparent',
      ring: 'hover:border-violet-400/40',
    },
    {
      icon: '⚙️',
      title: 'Logical Reasoning',
      description: 'Strengthen logical reasoning skills.',
      glow: 'from-sky-500/20 to-transparent',
      ring: 'hover:border-sky-400/40',
    },
    {
      icon: '🤝',
      title: 'Collaboration',
      description: 'Coding often involves teamwork.',
      glow: 'from-pink-500/20 to-transparent',
      ring: 'hover:border-pink-400/40',
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#070b16]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Why Coding for Kids?</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Give your future champions exactly what they need to succeed. Personalized learning pathways
              recommend coding courses depending on their abilities. Game-based programming techniques make
              learning smooth for anyone.
            </p>
          </div>

          <div className="overflow-hidden space-y-4">
            <motion.div
              className="flex gap-8"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            >
              {programmingIcons.concat(programmingIcons).map((item, index) => (
                <motion.div
                  key={`top-${index}`}
                  className="flex flex-col items-center p-4 bg-[#0b1224] rounded-xl shadow-md border border-white/10 min-w-[100px]"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`text-4xl mb-2 ${item.accent}`}>{item.icon}</div>
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex gap-8"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            >
              {programmingIcons.concat(programmingIcons).map((item, index) => (
                <motion.div
                  key={`bottom-${index}`}
                  className="flex flex-col items-center p-4 bg-[#0b1224] rounded-xl shadow-md border border-white/10 min-w-[100px]"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className={`text-4xl mb-2 ${item.accent}`}>{item.icon}</div>
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="relative py-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300 mb-3">
              Why it matters
            </p>
            <h3 className="text-3xl md:text-4xl font-black text-white">
              <span className="text-emerald-400">4</span> Key Benefits
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
            {codingBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className={`relative overflow-hidden rounded-3xl p-6 md:p-7 flex flex-col items-center justify-center min-h-[200px] bg-[#0b1224] border border-white/10 ${benefit.ring} transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${benefit.glow} opacity-80`}
                />
                <div className="relative text-center space-y-3">
                  <div className="text-4xl md:text-5xl mb-1">{benefit.icon}</div>
                  <h3 className="text-base md:text-lg font-bold text-white">{benefit.title}</h3>
                  <p className="text-sm text-slate-400 leading-snug">{benefit.description}</p>
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
