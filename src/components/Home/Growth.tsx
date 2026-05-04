import React from 'react';
import { SectionContainer } from '../../components/ui/Container';
import { Heading, Text } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function Growth() {
  const benefits = [
    "Track kid's progress in learning",
    "Smart dashboard with instructions",
    "Receive a schedule of updated timelines"
  ];

  return (
    <section className="relative py-16 md:py-24 bg-muted/30">
      <SectionContainer containerSize="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left side: Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-blue-100 rounded-[3rem] transform -rotate-3 scale-105 -z-10"></div>
            <img 
              src="/parent-child.png" 
              alt="Parent and child learning together"
              className="rounded-[3rem] object-cover w-full h-[400px] md:h-[500px] shadow-2xl"
            />
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-border">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Progress Updated</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
          </div>
          
          {/* Right side: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <Heading variant="h2" className="text-left text-foreground">
              Manage Your Child's Learning Easily
            </Heading>
            
            <Text className="text-left text-muted-foreground text-lg">
              Empower yourself with real-time insights into your child's educational journey. Our comprehensive dashboard lets you track progress in a friendly format, allowing you to easily support your kids where they need you most.
            </Text>
            
            <ul className="space-y-5 pt-4">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-4 text-foreground font-medium text-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
            
            {/* Follow Track button removed per request */}
          </div>
          
        </div>
      </SectionContainer>
    </section>
  );
}
