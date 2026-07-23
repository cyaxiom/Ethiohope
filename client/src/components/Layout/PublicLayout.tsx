import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const PublicLayout: React.FC = () => {
  return (
    <div className="public-shell flex flex-col min-h-screen bg-[#070b16] text-slate-100">
      <Navbar />
      <main className="flex-1 bg-[#070b16]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
