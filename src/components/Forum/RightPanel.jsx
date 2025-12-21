import React from 'react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
export default function RightPanel() {
  return (
    <div className="hidden lg:block fixed">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 text-foreground">Must-read posts</h3>
          <ul className="space-y-1 text-sm text-primary">
            <li>
              <a href="#" className="hover:underline">Please read rules...</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Vision & Strategy...</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-foreground">Featured links</h3>
          <ul className="space-y-1 text-sm text-primary">
            <li>
              <a href="#" className="hover:underline">Source code on GitHub</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Golang best-practices</a>
            </li>
            <li>
              <a href="#" className="hover:underline">School dashboard</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
