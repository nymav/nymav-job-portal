"use client";

import { MobileSideBar } from "./mobile-side-bar";
import { Logo } from "./logo";
import { NavbarRoutes } from "./navbar-routes";

export const Navbar = () => (
  <nav aria-label="Main navigation" className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
    <div className="flex items-center gap-3">
      <div className="md:hidden"><MobileSideBar /></div>
      <div className="md:hidden"><Logo /></div>
      <span className="hidden md:block text-sm text-gray-400">Your career workspace</span>
    </div>
    <NavbarRoutes />
  </nav>
);
