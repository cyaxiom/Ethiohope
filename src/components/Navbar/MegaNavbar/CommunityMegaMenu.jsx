// @components/Navbar/MegaNavbar/CommunityMegaMenu.jsx
import { Calendar, Star } from 'lucide-react';
import React from 'react';
React;

const CommunityMegaMenu = ({ data, onClose }) => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-8">
        {/* Header */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-foreground mb-4">Community</h2>
          <p className="text-muted-foreground mb-6">{data.description}</p>
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 p-4 rounded-xl">
            <h4 className="font-semibold text-foreground mb-2">Join Today!</h4>
            <p className="text-sm text-muted-foreground">
              Connect with like-minded individuals and grow together
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-3 grid grid-cols-3 gap-6">
          {data.dropdown.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                item.featured
                  ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20'
                  : 'bg-background border-border/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.name}
                </h3>
              </div>

              <p className="text-muted-foreground mb-4 text-sm">
                {item.description}
              </p>

              {item.stats && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Star className="w-4 h-4" />
                  <span>{item.stats}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events Calendar Preview */}
      <div className="mt-8 pt-6 border-t border-border/20">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Upcoming Events
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {['Web3 Workshop', 'Community Meetup', 'Hackathon'].map(
            (event, index) => (
              <div
                key={index}
                className="p-4 bg-background border border-border/20 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Next Week</span>
                </div>
                <h5 className="font-medium text-foreground">{event}</h5>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityMegaMenu;
