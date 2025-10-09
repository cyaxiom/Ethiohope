import React from 'react';
import Hero from '@components/Home/Hero';
import Stats from '@components/Home/Stats';
import Features from '@components/Home/Features';
import Growth from '@components/Home/Growth';
import Partners from '@components/Home/Partner';
import Community from '@components/Home/Community';

function Home() {
  return (
    <div className=" font-sans">
      <Hero />
      <Partners />
      <Stats />
      <Features />
      <Growth />
      <Community />
    </div>
  );
}

export default Home;
