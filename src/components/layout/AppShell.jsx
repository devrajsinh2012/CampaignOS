import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useStore from '../../store/store';

export default function AppShell() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-navy-950">
      <Sidebar />
      <main
        className={`transition-all duration-300 min-h-screen
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
