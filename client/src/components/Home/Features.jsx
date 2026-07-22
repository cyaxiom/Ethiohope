import React from 'react';
import { SectionContainer } from '@/components/ui/Container';
import { Heading, Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Code, Terminal, Cpu } from 'lucide-react';

export default function Features() {
  const programs = [
    {
      title: "Basic Level",
      subtitle: "Foundational Coding",
      description: "Perfect starting point for beginners. Learn the basics of logic and programming fundamentals.",
      price: "$100",
      icon: <Terminal className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600 border-blue-200"
    },
    {
      title: "Intermediate",
      subtitle: "Web & Game Development",
      description: "Step up to building interactive websites and engaging games using standard frameworks.",
      price: "$150",
      icon: <Code className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600 border-purple-200"
    },
    {
      title: "Advanced",
      subtitle: "AI & Data Science",
      description: "Master complex algorithms, machine learning basics, and advanced data structures.",
      price: "$200",
      icon: <Cpu className="w-6 h-6" />,
      color: "bg-cyan-100 text-cyan-600 border-cyan-200"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-white dark:bg-muted/30">
      <SectionContainer containerSize="xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <Heading variant="h2" className="mb-4 text-left">
              Our Specialized Programs
            </Heading>
            <Text className="text-left text-muted-foreground text-lg">
              Curated paths for every skill level, from first steps in logic to advanced artificial intelligence.
            </Text>
          </div>
          <a filter href="#" className="hidden md:flex items-center text-primary font-semibold hover:underline mt-4 md:mt-0">
            View All Programs <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, idx) => (
            <Card
              key={idx}
              padding="xl"
              className="group flex flex-col h-full bg-white dark:bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 rounded-3xl"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${prog.color}`}>
                {prog.icon}
              </div>
              <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                {prog.title}
              </p>
              <Heading variant="h4" className="mb-4 group-hover:text-primary transition-colors">
                {prog.subtitle}
              </Heading>
              <Text className="text-muted-foreground mb-8 flex-grow">
                {prog.description}
              </Text>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                <span className="text-3xl font-extrabold text-foreground">{prog.price}</span>
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold px-4">
                  View Program
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
