import React from 'react';
import Hero from '@components/Home/Hero';
import Stats from '@components/Home/Stats';
import Features from '@components/Home/Features';
import Growth from '@components/Home/Growth';
import Partners from '@components/Home/Partner';
import Community from '@components/Home/Community';

function Home() {
  return (
    <div className="pt-20 font-sans px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      <Hero />
      <Partners />
      <Stats />
      <Features />
      <Growth />
      <Community />
      </div>
    </div>
  );
}

export default Home;
