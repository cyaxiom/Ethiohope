import React from 'react';
import { SectionContainer } from '@/components/ui/Container';
import { Display, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-muted/30 dark:bg-muted/60 py-16 md:py-24">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none z-0">
        <div className="w-96 h-96 rounded-full blur-3xl opacity-20 bg-purple-300 dark:bg-purple-900"></div>
      </div>
      
      <SectionContainer containerSize="lg">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="space-y-8 text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold tracking-wide border border-purple-200">
              PROGRAMMING FOR KIDS
            </span>
            
            <Display className="leading-tight text-4xl sm:text-5xl lg:text-6xl text-foreground font-extrabold max-w-2xl">
              Build Real Skills <br />
              <span className="text-primary font-extrabold pb-2 inline-block">
                for the Future
              </span>
            </Display>

            <Text size="lg" className="max-w-xl text-muted-foreground font-medium pr-4">
              Coding, AI, and Tech Programs specifically designed for curious kids and ambitious adults. Master the languages of tomorrow today.
            </Text>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-primary-foreground font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                Start Learning
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-semibold px-8 py-6 rounded-full border-2 hover:bg-muted transition-all duration-300 flex items-center justify-center"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 text-primary flex items-center justify-center mr-2">
                  <Play className="w-3 h-3 ml-0.5 fill-current" />
                </div>
                Watch How it Works
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative isolate">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-transparent dark:from-purple-900/30 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>
            <img 
              src="/hero-image.png" 
              alt="African student learning to code"
              className="rounded-[2rem] object-cover w-full h-[300px] sm:h-[400px] lg:h-[500px] shadow-2xl border-4 border-white/10"
            />
            
            {/* Floating decorator 1 */}
            <div className="absolute top-10 -right-5 sm:-right-8 w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center animate-bounce duration-1000">
              <span className="text-primary text-2xl font-bold">{'{ }'}</span>
            </div>
            
            {/* Floating decorator 2 */}
            <div className="absolute bottom-10 -left-6 sm:-left-10 w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-xl flex items-center justify-center p-3">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl font-bold">{'< >'}</span>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}