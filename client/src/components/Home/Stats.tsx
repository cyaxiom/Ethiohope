import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SectionContainer } from '../../components/ui/Container';
import { Heading, Text } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { UserPlus, BookOpen, CreditCard, Rocket, ArrowRight } from 'lucide-react';

/**
 * Step interface for TypeScript
 */
interface Step {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

export default function Stats() {
  const steps: Step[] = [
    {
      title: "1. Create Account",
      description: "Sign up and verify your email to secure your account.",
      icon: <UserPlus className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "2. Choose Program",
      description: "Browse and select the best coding program for your child.",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "3. Enroll & Schedule",
      description: "Add your child, pick a schedule, and complete payment.",
      icon: <CreditCard className="w-5 h-5" />,
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      title: "4. Start Learning",
      description: "Get credentials and begin the exciting coding journey.",
      icon: <Rocket className="w-5 h-5 text-white" />,
      color: "bg-primary text-white scale-110 shadow-lg shadow-primary/30"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-white">
      <SectionContainer containerSize="xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Heading variant="h2" className="text-foreground">
            Simple Steps to Get Started
          </Heading>
          <Text className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Experience the easy path to providing your child with world-class tech education.
          </Text>
        </div>

        <div className="relative mb-16">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-border z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:-translate-y-1 ${step.color} outline outline-4 outline-white shadow-sm z-10`}>
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

        <div className="flex justify-center mt-12">
          <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)}>
            <Button 
              className="rounded-full font-bold bg-gradient-to-r from-blue-600 to-green-500 dark:from-[#3C12D4] dark:to-[#3C12D4] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all px-10 py-4 h-auto"
              rightIcon={<ArrowRight className="w-4 h-4 ml-2" />}
            >
              See the full detailed journey
            </Button>
          </Link>
        </div>
      </SectionContainer>
    </section>
  );
}