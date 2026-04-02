import React from 'react';
import { SectionContainer } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { UserPlus, UserCircle, LayoutGrid, Rocket } from 'lucide-react';

export default function Stats() {
  const steps = [
    {
      title: "1. Create Account",
      description: "Sign up for your free personal account in seconds.",
      icon: <UserPlus className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "2. Add Child",
      description: "Set up a profile with their age and interests.",
      icon: <UserCircle className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "3. Select Program",
      description: "Choose the best learning path for your child.",
      icon: <LayoutGrid className="w-5 h-5" />,
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      title: "4. Play & Learn",
      description: "Let your child dive into the world of creative learning.",
      icon: <Rocket className="w-5 h-5 text-white" />,
      color: "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-white dark:bg-muted/30">
      <SectionContainer containerSize="xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Heading variant="h2" className="text-foreground">
            Simple Steps to Get Started
          </Heading>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-border z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-1 ${step.color} outline outline-4 outline-white dark:outline-background`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}