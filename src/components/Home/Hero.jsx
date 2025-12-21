import React from 'react';
import { SectionContainer } from '@/components/ui/Container';
import { Display, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative text-center overflow-hidden bg-background">
      <SectionContainer sectionSpacing="2xl" containerSize="md">
        <div className="space-y-6">
          <Display className="leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Powerful for developers. <br />
            <span className="text-muted-foreground">Fast for everyone.</span>
          </Display>

          <Text size="xl" className="max-w-3xl mx-auto line-clamp-3 text-base sm:text-lg md:text-xl">
            Bring blockchain to the people. Solana supports experiences for power
            users, new consumers, and everyone in between.
          </Text>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => window.open("#", "_blank")}
            >
              Start Building
            </Button>

            <Button
              variant="outline"
              size="lg"
              rightIcon={<BookOpen className="w-5 h-5" />}
              onClick={() => window.open("#", "_blank")}
            >
              Read Docs
            </Button>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}