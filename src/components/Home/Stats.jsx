import React from 'react';

export default function Stats() {
  const stats = [
    { 
      value: "11.5M+", 
      label: "Active Accounts",
      gradient: "from-purple-400 to-cyan-300" 
    },
    { 
      value: "21.9M", 
      label: "NFTs Minted",
      gradient: "from-blue-500 to-cyan-400" 
    },
    { 
      value: "$0.00025", 
      label: "Avg. Cost Per Transaction",
      gradient: "from-teal-400 to-fuchsia-400" 
    },
  ];
  return (
    <section className="relative py-24 px-6 sm:px-12 text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-16 bg-background">
        
        {/* Left Side: Heading */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Join a <span className="text-primary">community</span>
          </h2>
          <h3 className="text-4xl sm:text-5xl font-semibold mt-2">
            of millions.
          </h3>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto lg:mx-0">
            Powering the next generation of digital experiences with low costs and high scalability.
          </p>
        </div>
        {/* Right Side: Stats */}
        <div className="flex-1 flex flex-col gap-12">
          {stats.map((s, i) => (
            <div
              key={i} 
              className="group text-center lg:text-left transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Gradient Value */}
              <p 
                className={`text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105`}
              >
                {s.value}
              </p>
              {/* Label */}
              <p className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}