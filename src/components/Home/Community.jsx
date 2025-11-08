import React from 'react';

import image1 from '@images/community/IMAGE-1.png';
import image2 from '@images/community/IMAGE-2.png';
import image3 from '@images/community/IMAGE-3.png';
import image4 from '@images/community/IMAGE-4.png';
import image5 from '@images/community/IMAGE.png';


export default function Community() {
  return (
    <div className="container  mx-auto px-4 py-16 bg-background">
      
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-foreground text-center mb-16">
        Join a thriving community
      </h1>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          // Stats now use theme colors: Primary (Green), Accent (Lighter Green), Warning (Amber)
          { number: "11,000", color: "text-primary", label: "SOLANA HACKER HOUSE PARTICIPANTS" },
          { number: "48,000", color: "text-accent", label: "DEVELOPERS BUILDING DURING SOLANA HACKATHONS" },
          { number: "3,800", color: "text-warning", label: "SOLANA BREAKPOINT 2022 ATTENDEES" },
        ].map((stat, index) => (
          <div
            key={index}
            // Uses bg-card, border, and thematic hover shadow
            className="p-6 rounded-xl border border-border shadow-lg 
                       hover:shadow-xl hover:shadow-primary/10 
                       transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`text-4xl font-bold mb-3 ${stat.color}`}>{stat.number}</div>
            <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
        <div className="col-span-1 md:col-span-2">
          <img
            src={image1}
            alt="Community event"
            className="w-full h-auto rounded-xl shadow-lg border border-border aspect-video object-cover
                       hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <img
            src={image2}
            alt="Hackathon"
            className="w-full h-auto rounded-xl shadow-lg border border-border object-cover"
          />
          <img
            src={image3}
            alt="Workshop"
            className="w-full h-auto rounded-xl shadow-lg border border-border object-cover"
          />
        </div>
        <div className="col-span-1">
          <img
            src={image4}
            alt="Speaker"
            className="w-full h-auto rounded-xl shadow-lg border border-border object-cover aspect-video md:aspect-auto
                       hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          />
        </div>
      </div>

      {/* CTA Section  */}
      <div 
        className="
          p-12  relative overflow-hidden 
          
          /* Light Mode Gradient: Primary to Accent (Green shades) */
          bg-gradient-to-r from-primary/90 to-accent 
          
          /* Dark Mode Gradient: Secondary (Dark Gray) to Primary (Green) */
          dark:bg-gradient-to-r dark:from-secondary dark:to-primary/90 
          dark:shadow-accent/40
        "
      >
        

        <div className="relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl mb-8 text-foreground font-semibold dark:from-secondary dark:to-primary/90">
            It's time to join the thousands of creators, artists, and developers using Solana
          </h2>
          <button 
          onClick={() => window.open("#", "_blank")}
            // Button uses primary color and proper foreground text
            className="bg-primary hover:bg-accent px-10 py-4 rounded-full font-bold text-primary-foreground 
                       transition-all duration-300 transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-primary/40">
            START BUILDING
          </button>
        </div>
      </div>
    </div>
  );
}
