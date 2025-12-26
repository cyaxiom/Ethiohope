import React from 'react';
import { DS } from '@/constants/designSystem';
import { SectionContainer } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';

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
    <section className="relative text-foreground overflow-hidden bg-muted/30 dark:bg-muted/60 rounded-2xl shadow-xl border border-border">
      <SectionContainer sectionSpacing="xl" containerSize="xl">
        <div className={`${DS.grids.twoColumn} ${DS.spacing.gap.xl} items-center`}>
          {/* Left Side: Heading */}
          <div className="text-center lg:text-left">
            <Heading variant="h1" className="leading-tight">
              Join a <span className="text-primary">community</span>
            </Heading>
            <Heading variant="h1" className="mt-2">
              of millions.
            </Heading>
            <Text size="lg" className="mt-4 max-w-md mx-auto lg:mx-0 line-clamp-3">
              Powering the next generation of digital experiences with low costs and high scalability.
            </Text>
          </div>
          
          {/* Right Side: Stats */}
          <div className="flex flex-col gap-12">
            {stats.map((s, i) => (
              <div
                key={i} 
                className="group text-center lg:text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <p 
                  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105`}
                >
                  {s.value}
                </p>
                <Text size="sm" className="mt-2 uppercase tracking-widest font-medium line-clamp-1">
                  {s.label}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}