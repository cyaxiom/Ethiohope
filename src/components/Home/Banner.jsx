import React from 'react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';

function Banner() {
  //   const { theme, isDark, toggleTheme } = useTheme();
  const { theme } = useTheme();
  //   console.log('Current theme is:', theme);
  //   console.log('Is dark mode?', isDark);
  //   console.log('Toggle theme function:', toggleTheme);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-border border rounded-2xl p-12 text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-primary text-4xl">⚡</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-primary">EthioHope</h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Blockchain-powered solutions for transparent, sustainable change
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Explore Technology
          </button>
        </div>

        {/* Mini Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-card border-border border rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center mb-3 mx-auto">
              <span className="text-success">🔗</span>
            </div>
            <h3 className="font-semibold mb-1">Blockchain</h3>
            <p className="text-sm text-muted-foreground">
              Transparent systems for impact tracking
            </p>
          </div>

          <div className="bg-card border-border border rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center mb-3 mx-auto">
              <span className="text-info">🤖</span>
            </div>
            <h3 className="font-semibold mb-1">AI Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Optimizing resource allocation
            </p>
          </div>

          <div className="bg-card border-border border rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center mb-3 mx-auto">
              <span className="text-warning">🌐</span>
            </div>
            <h3 className="font-semibold mb-1">Web3</h3>
            <p className="text-sm text-muted-foreground">
              Decentralized community empowerment
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground">
          Current theme: {theme} mode
        </p>
      </div>
    </div>
  );
}

export default Banner;
