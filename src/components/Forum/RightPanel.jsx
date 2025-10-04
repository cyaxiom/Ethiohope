import React from 'react';
export default function RightPanel() {
  return (
    <div className="hidden lg:block fixed">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Must-read posts</h3>
          <ul className="space-y-1 text-sm text-blue-600">
            <li>
              <a href="#">Please read rules...</a>
            </li>
            <li>
              <a href="#">Vision & Strategy...</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Featured links</h3>
          <ul className="space-y-1 text-sm text-blue-600">
            <li>
              <a href="#">Source code on GitHub</a>
            </li>
            <li>
              <a href="#">Golang best-practices</a>
            </li>
            <li>
              <a href="#">School dashboard</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
