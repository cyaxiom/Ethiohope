// @components/Navbar/MegaNavbar/CompanyMegaMenu.jsx
import { Award, Building, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyMegaMenu = ({ data, onClose }) => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-8">
        {/* Header */}
        <div className="col-span-1">
          <h2 className="text-2xl font-bold text-foreground mb-4">Company</h2>
          
          <p className="text-muted-foreground mb-6">{data.description}</p>
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-4 rounded-xl">
            <h4 className="font-semibold text-foreground mb-2">
              Why Choose Us?
            </h4>
            <p className="text-sm text-muted-foreground">
              Trusted by thousands of users worldwide with proven track record
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
                  ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20'
                  : 'bg-background border-border/20'
              }`}
            >
              <Link 
                to={item.path} 
                onClick={onClose}
                className="hover:text-cyan-500"
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
                  <div className="flex items-center gap-2 text-sm text-cyan-600">
                    <Award className="w-4 h-4" />
                    <span>{item.stats}</span>
                  </div>
                )}

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mt-4"
                  />
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>50+ Team Members</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="w-4 h-4" />
            <span>Global Presence</span>
          </div>
        </div>
        <Link 
          to="/about" 
          onClick={onClose}
          className="text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          View Company Overview →
        </Link>
      </div>
    </div>
  );
};

export default CompanyMegaMenu;
