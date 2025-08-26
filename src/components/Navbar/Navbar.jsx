import React from 'react';
import { ThemeToggle } from '@components/ThemeToggle/ThemeToggle';

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>Logo</div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
