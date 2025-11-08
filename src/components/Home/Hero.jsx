import React from 'react';


export default function Hero() {
  return (
    
    <section className="h-80% relative text-center px-6 py-20 md:py-32 overflow-hidden bg-background">
      

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Powerful for developers. <br />
          <span className="text-muted-foreground">Fast for everyone.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Bring blockchain to the people. Solana supports experiences for power
          users, new consumers, and everyone in between.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* --- Primary Button --- */}
          <button
            onClick={() => window.open("#", "_blank")}
            className="
              px-8 py-3 w-full sm:w-auto rounded-lg font-semibold
              bg-primary text-primary-foreground
              transition-all duration-300 ease-in-out
              hover:bg-accent hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
            "
          >
            Start Building
          </button>

          {/* --- Secondary Button --- */}
          <button
            onClick={() => window.open("#", "_blank")}
            className="
              px-8 py-3 w-full sm:w-auto rounded-lg font-semibold
              border border-border bg-transparent text-foreground
              transition-all duration-300 ease-in-out
              hover:bg-secondary hover:border-accent hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
            "
          >
            Read Docs
          </button>
        </div>
      </div>
    </section>
  );
}