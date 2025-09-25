// @components/Navbar/MegaNavbar/SolutionsMegaMenu.jsx
import { CheckCircle, Star, Zap } from 'lucide-react';
import React from 'react';
React;

const SolutionsMegaMenu = ({ data, onClose }) => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-8">
        {/* Header */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-foreground mb-4">Solutions</h2>
          <p className="text-muted-foreground mb-6">{data.description}</p>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 p-4 rounded-xl">
            <h4 className="font-semibold text-foreground mb-2">
              Custom Solutions
            </h4>
            <p className="text-sm text-muted-foreground">
              Tailored to your specific needs and requirements
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
                  ? 'bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20'
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

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {item.delivery}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-cyan-600">
                  {item.price}
                </span>
                <button className="text-sm text-cyan-500 hover:text-cyan-600 transition-colors">
                  Get Started →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 pt-6 border-t border-border/20">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Why Choose Our Solutions?
        </h4>
        <div className="grid grid-cols-4 gap-4">
          {[
            '24/7 Support',
            'Expert Team',
            'Fast Delivery',
            'Money Back Guarantee',
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionsMegaMenu;
