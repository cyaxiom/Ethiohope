import React from 'react';
import { SectionContainer } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export default function Community() {
  return (
    <section className="relative py-16 md:py-24 bg-white dark:bg-muted/30">
      <SectionContainer containerSize="lg">
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-12 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-gradient-to-b from-blue-900/40 to-transparent pointer-events-none blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <Heading variant="h2" className="text-white mb-6 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Start your learning journey today
            </Heading>
            
            <Text size="lg" className="text-slate-300 mb-10 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
              Join thousands of students building the future of technology in Ethiopia and beyond. It's your experience, lead.
            </Text>
            
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-500 text-white border-0 font-bold px-12 py-7 rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 text-lg"
            >
              Get Started
            </Button>
          </div>
          
          {/* Decorative floating dots */}
          <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-blue-400 opacity-50"></div>
          <div className="absolute bottom-1/4 right-16 w-3 h-3 rounded-full bg-purple-500 opacity-50"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-40"></div>
        </div>
      </SectionContainer>
    </section>
  );
}
