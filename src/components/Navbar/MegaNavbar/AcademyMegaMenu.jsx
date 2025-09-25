// @components/Navbar/MegaNavbar/AcademyMegaMenu.jsx
import { Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const AcademyMegaMenu = ({ data, onClose }) => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-8">
        {/* Header */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-foreground mb-4">Academy</h2>
          <p className="text-muted-foreground mb-6">{data.description}</p>
          {data.badge && (
            <span className="bg-cyan-500 text-white px-3 py-1 rounded-full text-sm">
              {data.badge}
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-3 grid grid-cols-2 gap-6">
          {data.dropdown.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={onClose}
              className={`block p-6 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer ${
                item.featured
                  ? 'bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20'
                  : 'bg-background border-border/20'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.name}
                  </h3>
                </div>
                {item.rating && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground mb-4 text-sm">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="bg-foreground/5 px-2 py-1 rounded">
                    {item.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    12 weeks
                  </span>
                </div>
                <span className="text-lg font-bold text-cyan-600">
                  {item.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20">
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">10K+</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">95%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">4.8/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyMegaMenu;
