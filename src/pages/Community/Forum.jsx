import React from 'react';
import NavBar from '@components/Forum/NavBar';
import avatar from '@images/avatar.png';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/Forum/Sidebar';
import RightPanel from '@components/Forum/RightPanel';
function Forum() {
  //theme
  const [theme, isDark, toggleTheme] = React.useState('light');
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

  const user = {
    name: 'John Doe',
    avatar: avatar,
    notifications: 3,
  };
  return (
    <div className="min-h-screen  bg-card-foreground text-foreground transition-colors duration-300">
      <NavBar user={user} />
      <div className="flex">
        {/* sidebar*/}
        <aside className="w-[310px] border-r border-border fixed h-full">
          <Sidebar isLoggedIn={isLoggedIn} />
        </aside>
        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auth ml-[310px]">
          <Outlet />
        </main>
        {/* Right panel */}
        <aside className="hidden lg:block w-80 border-l border-border p-4">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}

export default Forum;
