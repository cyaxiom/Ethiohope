import React from 'react';
import NavBar from '@components/Forum/NavBar';
import avatar from '@images/avatar.png';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/Forum/Sidebar';
import RightPanel from '@components/Forum/RightPanel';
function Forum() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

  const user = {
    name: 'John Doe',
    avatar: avatar,
    notifications: 3,
  };
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1115] text-foreground transition-colors duration-300">
      <NavBar user={user} />
      <div className="flex">
        {/* sidebar*/}
        <aside className="hidden md:flex fixed md:w-[310px] border-r border-border h-full bg-card">
          <Sidebar isLoggedIn={isLoggedIn} />
        </aside>
        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto ml-1 md:ml-[310px]">
          <Outlet />
        </main>
        {/* Right panel */}
        <aside className="hidden lg:block w-60 border-l border-border p-4 bg-card">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}

export default Forum;
