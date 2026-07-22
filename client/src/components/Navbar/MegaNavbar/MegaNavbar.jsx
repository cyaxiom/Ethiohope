// @components/Navbar/MegaNavbar/MegaNavbar.jsx
import React from 'react';
import CompanyMegaMenu from './CompanyMegaMenu';
import CommunityMegaMenu from './CommunityMegaMenu';
import AcademyMegaMenu from './AcademyMegaMenu';
import SolutionsMegaMenu from './SolutionsMegaMenu';

const MegaNavbar = ({ activeNavItem, navData, onClose }) => {
  if (!activeNavItem) return null;

  const renderMegaMenu = () => {
    switch (activeNavItem.name) {
      case 'Company':
        return <CompanyMegaMenu data={navData} onClose={onClose} />;
      case 'Community':
        return <CommunityMegaMenu data={navData} onClose={onClose} />;
      case 'Academy':
        return <AcademyMegaMenu data={navData} onClose={onClose} />;
      case 'Solutions':
        return <SolutionsMegaMenu data={navData} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-16 left-0 w-full bg-background border-b border-border/20 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto">{renderMegaMenu()}</div>
    </div>
  );
};

export default MegaNavbar;
