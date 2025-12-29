import React from 'react';
import { SectionContainer } from '@/components/ui/Container';
import { Display, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Hero() {
  // Kids Programming theme: bg-muted/30, gradients, text-foreground, text-primary
  return (
    <section className="relative text-center overflow-hidden bg-muted/30 dark:bg-muted/60">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none z-0">
        <div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-blue-300 dark:bg-blue-700"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0">
        <div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-purple-300 dark:bg-purple-700"></div>
      </div>
      <SectionContainer sectionSpacing="2xl" containerSize="md">
        <div className="space-y-6 relative z-10">
          <Display className="leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground font-extrabold">
            SECURING <br />
            <span className="text-primary font-extrabold">
              Your Organization's Digital<br />Landscape From Cyber Risks
            </span>
          </Display>

          <Text size="xl" className="max-w-3xl mx-auto line-clamp-3 text-base sm:text-lg md:text-xl text-muted-foreground font-semibold">
            Explore Solutions
          </Text>
          {/* If you want a button instead of subtitle, uncomment below and remove the <Text> above */}
          {/*
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              className="text-primary-foreground"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => window.open("#", "_blank")}
            >
              Explore Solutions
            </Button>
          </div>
          */}
        </div>
      </SectionContainer>
    </section>
  );
}