"use client";

import { Logo } from "./logo";
import { NavbarRoutes } from "./navbar-routes";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full flex flex-col bg-black/95 backdrop-blur-xl text-white border-gray-800/50 shadow-2xl">
      {/* Logo section */}
      <div className="p-6 border-b border-gray-800/50 flex justify-center items-center">
        <Logo />
      </div>

      {/* Scrollable nav section with NavbarRoutes on top */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent">
        {/* Top stacked NavbarRoutes */}
        <div className="group flex items-center gap-x-3 text-sm font-medium">
          <NavbarRoutes />
        </div>

        {/* Sidebar navigation links */}
        <SidebarRoutes />
      </div>
    </aside>
  );
};