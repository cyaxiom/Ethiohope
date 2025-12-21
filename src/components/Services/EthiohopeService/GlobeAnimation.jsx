import React from 'react';
import { motion } from 'framer-motion';

export const GlobeAnimation = ({ className = "max-w-md md:max-w-xl lg:max-w-2xl" }) => {
  return (
    <div className={`relative ${className} mx-auto`}>
      {/* Container with proper aspect ratio */}
      <div className="relative w-full aspect-square">
        {/* Animated Globe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Globe base with gradient */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-br 
                         from-blue-500/20 via-cyan-500/10 to-blue-600/20 
                         backdrop-blur-sm"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Rotating rings */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="ring1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="ring2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Main circle */}
              <motion.ellipse 
                cx="100" 
                cy="100" 
                rx="80" 
                ry="80" 
                fill="none" 
                stroke="url(#ring1)" 
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Rotating ellipse 1 */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
              >
                <ellipse 
                  cx="100" 
                  cy="100" 
                  rx="70" 
                  ry="30" 
                  fill="none" 
                  stroke="url(#ring1)" 
                  strokeWidth="0.5"
                />
              </motion.g>
              
              {/* Rotating ellipse 2 - opposite direction */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
              >
                <ellipse 
                  cx="100" 
                  cy="100" 
                  rx="70" 
                  ry="30" 
                  fill="none" 
                  stroke="url(#ring2)" 
                  strokeWidth="0.5"
                  transform="rotate(60 100 100)"
                />
              </motion.g>
              
              {/* Rotating ellipse 3 */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 100px" }}
              >
                <ellipse 
                  cx="100" 
                  cy="100" 
                  rx="70" 
                  ry="30" 
                  fill="none" 
                  stroke="url(#ring1)" 
                  strokeWidth="0.5"
                  transform="rotate(-60 100 100)"
                />
              </motion.g>
            </svg>

            {/* Pulsing connection dots */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 12;
                const radius = 40;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                      top: `${50 + radius * Math.sin(angle)}%`,
                      left: `${50 + radius * Math.cos(angle)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </div>

            {/* Center glow */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-20 h-20 rounded-full bg-blue-500/30 blur-xl" />
            </motion.div>

            {/* Orbiting particles */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * Math.PI * 2) / 6;
              const radius = 35;
              return (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos(angle) * radius,
                      Math.cos(angle + Math.PI * 2) * radius,
                    ],
                    y: [
                      Math.sin(angle) * radius,
                      Math.sin(angle + Math.PI * 2) * radius,
                    ],
                  }}
                  transition={{
                    duration: 10 + i,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Connection lines effect */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.line 
            x1="50%" 
            y1="20%" 
            x2="50%" 
            y2="80%" 
            stroke="url(#lineGradient)" 
            strokeWidth="1"
            animate={{ strokeOpacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.line 
            x1="20%" 
            y1="50%" 
            x2="80%" 
            y2="50%" 
            stroke="url(#lineGradient)" 
            strokeWidth="1"
            animate={{ strokeOpacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>

        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 blur-2xl animate-pulse" />
      </div>
    </div>
  );
};

export default GlobeAnimation;
