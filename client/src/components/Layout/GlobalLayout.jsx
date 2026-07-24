import React from 'react';

// GlobalLayout applies the Kids Programming theme to all pages
export default function GlobalLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-muted/30 dark:bg-muted/60 text-foreground font-sans">
      {/* You can add a global header or footer here if needed */}
      {children}
    </div>
  );
}
