import React from 'react';
import Hero from '@components/Home/Hero';
import Features from '@components/Home/Features';
import Growth from '@components/Home/Growth';
import Stats from '@components/Home/Stats';
import Community from '@components/Home/Community';

function Home() {
  return (
    <div className="pt-20 font-sans px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/60 text-foreground overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto space-y-8 sm:space-y-16">
        <Hero />
        <Features />
        <Growth />
        <Stats />
        <Community />
      </div>
    </div>
  );
}

export default Home;
