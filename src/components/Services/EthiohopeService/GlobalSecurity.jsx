import React from "react";
import GlobeAnimation from "./GlobeAnimation";

const GlobalSecurity = () => {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              Global Coverage
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Security Solutions
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Across the Globe
              </span>
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Protecting businesses worldwide with cutting-edge cybersecurity technology. 
              Our global network ensures 24/7 monitoring and instant threat response.
            </p>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">150+</div>
                <div className="text-muted-foreground text-sm">Countries Protected</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">99.9%</div>
                <div className="text-muted-foreground text-sm">Uptime Guarantee</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">10M+</div>
                <div className="text-muted-foreground text-sm">Threats Blocked</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">&lt;1ms</div>
                <div className="text-muted-foreground text-sm">Response Time</div>
              </div>
            </div>
          </div>

          {/* Right Globe Animation */}
          <div className="flex justify-center lg:justify-end">
            <GlobeAnimation className="w-full max-w-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalSecurity;
