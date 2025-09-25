import React from 'react';
React;
const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Ready to Start Your Child's Coding Journey?
        </h2>
        <p className="text-lg mb-8 text-muted-foreground">
          Join thousands of kids already learning to code with us
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg transition">
            Start Free Trial
          </button>
          <button className="border border-border text-foreground hover:bg-accent px-8 py-3 rounded-lg font-semibold text-lg transition">
            Watch Demo
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div>
            <div className="text-2xl font-bold text-foreground">
              5000+
            </div>
            <div className="text-sm text-muted-foreground">
              Happy Kids
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              98%
            </div>
            <div className="text-sm text-muted-foreground">
              Success Rate
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              4.9/5
            </div>
            <div className="text-sm text-muted-foreground">
              Parent Rating
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;